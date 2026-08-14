package uz.rayimbek.avloniy_muzeyi.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FaqResponse {

    private Long id;

    private String questionUz;
    private String questionRu;
    private String questionEn;

    private String answerUz;
    private String answerRu;
    private String answerEn;

    // Localized fields
    private String question;
    private String answer;

    private String category;
    private Integer sortOrder;
    private LocalDateTime createdAt;
}
