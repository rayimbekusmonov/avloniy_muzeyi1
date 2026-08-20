package uz.rayimbek.avloniy_muzeyi.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import uz.rayimbek.avloniy_muzeyi.entity.Resource;

@Data
public class ResourceRequest {

    @NotBlank(message = "Sarlavha bo'sh bo'lishi mumkin emas")
    private String title;

    @NotBlank(message = "Muallif bo'sh bo'lishi mumkin emas")
    private String author;

    private String description;

    @NotBlank(message = "Fayl URL bo'sh bo'lishi mumkin emas")
    private String fileUrl;

    private String coverUrl;

    @NotNull(message = "Manba turi bo'sh bo'lishi mumkin emas")
    private Resource.ResourceType resourceType;

    private Integer publishedYear;
    private Integer pageCount;

    private Boolean isPremium;
    private Long price;
    private Integer previewPagesCount;
    private Boolean allowDownload;
}