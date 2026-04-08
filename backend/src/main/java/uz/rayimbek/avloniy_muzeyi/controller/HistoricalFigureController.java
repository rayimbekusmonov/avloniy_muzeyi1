package uz.rayimbek.avloniy_muzeyi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.rayimbek.avloniy_muzeyi.dto.request.HistoricalFigureRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.HistoricalFigureResponse;
import uz.rayimbek.avloniy_muzeyi.service.HistoricalFigureService;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/figures")
@RequiredArgsConstructor
public class HistoricalFigureController {

    private final HistoricalFigureService service;

    // PUBLIC — frontend uchun
    @GetMapping
    public ResponseEntity<List<HistoricalFigureResponse>> getAll(
            @RequestParam(defaultValue = "uz") String locale
    ) {
        return ResponseEntity.ok(service.getAllPublic(locale));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoricalFigureResponse> getById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "uz") String locale
    ) {
        return ResponseEntity.ok(service.getByIdPublic(id, locale));
    }

    // ADMIN — barcha til maydonlari bilan
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HistoricalFigureResponse>> getAllForAdmin() {
        return ResponseEntity.ok(service.getAllForAdmin());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HistoricalFigureResponse> create(
            @Valid @RequestBody HistoricalFigureRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HistoricalFigureResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody HistoricalFigureRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // === ASARLAR (Works) ===

    @GetMapping("/{figureId}/works")
    public ResponseEntity<List<HistoricalFigureResponse.WorkItem>> getWorks(
            @PathVariable Long figureId) {
        return ResponseEntity.ok(service.getWorks(figureId));
    }

    @PostMapping("/{figureId}/works")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HistoricalFigureResponse.WorkItem> addWork(
            @PathVariable Long figureId,
            @RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        Integer year = body.get("year") != null ? ((Number) body.get("year")).intValue() : null;
        String pdfUrl = (String) body.get("pdfUrl");
        Integer sortOrder = body.get("sortOrder") != null ? ((Number) body.get("sortOrder")).intValue() : 0;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.addWork(figureId, title, year, pdfUrl, sortOrder));
    }

    @DeleteMapping("/works/{workId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteWork(@PathVariable Long workId) {
        service.deleteWork(workId);
        return ResponseEntity.noContent().build();
    }

}
