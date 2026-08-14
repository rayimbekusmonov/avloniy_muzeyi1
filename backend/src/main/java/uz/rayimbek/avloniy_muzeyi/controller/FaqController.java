package uz.rayimbek.avloniy_muzeyi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.rayimbek.avloniy_muzeyi.dto.request.FaqRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.FaqResponse;
import uz.rayimbek.avloniy_muzeyi.service.FaqService;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
public class FaqController {

    private final FaqService service;

    // Public: get FAQs by locale
    @GetMapping
    public ResponseEntity<List<FaqResponse>> getAll(
            @RequestParam(defaultValue = "uz") String locale
    ) {
        return ResponseEntity.ok(service.getAll(locale));
    }

    // Admin: get all for admin
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FaqResponse>> getAllForAdmin() {
        return ResponseEntity.ok(service.getAllForAdmin());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FaqResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FaqResponse> create(@Valid @RequestBody FaqRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FaqResponse> update(@PathVariable Long id, @Valid @RequestBody FaqRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
