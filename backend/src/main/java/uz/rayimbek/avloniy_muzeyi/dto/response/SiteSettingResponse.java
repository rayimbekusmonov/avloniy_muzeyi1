package uz.rayimbek.avloniy_muzeyi.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettingResponse {

    private Long id;

    // Multi-language raw fields
    private String museumNameUz;
    private String museumNameRu;
    private String museumNameEn;

    private String phone;
    private String email;
    private String telegram;
    private String addressUz;
    private String addressRu;
    private String addressEn;
    private String workingHoursUz;
    private String workingHoursRu;
    private String workingHoursEn;

    private String telegramUrl;
    private String instagramUrl;
    private String youtubeUrl;
    private String facebookUrl;

    private String statsExhibits;
    private String statsFigures;
    private String statsResources;
    private String statsPhotos;

    private String heroTitleUz;
    private String heroTitleRu;
    private String heroTitleEn;

    private String heroSubtitleUz;
    private String heroSubtitleRu;
    private String heroSubtitleEn;

    private String quoteTextUz;
    private String quoteTextRu;
    private String quoteTextEn;

    private String heroQuotesJson;

    // Footer raw fields
    private String footerTaglineUz;
    private String footerTaglineRu;
    private String footerTaglineEn;

    private String footerCopyrightUz;
    private String footerCopyrightRu;
    private String footerCopyrightEn;

    private String footerLinksJson;

    // Telegram Bot
    private String telegramBotToken;
    private String telegramChatId;
    private Boolean telegramNotificationsEnabled;

    // Localized fields for convenience
    private String museumName;
    private String address;
    private String workingHours;
    private String heroTitle;
    private String heroSubtitle;
    private String quoteText;
    private String footerTagline;
    private String footerCopyright;

    private LocalDateTime updatedAt;
}
