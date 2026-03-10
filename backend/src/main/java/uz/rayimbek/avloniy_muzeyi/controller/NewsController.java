package uz.rayimbek.avloniy_muzeyi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.rayimbek.avloniy_muzeyi.dto.request.NewsRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.NewsResponse;
import uz.rayimbek.avloniy_muzeyi.service.NewsService;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    // PUBLIC — locale parametr qabul qiladi (uz/ru/en)
    @GetMapping
    public ResponseEntity<Page<NewsResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "uz") String locale
    ) {
        return ResponseEntity.ok(newsService.getPublishedNews(page, size, category, locale));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<NewsResponse> getBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "uz") String locale
    ) {
        return ResponseEntity.ok(newsService.getNewsBySlug(slug, locale));
    }

    // ADMIN — barcha yangiliklar (barcha til maydonlari bilan)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<NewsResponse>> getAllForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(newsService.getAllForAdmin(page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponse> create(@Valid @RequestBody NewsRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NewsResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody NewsRequest request
    ) {
        return ResponseEntity.ok(newsService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newsService.delete(id);
        return ResponseEntity.noContent().build();
    }
}