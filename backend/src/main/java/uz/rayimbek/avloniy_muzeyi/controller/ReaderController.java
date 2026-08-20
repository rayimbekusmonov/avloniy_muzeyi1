package uz.rayimbek.avloniy_muzeyi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.rayimbek.avloniy_muzeyi.service.ReaderService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reader")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReaderController {

    private final ReaderService readerService;

    @PostMapping("/auth")
    public ResponseEntity<Map<String, Object>> authenticate(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String fullName = body.get("fullName");
        String telegramUsername = body.get("telegramUsername");
        return ResponseEntity.ok(readerService.authenticate(phone, fullName, telegramUsername));
    }

    @GetMapping("/access/{resourceId}")
    public ResponseEntity<Map<String, Object>> checkAccess(
            @PathVariable Long resourceId,
            @RequestParam(required = false) String phone) {
        return ResponseEntity.ok(readerService.checkAccess(resourceId, phone));
    }

    @PostMapping("/purchase/{resourceId}")
    public ResponseEntity<Map<String, Object>> purchaseBook(
            @PathVariable Long resourceId,
            @RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        String readerName = body.get("readerName");
        String provider = body.get("provider");
        return ResponseEntity.ok(readerService.purchaseBook(resourceId, phone, readerName, provider));
    }

    @GetMapping("/my-books")
    public ResponseEntity<List<Map<String, Object>>> getMyBooks(@RequestParam String phone) {
        return ResponseEntity.ok(readerService.getMyPurchasedBooks(phone));
    }
}
