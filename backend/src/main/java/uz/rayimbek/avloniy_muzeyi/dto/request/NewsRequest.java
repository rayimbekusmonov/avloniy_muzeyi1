package uz.rayimbek.avloniy_muzeyi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import uz.rayimbek.avloniy_muzeyi.entity.News;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsRequest {

    // O'zbek tili (majburiy)
    @NotBlank(message = "O'zbekcha sarlavha kiritilishi shart")
    private String titleUz;

    @NotBlank(message = "O'zbekcha kontent kiritilishi shart")
    private String contentUz;

    private String excerptUz;

    // Rus tili
    private String titleRu;
    private String contentRu;
    private String excerptRu;

    // Ingliz tili
    private String titleEn;
    private String contentEn;
    private String excerptEn;

    private String imageUrl;
    private News.Category category;
    private Boolean published = false;
}