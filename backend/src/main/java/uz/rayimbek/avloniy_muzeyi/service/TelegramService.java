package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import uz.rayimbek.avloniy_muzeyi.entity.Contact;
import uz.rayimbek.avloniy_muzeyi.entity.SiteSetting;
import uz.rayimbek.avloniy_muzeyi.repository.SiteSettingRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TelegramService {

    private final SiteSettingRepository siteSettingRepository;

    @Value("${telegram.bot.token:}")
    private String fallbackBotToken;

    @Value("${telegram.bot.chat-id:}")
    private String fallbackChatId;

    private final RestTemplate restTemplate = createRestTemplate();

    private static RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(5000);
        return new RestTemplate(factory);
    }

    /**
     * Yangi kontakt murojaati kelganda Telegram guruhiga bildirishnoma yuborish.
     * Bu jarayon asosiy operatsiyani to'xtatib qo'ymasligi uchun xavfsiz ishlaydi.
     */
    @Async
    public void sendContactNotification(Contact contact) {
        try {
            SiteSetting settings = siteSettingRepository.findFirstByOrderByIdAsc().orElse(null);

            String botToken = (settings != null && settings.getTelegramBotToken() != null && !settings.getTelegramBotToken().isBlank())
                    ? settings.getTelegramBotToken().trim()
                    : fallbackBotToken;

            String chatId = (settings != null && settings.getTelegramChatId() != null && !settings.getTelegramChatId().isBlank())
                    ? settings.getTelegramChatId().trim()
                    : fallbackChatId;

            Boolean enabled = (settings != null && settings.getTelegramNotificationsEnabled() != null)
                    ? settings.getTelegramNotificationsEnabled()
                    : true;

            if (!enabled || botToken == null || botToken.isBlank() || chatId == null || chatId.isBlank()) {
                log.debug("Telegram bildirishnomalari o'chirilgan yoki token/chatId sozlanmagan");
                return;
            }

            String text = buildMessageText(contact);
            sendMessage(botToken, chatId, text);
        } catch (Exception e) {
            log.error("Telegram bildirishnomasi yuborishda kutilmagan xatolik: {}", e.getMessage());
        }
    }

    private String buildMessageText(Contact contact) {
        String name = escapeHtml(contact.getName());
        String phone = contact.getPhone() != null && !contact.getPhone().isBlank() ? escapeHtml(contact.getPhone()) : "<i>Ko'rsatilmagan</i>";
        String telegram = contact.getTelegram() != null && !contact.getTelegram().isBlank() ? escapeHtml(contact.getTelegram()) : "<i>Ko'rsatilmagan</i>";
        String subject = contact.getSubject() != null && !contact.getSubject().isBlank() ? escapeHtml(contact.getSubject()) : "<i>Mavzusiz</i>";
        String message = escapeHtml(contact.getMessage());
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"));

        return "🏛 <b>Yangi Murojaat Kelib Tushdi!</b> (Jadidlar Portali)\n\n"
                + "👤 <b>Ism:</b> " + name + "\n"
                + "📞 <b>Telefon:</b> " + phone + "\n"
                + "✈️ <b>Telegram:</b> " + telegram + "\n"
                + "📌 <b>Mavzu:</b> " + subject + "\n\n"
                + "💬 <b>Xabar matni:</b>\n" + message + "\n\n"
                + "⏰ <i>Yuborilgan vaqt: " + time + "</i>";
    }

    private void sendMessage(String botToken, String chatId, String htmlText) {
        String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("chat_id", chatId);
        body.put("text", htmlText);
        body.put("parse_mode", "HTML");
        body.put("disable_web_page_preview", true);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, request, String.class);
            log.info("Telegram xabari muvaffaqiyatli yuborildi. ChatId: {}", chatId);
        } catch (Exception e) {
            log.warn("Telegram Bot API ga yuborishda xato: {}", e.getMessage());
        }
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;");
    }
}
