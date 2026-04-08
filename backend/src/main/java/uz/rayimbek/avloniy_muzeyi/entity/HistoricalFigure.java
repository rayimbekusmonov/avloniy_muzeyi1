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

    // Ism — 3 tilda
    @Column(nullable = false)
    private String nameUz;

    private String nameRu;
    private String nameEn;

    // Unvon — 3 tilda (shoir, dramaturg, ...)
    @Column(columnDefinition = "TEXT")
    private String titleUz;

    @Column(columnDefinition = "TEXT")
    private String titleRu;

    @Column(columnDefinition = "TEXT")
    private String titleEn;

    // Biografiya — 3 tilda
    @Column(columnDefinition = "TEXT", nullable = false)
    private String bioUz;

    @Column(columnDefinition = "TEXT")
    private String bioRu;

    @Column(columnDefinition = "TEXT")
    private String bioEn;

    @Column(nullable = false)
    private String years;

    // Rasm URL
    @Column(name = "image_url")
    private String imageUrl;

    // Asosiy asarlari (oddiy matn, vergul bilan ajratilgan)
    @Column(columnDefinition = "TEXT")
    private String works;

    // PDF kitob (ixtiyoriy)
    @Column(name = "pdf_url")
    private String pdfUrl;

    // Markaziy shaxs belgisi (Avloniy uchun)
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

    @OneToMany(mappedBy = "figure", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<FigureWork> figureWorks = new ArrayList<>();
}
