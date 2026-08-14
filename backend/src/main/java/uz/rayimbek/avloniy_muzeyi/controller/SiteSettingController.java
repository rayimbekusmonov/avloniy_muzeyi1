package uz.rayimbek.avloniy_muzeyi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.rayimbek.avloniy_muzeyi.dto.request.SiteSettingRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.SiteSettingResponse;
import uz.rayimbek.avloniy_muzeyi.service.SiteSettingService;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingService service;

    // Public: get settings by locale
    @GetMapping
    public ResponseEntity<SiteSettingResponse> getSettings(
            @RequestParam(defaultValue = "uz") String locale
    ) {
        return ResponseEntity.ok(service.getSettings(locale));
    }

    // Admin: update settings
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SiteSettingResponse> updateSettings(
            @Valid @RequestBody SiteSettingRequest request
    ) {
        return ResponseEntity.ok(service.updateSettings(request));
    }
}
