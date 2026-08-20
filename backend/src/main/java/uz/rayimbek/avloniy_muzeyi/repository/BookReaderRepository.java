package uz.rayimbek.avloniy_muzeyi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.rayimbek.avloniy_muzeyi.entity.BookReader;

import java.util.Optional;

@Repository
public interface BookReaderRepository extends JpaRepository<BookReader, Long> {
    Optional<BookReader> findByPhone(String phone);
    boolean existsByPhone(String phone);
}
