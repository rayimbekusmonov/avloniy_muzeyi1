package uz.rayimbek.avloniy_muzeyi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.rayimbek.avloniy_muzeyi.entity.BookPurchase;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookPurchaseRepository extends JpaRepository<BookPurchase, Long> {
    Optional<BookPurchase> findByReaderPhoneAndResourceIdAndStatus(String readerPhone, Long resourceId, BookPurchase.PaymentStatus status);
    List<BookPurchase> findAllByReaderPhoneOrderByPurchasedAtDesc(String readerPhone);
    boolean existsByReaderPhoneAndResourceIdAndStatus(String readerPhone, Long resourceId, BookPurchase.PaymentStatus status);
}
