package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import uz.rayimbek.avloniy_muzeyi.dto.request.ResourceRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.ResourceResponse;
import uz.rayimbek.avloniy_muzeyi.entity.Resource;
import uz.rayimbek.avloniy_muzeyi.exception.ResourceNotFoundException;
import uz.rayimbek.avloniy_muzeyi.repository.ResourceRepository;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Page<ResourceResponse> getAll(int page, int size, String type, String search) {
        PageRequest pageable = PageRequest.of(page, size);

        if (search != null && !search.isBlank()) {
            return resourceRepository
                    .findAllByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrderByCreatedAtDesc(
                            search, search, pageable)
                    .map(this::toResponse);
        }

        if (type != null && !type.isBlank()) {
            Resource.ResourceType resourceType = Resource.ResourceType.valueOf(type.toUpperCase());
            return resourceRepository
                    .findAllByResourceTypeOrderByCreatedAtDesc(resourceType, pageable)
                    .map(this::toResponse);
        }

        return resourceRepository
                .findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toResponse);
    }

    public ResourceResponse getById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manba", id));
        return toResponse(resource);
    }

    public ResourceResponse create(ResourceRequest request) {
        Resource resource = Resource.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .coverUrl(request.getCoverUrl())
                .resourceType(request.getResourceType())
                .publishedYear(request.getPublishedYear())
                .pageCount(request.getPageCount())
                .build();
        return toResponse(resourceRepository.save(resource));
    }

    public ResourceResponse update(Long id, ResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manba", id));

        resource.setTitle(request.getTitle());
        resource.setAuthor(request.getAuthor());
        resource.setDescription(request.getDescription());
        resource.setFileUrl(request.getFileUrl());
        resource.setCoverUrl(request.getCoverUrl());
        resource.setResourceType(request.getResourceType());
        resource.setPublishedYear(request.getPublishedYear());
        resource.setPageCount(request.getPageCount());

        return toResponse(resourceRepository.save(resource));
    }

    public void delete(Long id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Manba", id);
        }
        resourceRepository.deleteById(id);
    }

    private ResourceResponse toResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .title(resource.getTitle())
                .author(resource.getAuthor())
                .description(resource.getDescription())
                .fileUrl(resource.getFileUrl())
                .coverUrl(resource.getCoverUrl())
                .resourceType(resource.getResourceType())
                .publishedYear(resource.getPublishedYear())
                .pageCount(resource.getPageCount())
                .createdAt(resource.getCreatedAt())
                .build();
    }
}
