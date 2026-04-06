package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.rayimbek.avloniy_muzeyi.dto.request.HistoricalFigureRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.HistoricalFigureResponse;
import uz.rayimbek.avloniy_muzeyi.entity.HistoricalFigure;
import uz.rayimbek.avloniy_muzeyi.exception.ResourceNotFoundException;
import uz.rayimbek.avloniy_muzeyi.repository.HistoricalFigureRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoricalFigureService {

    private final HistoricalFigureRepository repository;

    // PUBLIC — frontend uchun (locale bo'yicha)
    public List<HistoricalFigureResponse> getAllPublic(String locale) {
        return repository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(f -> toPublicResponse(f, locale))
                .collect(Collectors.toList());
    }

    public HistoricalFigureResponse getByIdPublic(Long id, String locale) {
        HistoricalFigure figure = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jadid", id));
        return toPublicResponse(figure, locale);
    }

    // ADMIN — barcha til maydonlari bilan
    public List<HistoricalFigureResponse> getAllForAdmin() {
        return repository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(this::toAdminResponse)
                .collect(Collectors.toList());
    }

    public HistoricalFigureResponse create(HistoricalFigureRequest request) {
        // Agar featured=true bo'lsa, eskisini false qilish
        if (Boolean.TRUE.equals(request.getFeatured())) {
            repository.findByFeaturedTrue().ifPresent(old -> {
                old.setFeatured(false);
                repository.save(old);
            });
        }

        HistoricalFigure figure = HistoricalFigure.builder()
                .nameUz(request.getNameUz())
                .nameRu(request.getNameRu())
                .nameEn(request.getNameEn())
                .titleUz(request.getTitleUz())
                .titleRu(request.getTitleRu())
                .titleEn(request.getTitleEn())
                .bioUz(request.getBioUz())
                .bioRu(request.getBioRu())
                .bioEn(request.getBioEn())
                .years(request.getYears())
                .imageUrl(request.getImageUrl())
                .works(request.getWorks())
                .pdfUrl(request.getPdfUrl())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();

        return toAdminResponse(repository.save(figure));
    }

    public HistoricalFigureResponse update(Long id, HistoricalFigureRequest request) {
        HistoricalFigure figure = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jadid", id));

        // Agar featured=true bo'lsa, eskisini false qilish
        if (Boolean.TRUE.equals(request.getFeatured()) && !Boolean.TRUE.equals(figure.getFeatured())) {
            repository.findByFeaturedTrue().ifPresent(old -> {
                if (!old.getId().equals(id)) {
                    old.setFeatured(false);
                    repository.save(old);
                }
            });
        }

        figure.setNameUz(request.getNameUz());
        figure.setNameRu(request.getNameRu());
        figure.setNameEn(request.getNameEn());
        figure.setTitleUz(request.getTitleUz());
        figure.setTitleRu(request.getTitleRu());
        figure.setTitleEn(request.getTitleEn());
        figure.setBioUz(request.getBioUz());
        figure.setBioRu(request.getBioRu());
        figure.setBioEn(request.getBioEn());
        figure.setYears(request.getYears());
        figure.setImageUrl(request.getImageUrl());
        figure.setWorks(request.getWorks());
        figure.setPdfUrl(request.getPdfUrl());
        figure.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
        figure.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);

        return toAdminResponse(repository.save(figure));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Jadid", id);
        }
        repository.deleteById(id);
    }

    // --- Mappers ---

    private HistoricalFigureResponse toPublicResponse(HistoricalFigure f, String locale) {
        String name, title, bio;

        if ("ru".equals(locale) && f.getNameRu() != null && !f.getNameRu().isBlank()) {
            name = f.getNameRu();
            title = f.getTitleRu();
            bio = f.getBioRu();
        } else if ("en".equals(locale) && f.getNameEn() != null && !f.getNameEn().isBlank()) {
            name = f.getNameEn();
            title = f.getTitleEn();
            bio = f.getBioEn();
        } else {
            name = f.getNameUz();
            title = f.getTitleUz();
            bio = f.getBioUz();
        }

        return HistoricalFigureResponse.builder()
                .id(f.getId())
                .name(name)
                .title(title)
                .bio(bio)
                .years(f.getYears())
                .imageUrl(f.getImageUrl())
                .works(f.getWorks())
                .pdfUrl(f.getPdfUrl())
                .featured(f.getFeatured())
                .sortOrder(f.getSortOrder())
                .createdAt(f.getCreatedAt())
                .build();
    }

    private HistoricalFigureResponse toAdminResponse(HistoricalFigure f) {
        return HistoricalFigureResponse.builder()
                .id(f.getId())
                .nameUz(f.getNameUz())
                .nameRu(f.getNameRu())
                .nameEn(f.getNameEn())
                .titleUz(f.getTitleUz())
                .titleRu(f.getTitleRu())
                .titleEn(f.getTitleEn())
                .bioUz(f.getBioUz())
                .bioRu(f.getBioRu())
                .bioEn(f.getBioEn())
                .name(f.getNameUz())
                .title(f.getTitleUz())
                .bio(f.getBioUz())
                .years(f.getYears())
                .imageUrl(f.getImageUrl())
                .works(f.getWorks())
                .pdfUrl(f.getPdfUrl())
                .featured(f.getFeatured())
                .sortOrder(f.getSortOrder())
                .createdAt(f.getCreatedAt())
                .build();
    }
}
