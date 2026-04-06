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
}
