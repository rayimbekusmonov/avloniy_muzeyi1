package uz.rayimbek.avloniy_muzeyi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "news")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O'zbek tili
    @Column(nullable = false)
    private String titleUz;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contentUz;

    @Column(columnDefinition = "TEXT")
    private String excerptUz;

    // Rus tili
    @Column
    private String titleRu;

    @Column(columnDefinition = "TEXT")
    private String contentRu;

    @Column(columnDefinition = "TEXT")
    private String excerptRu;

    // Ingliz tili
    @Column
    private String titleEn;

    @Column(columnDefinition = "TEXT")
    private String contentEn;

    @Column(columnDefinition = "TEXT")
    private String excerptEn;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(nullable = false)
    private Boolean published = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private User author;

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

    public enum Category {
        KORGAZMA, TADBIR, YANGILIK, BAYRAM
    }
}