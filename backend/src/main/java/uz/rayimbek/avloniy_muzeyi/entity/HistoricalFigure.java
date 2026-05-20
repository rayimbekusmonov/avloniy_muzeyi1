package uz.rayimbek.avloniy_muzeyi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Entity
@Table(name = "historical_figures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricalFigure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ism-sharifi (3 tilda)
    @Column(nullable = false)
    private String nameUz;
    private String nameRu;
    private String nameEn;

    // Faoliyat yo'nalishi / Unvoni (3 tilda - Masalan: shoir, dramaturg, siyosatchi)
    @Column(columnDefinition = "TEXT")
    private String titleUz;
    @Column(columnDefinition = "TEXT")
    private String titleRu;
    @Column(columnDefinition = "TEXT")
    private String titleEn;

    // Yashagan hududi / Jadidlik maktabi (3 tilda - Masalan: Buxoro, Toshkent, Xiva)
    private String regionUz;
    private String regionRu;
    private String regionEn;

    // Mashhur shiori yoki g'oyasi (3 tilda - Masalan: "Haq olinur, berilmas!")
    @Column(columnDefinition = "TEXT")
    private String mottoUz;
    @Column(columnDefinition = "TEXT")
    private String mottoRu;
    @Column(columnDefinition = "TEXT")
    private String mottoEn;

    // To'liq Biografiyasi (3 tilda)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String bioUz;
    @Column(columnDefinition = "TEXT")
    private String bioRu;
    @Column(columnDefinition = "TEXT")
    private String bioEn;

    // Yashagan yillari (Masalan: "1875 — 1938")
    @Column(nullable = false)
    private String years;

    // Asosiy profil rasmi URL
    @Column(name = "image_url")
    private String imageUrl;

    // Tanlangan jadid (Bosh sahifada alohida vizual ajralib turishi uchun)
    @Column(nullable = false)
    private Boolean featured = false;

    // Tartib raqami
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Jadidga tegishli barcha asarlar ro'yxati (o'zi yozgan va u haqidagi)
    @OneToMany(mappedBy = "figure", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<FigureWork> figureWorks = new ArrayList<>();
}