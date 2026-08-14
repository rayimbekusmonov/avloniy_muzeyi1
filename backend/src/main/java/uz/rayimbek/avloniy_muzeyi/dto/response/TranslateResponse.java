package uz.rayimbek.avloniy_muzeyi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranslateResponse {
    private String sourceLang;
    // For single text translation: { "ru": "...", "en": "..." }
    private Map<String, String> translations;
    // For batch fields translation: { "ru": { "title": "...", "bio": "..." }, "en": { "title": "...", "bio": "..." } }
    private Map<String, Map<String, String>> batchTranslations;
}
