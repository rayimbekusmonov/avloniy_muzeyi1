package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import uz.rayimbek.avloniy_muzeyi.dto.request.TranslateRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.TranslateResponse;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class TranslateService {

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private static final Pattern SENTENCE_PATTERN = Pattern.compile("\\[\"((?:[^\"\\\\]|\\\\.)*)\",\"((?:[^\"\\\\]|\\\\.)*)\"");

    /**
     * Translates a single text or batch map of texts from source language (default "uz")
     * to requested target languages (default "ru", "en").
     */
    public TranslateResponse translate(TranslateRequest request) {
        String sourceLang = (request.getSourceLang() != null && !request.getSourceLang().isBlank())
                ? request.getSourceLang() : "uz";

        List<String> targetLangs = (request.getTargetLangs() != null && !request.getTargetLangs().isEmpty())
                ? request.getTargetLangs() : List.of("ru", "en");

        TranslateResponse response = new TranslateResponse();
        response.setSourceLang(sourceLang);

        // Single text mode
        if (request.getText() != null && !request.getText().isBlank()) {
            Map<String, String> translations = new HashMap<>();
            for (String targetLang : targetLangs) {
                String translated = translateSingle(request.getText(), sourceLang, targetLang);
                translations.put(targetLang, translated);
            }
            response.setTranslations(translations);
        }

        // Batch texts mode (e.g. name, title, bio, quote)
        if (request.getTexts() != null && !request.getTexts().isEmpty()) {
            Map<String, Map<String, String>> batchTranslations = new HashMap<>();
            for (String targetLang : targetLangs) {
                Map<String, String> langMap = new HashMap<>();
                for (Map.Entry<String, String> entry : request.getTexts().entrySet()) {
                    String fieldKey = entry.getKey();
                    String fieldValue = entry.getValue();
                    if (fieldValue != null && !fieldValue.isBlank()) {
                        String translated = translateSingle(fieldValue, sourceLang, targetLang);
                        langMap.put(fieldKey, translated);
                    } else {
                        langMap.put(fieldKey, "");
                    }
                }
                batchTranslations.put(targetLang, langMap);
            }
            response.setBatchTranslations(batchTranslations);
        }

        return response;
    }

    /**
     * Translates single string using Google Translate GTX free API
     */
    public String translateSingle(String text, String sourceLang, String targetLang) {
        if (text == null || text.isBlank()) return "";
        try {
            String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
            String url = String.format(
                    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=%s&tl=%s&dt=t&q=%s",
                    sourceLang, targetLang, encodedText
            );

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(Duration.ofSeconds(15))
                    .GET()
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (resp.statusCode() == 200) {
                return parseGtxResponse(resp.body());
            } else {
                log.warn("Translation API returned status {}: {}", resp.statusCode(), resp.body());
            }
        } catch (Exception e) {
            log.error("Failed to translate text from {} to {}: {}", sourceLang, targetLang, e.getMessage());
        }
        return text; // Return original on error
    }

    private String parseGtxResponse(String json) {
        if (json == null || !json.startsWith("[[[")) return "";
        try {
            StringBuilder sb = new StringBuilder();
            Matcher matcher = SENTENCE_PATTERN.matcher(json);
            while (matcher.find()) {
                String translatedSentence = matcher.group(1);
                translatedSentence = unescapeJavaString(translatedSentence);
                sb.append(translatedSentence);
            }
            return sb.toString();
        } catch (Exception e) {
            log.warn("Failed to parse translation response: {}", e.getMessage());
        }
        return "";
    }

    private String unescapeJavaString(String st) {
        if (st == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < st.length(); i++) {
            char ch = st.charAt(i);
            if (ch == '\\' && i + 1 < st.length()) {
                char next = st.charAt(i + 1);
                if (next == 'n') { sb.append('\n'); i++; }
                else if (next == 'r') { sb.append('\r'); i++; }
                else if (next == 't') { sb.append('\t'); i++; }
                else if (next == '"') { sb.append('\"'); i++; }
                else if (next == '\\') { sb.append('\\'); i++; }
                else if (next == 'u' && i + 5 < st.length()) {
                    try {
                        int code = Integer.parseInt(st.substring(i + 2, i + 6), 16);
                        sb.append((char) code);
                        i += 5;
                    } catch (Exception e) {
                        sb.append(ch);
                    }
                } else {
                    sb.append(next);
                    i++;
                }
            } else {
                sb.append(ch);
            }
        }
        return sb.toString();
    }
}
