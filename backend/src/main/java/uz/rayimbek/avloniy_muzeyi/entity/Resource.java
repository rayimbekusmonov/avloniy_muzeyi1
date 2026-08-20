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
    @Column(name = "is_premium")
    private Boolean isPremium = false;

    @Builder.Default
    @Column(name = "price")
    private Long price = 0L;

    @Builder.Default
    @Column(name = "preview_pages_count")
    private Integer previewPagesCount = 10;

    @Builder.Default
    @Column(name = "allow_download")
    private Boolean allowDownload = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isPremium == null) {
            this.isPremium = false;
        }
        if (this.price == null) {
            this.price = 0L;
        }
        if (this.previewPagesCount == null) {
            this.previewPagesCount = 10;
        }
        if (this.allowDownload == null) {
            this.allowDownload = true;
        }
    }

    public enum ResourceType {
        EBOOK, ARTICLE, RESEARCH, DOCUMENT
    }
}

//bu yuklash uchun fayl