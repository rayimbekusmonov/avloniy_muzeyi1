package uz.rayimbek.avloniy_muzeyi.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettingRequest {

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
}
