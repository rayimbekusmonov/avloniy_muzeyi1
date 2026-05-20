package uz.rayimbek.avloniy_muzeyi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricalFigureRequest {

    @NotBlank(message = "O'zbekcha ism kiritilishi shart")
    private String nameUz;
    private String nameRu;
    private String nameEn;

    private String titleUz;
    private String titleRu;
    private String titleEn;

    // Yangi qo'shilgan maydonlar: Hudud / Maktab
    private String regionUz;
    private String regionRu;
    private String regionEn;

    // Yangi qo'shilgan maydonlar: Mashhur shior
    private String mottoUz;
    private String mottoRu;
    private String mottoEn;

    @NotBlank(message = "O'zbekcha biografiya kiritilishi shart")
    private String bioUz;
    private String bioRu;
    private String bioEn;

    @NotBlank(message = "Yillar kiritilishi shart")
    private String years;

    private String imageUrl;
    private Boolean featured = false;
    private Integer sortOrder = 0;

    // Asarlar qo'shish uchun ichki DTO klass (Asar qo'shish formalari uchun)
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class WorkRequest {
        @NotBlank(message = "Asar turi (OWN_WORK yoki ABOUT_WORK) kiritilishi shart")
        private String workType;

        @NotBlank(message = "O'zbekcha asar nomi kiritilishi shart")
        private String titleUz;
        private String titleRu;
        private String titleEn;

        private String descriptionUz;
        private String descriptionRu;
        private String descriptionEn;

        private Integer year;
        private String pdfUrl;
        private Integer sortOrder = 0;
    }
}