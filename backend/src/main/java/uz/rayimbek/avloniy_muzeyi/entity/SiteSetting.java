package uz.rayimbek.avloniy_muzeyi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Muassasa nomi — 3 tilda
    private String museumNameUz;
    private String museumNameRu;
    private String museumNameEn;

    // Aloqa ma'lumotlari
    private String phone;
    private String email;
    private String telegram;
    private String addressUz;
    private String addressRu;
    private String addressEn;
    private String workingHoursUz;
    private String workingHoursRu;
    private String workingHoursEn;

    // Ijtimoiy tarmoqlar
    private String telegramUrl;
    private String instagramUrl;
    private String youtubeUrl;
    private String facebookUrl;

    // Statistika ko'rsatkichlari (Bosh sahifa uchun)
    private String statsExhibits;    // masalan: "150+"
    private String statsFigures;      // masalan: "50+"
    private String statsResources;    // masalan: "1 000+"
    private String statsPhotos;       // masalan: "500+"

    // Bosh sahifa matnlari
    @Column(columnDefinition = "TEXT")
    private String heroTitleUz;
    @Column(columnDefinition = "TEXT")
    private String heroTitleRu;
    @Column(columnDefinition = "TEXT")
    private String heroTitleEn;

    @Column(columnDefinition = "TEXT")
    private String heroSubtitleUz;
    @Column(columnDefinition = "TEXT")
    private String heroSubtitleRu;
    @Column(columnDefinition = "TEXT")
    private String heroSubtitleEn;

    // Avloniyning bosh sahifadagi shiori
    @Column(columnDefinition = "TEXT")
    private String quoteTextUz;
    @Column(columnDefinition = "TEXT")
    private String quoteTextRu;
    @Column(columnDefinition = "TEXT")
    private String quoteTextEn;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
