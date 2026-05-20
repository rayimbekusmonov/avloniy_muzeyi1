package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.rayimbek.avloniy_muzeyi.dto.request.HistoricalFigureRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.HistoricalFigureResponse;
import uz.rayimbek.avloniy_muzeyi.entity.HistoricalFigure;
import uz.rayimbek.avloniy_muzeyi.entity.FigureWork;
import uz.rayimbek.avloniy_muzeyi.entity.WorkType;
import uz.rayimbek.avloniy_muzeyi.exception.ResourceNotFoundException;
import uz.rayimbek.avloniy_muzeyi.repository.FigureWorkRepository;
import uz.rayimbek.avloniy_muzeyi.repository.HistoricalFigureRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoricalFigureService {

    private final HistoricalFigureRepository repository;
    private final FigureWorkRepository figureWorkRepository;

    // PUBLIC — frontend uchun (locale bo'yicha filtrlangan)
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

    // ADMIN — barcha til qatlamlari bilan birga
    public List<HistoricalFigureResponse> getAllForAdmin() {
        return repository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(this::toAdminResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HistoricalFigureResponse create(HistoricalFigureRequest request) {
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
                .regionUz(request.getRegionUz())
                .regionRu(request.getRegionRu())
                .regionEn(request.getRegionEn())
                .mottoUz(request.getMottoUz())
                .mottoRu(request.getMottoRu())
                .mottoEn(request.getMottoEn())
                .bioUz(request.getBioUz())
                .bioRu(request.getBioRu())
                .bioEn(request.getBioEn())
                .years(request.getYears())
                .imageUrl(request.getImageUrl())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();

        HistoricalFigure saved = repository.save(figure);
        return toAdminResponse(saved);
    }

    @Transactional
    public HistoricalFigureResponse update(Long id, HistoricalFigureRequest request) {
        HistoricalFigure figure = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jadid", id));

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
        figure.setRegionUz(request.getRegionUz());
        figure.setRegionRu(request.getRegionRu());
        figure.setRegionEn(request.getRegionEn());
        figure.setMottoUz(request.getMottoUz());
        figure.setMottoRu(request.getMottoRu());
        figure.setMottoEn(request.getMottoEn());
        figure.setBioUz(request.getBioUz());
        figure.setBioRu(request.getBioRu());
        figure.setBioEn(request.getBioEn());
        figure.setYears(request.getYears());
        figure.setImageUrl(request.getImageUrl());
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

    // --- MAPPERS ---

    private HistoricalFigureResponse toPublicResponse(HistoricalFigure f, String locale) {
        String name, title, region, motto, bio;

        if ("ru".equals(locale)) {
            name = f.getNameRu() != null && !f.getNameRu().isBlank() ? f.getNameRu() : f.getNameUz();
            title = f.getTitleRu();
            region = f.getRegionRu();
            motto = f.getMottoRu();
            bio = f.getBioRu() != null && !f.getBioRu().isBlank() ? f.getBioRu() : f.getBioUz();
        } else if ("en".equals(locale)) {
            name = f.getNameEn() != null && !f.getNameEn().isBlank() ? f.getNameEn() : f.getNameUz();
            title = f.getTitleEn();
            region = f.getRegionEn();
            motto = f.getMottoEn();
            bio = f.getBioEn() != null && !f.getBioEn().isBlank() ? f.getBioEn() : f.getBioUz();
        } else {
            name = f.getNameUz();
            title = f.getTitleUz();
            region = f.getRegionUz();
            motto = f.getMottoUz();
            bio = f.getBioUz();
        }

        return HistoricalFigureResponse.builder()
                .id(f.getId())
                .name(name)
                .title(title)
                .region(region)
                .motto(motto)
                .bio(bio)
                .years(f.getYears())
                .imageUrl(f.getImageUrl())
                .featured(f.getFeatured())
                .sortOrder(f.getSortOrder())
                .createdAt(f.getCreatedAt())
                .figureWorks(f.getFigureWorks() != null ? f.getFigureWorks().stream()
                        .map(w -> toWorkItemPublic(w, locale))
                        .collect(Collectors.toList()) : List.of())
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
                .regionUz(f.getRegionUz())
                .regionRu(f.getRegionRu())
                .regionEn(f.getRegionEn())
                .mottoUz(f.getMottoUz())
                .mottoRu(f.getMottoRu())
                .mottoEn(f.getMottoEn())
                .bioUz(f.getBioUz())
                .bioRu(f.getBioRu())
                .bioEn(f.getBioEn())
                .name(f.getNameUz())
                .title(f.getTitleUz())
                .region(f.getRegionUz())
                .motto(f.getMottoUz())
                .bio(f.getBioUz())
                .years(f.getYears())
                .imageUrl(f.getImageUrl())
                .featured(f.getFeatured())
                .sortOrder(f.getSortOrder())
                .createdAt(f.getCreatedAt())
                .figureWorks(f.getFigureWorks() != null ? f.getFigureWorks().stream()
                        .map(this::toWorkItemAdmin)
                        .collect(Collectors.toList()) : List.of())
                .build();
    }

    private HistoricalFigureResponse.WorkItem toWorkItemPublic(FigureWork w, String locale) {
        String title, desc;
        if ("ru".equals(locale)) {
            title = w.getTitleRu() != null && !w.getTitleRu().isBlank() ? w.getTitleRu() : w.getTitleUz();
            desc = w.getDescriptionRu();
        } else if ("en".equals(locale)) {
            title = w.getTitleEn() != null && !w.getTitleEn().isBlank() ? w.getTitleEn() : w.getTitleUz();
            desc = w.getDescriptionEn();
        } else {
            title = w.getTitleUz();
            desc = w.getDescriptionUz();
        }

        return HistoricalFigureResponse.WorkItem.builder()
                .id(w.getId())
                .workType(w.getWorkType().name())
                .title(title)
                .description(desc)
                .year(w.getYear())
                .pdfUrl(w.getPdfUrl())
                .sortOrder(w.getSortOrder())
                .build();
    }

    private HistoricalFigureResponse.WorkItem toWorkItemAdmin(FigureWork w) {
        return HistoricalFigureResponse.WorkItem.builder()
                .id(w.getId())
                .workType(w.getWorkType().name())
                .titleUz(w.getTitleUz())
                .titleRu(w.getTitleRu())
                .titleEn(w.getTitleEn())
                .descriptionUz(w.getDescriptionUz())
                .descriptionRu(w.getDescriptionRu())
                .descriptionEn(w.getDescriptionEn())
                .title(w.getTitleUz())
                .description(w.getDescriptionUz())
                .year(w.getYear())
                .pdfUrl(w.getPdfUrl())
                .sortOrder(w.getSortOrder())
                .build();
    }

    // === ASARLAR (WORKS) OPERATSIYALARI ===

    public List<HistoricalFigureResponse.WorkItem> getWorks(Long figureId, String locale) {
        return figureWorkRepository.findAllByFigureIdOrderBySortOrderAsc(figureId)
                .stream()
                .map(w -> toWorkItemPublic(w, locale))
                .collect(Collectors.toList());
    }

    @Transactional
    public HistoricalFigureResponse.WorkItem addWork(Long figureId, HistoricalFigureRequest.WorkRequest workRequest) {
        HistoricalFigure figure = repository.findById(figureId)
                .orElseThrow(() -> new ResourceNotFoundException("Jadid", figureId));

        WorkType type;
        try {
            type = WorkType.valueOf(workRequest.getWorkType());
        } catch (IllegalArgumentException e) {
            type = WorkType.OWN_WORK;
        }

        FigureWork work = FigureWork.builder()
                .figure(figure)
                .workType(type)
                .titleUz(workRequest.getTitleUz())
                .titleRu(workRequest.getTitleRu())
                .titleEn(workRequest.getTitleEn())
                .descriptionUz(workRequest.getDescriptionUz())
                .descriptionRu(workRequest.getDescriptionRu())
                .descriptionEn(workRequest.getDescriptionEn())
                .year(workRequest.getYear())
                .pdfUrl(workRequest.getPdfUrl())
                .sortOrder(workRequest.getSortOrder() != null ? workRequest.getSortOrder() : 0)
                .build();

        FigureWork saved = figureWorkRepository.save(work);
        return toWorkItemAdmin(saved);
    }

    public void deleteWork(Long workId) {
        if (!figureWorkRepository.existsById(workId)) {
            throw new ResourceNotFoundException("Asar", workId);
        }
        figureWorkRepository.deleteById(workId);
    }
}