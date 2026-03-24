package uz.rayimbek.avloniy_muzeyi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.rayimbek.avloniy_muzeyi.dto.request.LoginRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.AuthResponse;
import uz.rayimbek.avloniy_muzeyi.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Birinchi admin yaratish uchun.
     * Faqat hech qanday admin mavjud bo'lmaganda ishlaydi.
     */
    @PostMapping("/setup")
    public ResponseEntity<Map<String, String>> setup(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null || username.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username va password kiritilishi shart"));
        }

        if (password.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Parol kamida 6 ta belgidan iborat bo'lishi kerak"));
        }

        try {
            authService.createFirstAdmin(username, password);
            return ResponseEntity.ok(Map.of("message", "Admin muvaffaqiyatli yaratildi"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
