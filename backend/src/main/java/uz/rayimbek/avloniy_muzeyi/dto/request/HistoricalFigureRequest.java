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

    @NotBlank(message = "O'zbekcha biografiya kiritilishi shart")
    private String bioUz;
    private String bioRu;
    private String bioEn;

    @NotBlank(message = "Yillar kiritilishi shart")
    private String years;

    private String imageUrl;
    private String works;
    private String pdfUrl;
    private Boolean featured = false;
    private Integer sortOrder = 0;
}
