package uz.rayimbek.avloniy_muzeyi.dto.response;

import lombok.Builder;
import lombok.Data;
import uz.rayimbek.avloniy_muzeyi.entity.Resource;

import java.time.LocalDateTime;

@Data
@Builder
public class ResourceResponse {
    private Long id;
    private String title;
    private String author;
    private String description;
    private String fileUrl;
    private String coverUrl;
    private Resource.ResourceType resourceType;
    private Integer publishedYear;
    private Integer pageCount;
    private Boolean isPremium;
    private Long price;
    private Integer previewPagesCount;
    private Boolean allowDownload;
    private LocalDateTime createdAt;
}