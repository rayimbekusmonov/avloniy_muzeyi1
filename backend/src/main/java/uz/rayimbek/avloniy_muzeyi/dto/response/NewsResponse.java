package uz.rayimbek.avloniy_muzeyi.dto.response;

import lombok.*;
import uz.rayimbek.avloniy_muzeyi.entity.News;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsResponse {

    private Long id;
    private String slug;
    private String imageUrl;
    private News.Category category;
    private Boolean published;
    private String authorUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Barcha til maydonlari (admin uchun)
    private String titleUz;
    private String contentUz;
    private String excerptUz;

    private String titleRu;
    private String contentRu;
    private String excerptRu;

    private String titleEn;
    private String contentEn;
    private String excerptEn;

    // Frontend uchun qulay: locale bo'yicha to'g'ri til qaytariladi
    // Bu maydonlar getBySlug va getAll da locale parametr bilan to'ldiriladi
    private String title;
    private String content;
    private String excerpt;
}