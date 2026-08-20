package uz.rayimbek.avloniy_muzeyi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "book_purchases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "reader_phone")
    private String readerPhone;

    @Column(name = "reader_name")
    private String readerName;

    @Column(nullable = false, name = "resource_id")
    private Long resourceId;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.COMPLETED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentProvider provider = PaymentProvider.DEMO;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt;

    @PrePersist
    public void prePersist() {
        this.purchasedAt = LocalDateTime.now();
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, CANCELLED
    }

    public enum PaymentProvider {
        CLICK, PAYME, UZUM, DEMO, ADMIN
    }
}
