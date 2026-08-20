package uz.rayimbek.avloniy_muzeyi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "cover_url")
    private String coverUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType resourceType;

    @Column(name = "published_year")
    private Integer publishedYear;

    @Column(name = "page_count")
    private Integer pageCount;

    @Builder.Default
    @Column(name = "is_premium", nullable = false)
    private Boolean isPremium = false;

    @Builder.Default
    @Column(name = "price")
    private Long price = 0L;

    @Builder.Default
    @Column(name = "preview_pages_count")
    private Integer previewPagesCount = 10;

    @Builder.Default
    @Column(name = "allow_download", nullable = false)
    private Boolean allowDownload = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public enum ResourceType {
        EBOOK, ARTICLE, RESEARCH, DOCUMENT
    }
}

//bu yuklash uchun fayl