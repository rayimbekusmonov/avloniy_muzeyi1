package uz.rayimbek.avloniy_muzeyi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.rayimbek.avloniy_muzeyi.entity.SiteSetting;

@Repository
public interface SiteSettingRepository extends JpaRepository<SiteSetting, Long> {
}
