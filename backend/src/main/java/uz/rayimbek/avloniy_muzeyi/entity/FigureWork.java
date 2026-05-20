package uz.rayimbek.avloniy_muzeyi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "figure_works")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FigureWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "figure_id", nullable = false)
    private HistoricalFigure figure;

    // Asar turi: OWN_WORK yoki ABOUT_WORK
    @Enumerated(EnumType.STRING)
    @Column(name = "work_type", nullable = false)
    private WorkType workType;

    // Asar nomi (3 tilda)
    @Column(nullable = false)
    private String titleUz;
    private String titleRu;
    private String titleEn;

    // Asar haqida qisqacha ma'lumot/tavsif (3 tilda)
    @Column(columnDefinition = "TEXT")
    private String descriptionUz;
    @Column(columnDefinition = "TEXT")
    private String descriptionRu;
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    // Nashr etilgan yili
    private Integer year;

    // Agar asarning elektron varianti bo'lsa PDF yoki tashqi havola (Supabase URL)
    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}