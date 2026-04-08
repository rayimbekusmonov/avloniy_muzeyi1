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

    private String bioUz;
    private String bioRu;
    private String bioEn;

    // Frontend uchun locale bo'yicha
    private String name;
    private String title;
    private String bio;

    private String years;
    private String imageUrl;
    private String works;
    private String pdfUrl;
    private Boolean featured;
    private Integer sortOrder;
    private LocalDateTime createdAt;

    // Mavjud fieldlardan keyin:
    private List<WorkItem> figureWorks;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class WorkItem {
        private Long id;
        private String title;
        private Integer year;
        private String pdfUrl;
        private Integer sortOrder;
    }

}