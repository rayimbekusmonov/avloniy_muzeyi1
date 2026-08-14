package uz.rayimbek.avloniy_muzeyi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaqRequest {

    @NotBlank(message = "O'zbekcha savol kiritilishi shart")
    private String questionUz;
    private String questionRu;
    private String questionEn;

    @NotBlank(message = "O'zbekcha javob kiritilishi shart")
    private String answerUz;
    private String answerRu;
    private String answerEn;

    private String category;
    private Integer sortOrder = 0;
}
