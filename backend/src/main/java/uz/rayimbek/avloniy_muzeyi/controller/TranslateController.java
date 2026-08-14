package uz.rayimbek.avloniy_muzeyi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.rayimbek.avloniy_muzeyi.dto.request.TranslateRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.TranslateResponse;
import uz.rayimbek.avloniy_muzeyi.service.TranslateService;

@RestController
@RequestMapping("/api/translate")
@RequiredArgsConstructor
public class TranslateController {

    private final TranslateService translateService;

    @PostMapping
    public ResponseEntity<TranslateResponse> translate(@RequestBody TranslateRequest request) {
        return ResponseEntity.ok(translateService.translate(request));
    }
}
