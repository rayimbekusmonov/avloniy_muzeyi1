package uz.rayimbek.avloniy_muzeyi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.rayimbek.avloniy_muzeyi.entity.FigureWork;
import java.util.List;

@Repository
public interface FigureWorkRepository extends JpaRepository<FigureWork, Long> {
    List<FigureWork> findAllByFigureIdOrderBySortOrderAsc(Long figureId);
    void deleteAllByFigureId(Long figureId);
}