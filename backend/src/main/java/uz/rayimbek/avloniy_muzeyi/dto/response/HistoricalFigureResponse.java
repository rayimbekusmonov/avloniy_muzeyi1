package uz.rayimbek.avloniy_muzeyi.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricalFigureResponse {

    private Long id;

    // Barcha til maydonlari (admin uchun)
    private String nameUz;
    private String nameRu;
    private String nameEn;

    private String titleUz;
    private String titleRu;
    private String titleEn;

    private String regionUz;
    private String regionRu;
    private String regionEn;

    private String mottoUz;
    private String mottoRu;
    private String mottoEn;

    private String bioUz;
    private String bioRu;
    private String bioEn;

    // Frontend uchun locale bo'yicha dinamik fieldlar
    private String name;
    private String title;
    private String region;
    private String motto;
    private String bio;

    private String years;
    private String imageUrl;
    private Boolean featured;
    private Integer sortOrder;
    private LocalDateTime createdAt;

    // Jadidning barcha asarlari
    private List<WorkItem> figureWorks;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class WorkItem {
        private Long id;
        private String workType; // OWN_WORK yoki ABOUT_WORK

        // Admin uchun hamma tillar
        private String titleUz;
        private String titleRu;
        private String titleEn;
        private String descriptionUz;
        private String descriptionRu;
        private String descriptionEn;

        // Frontend uchun bitta dinamik til fieldlari
        private String title;
        private String description;

        private Integer year;
        private String pdfUrl;
        private Integer sortOrder;
    }
}