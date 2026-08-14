package uz.rayimbek.avloniy_muzeyi.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranslateRequest {
    private String text;
    private Map<String, String> texts;
    private String sourceLang; // default "uz"
    private List<String> targetLangs; // e.g. ["ru", "en"]
}
