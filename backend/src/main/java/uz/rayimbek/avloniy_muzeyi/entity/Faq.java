package uz.rayimbek.avloniy_muzeyi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "faqs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Savol — 3 tilda
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionUz;
    @Column(columnDefinition = "TEXT")
    private String questionRu;
    @Column(columnDefinition = "TEXT")
    private String questionEn;

    // Javob — 3 tilda
    @Column(columnDefinition = "TEXT", nullable = false)
    private String answerUz;
    @Column(columnDefinition = "TEXT")
    private String answerRu;
    @Column(columnDefinition = "TEXT")
    private String answerEn;

    // Kategoriya (Tashrif, Manbalar, Galereya va h.k.)
    private String category;

    // Tartib raqami
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
