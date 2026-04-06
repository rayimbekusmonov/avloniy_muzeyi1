package uz.rayimbek.avloniy_muzeyi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.rayimbek.avloniy_muzeyi.entity.HistoricalFigure;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoricalFigureRepository extends JpaRepository<HistoricalFigure, Long> {
    List<HistoricalFigure> findAllByOrderBySortOrderAsc();
    Optional<HistoricalFigure> findByFeaturedTrue();
}
