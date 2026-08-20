package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.rayimbek.avloniy_muzeyi.entity.BookPurchase;
import uz.rayimbek.avloniy_muzeyi.entity.BookReader;
import uz.rayimbek.avloniy_muzeyi.entity.Resource;
import uz.rayimbek.avloniy_muzeyi.exception.ResourceNotFoundException;
import uz.rayimbek.avloniy_muzeyi.repository.BookPurchaseRepository;
import uz.rayimbek.avloniy_muzeyi.repository.BookReaderRepository;
import uz.rayimbek.avloniy_muzeyi.repository.ResourceRepository;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReaderService {

    private final BookReaderRepository readerRepository;
    private final BookPurchaseRepository purchaseRepository;
    private final ResourceRepository resourceRepository;

    @Transactional
    public Map<String, Object> authenticate(String phone, String fullName, String telegramUsername) {
        if (phone == null || phone.isBlank()) {
            throw new IllegalArgumentException("Telefon raqami kiritilishi shart");
        }

        String cleanPhone = phone.replaceAll("[^0-9+]", "");
        if (!cleanPhone.startsWith("+") && cleanPhone.startsWith("998")) {
            cleanPhone = "+" + cleanPhone;
        }

        final String finalPhone = cleanPhone;
        BookReader reader = readerRepository.findByPhone(finalPhone)
                .map(r -> {
                    if (fullName != null && !fullName.isBlank()) r.setFullName(fullName.trim());
                    if (telegramUsername != null && !telegramUsername.isBlank()) r.setTelegramUsername(telegramUsername.trim());
                    r.setLastLoginAt(LocalDateTime.now());
                    return readerRepository.save(r);
                })
                .orElseGet(() -> readerRepository.save(BookReader.builder()
                        .phone(finalPhone)
                        .fullName(fullName != null && !fullName.isBlank() ? fullName.trim() : "Kitobxon")
                        .telegramUsername(telegramUsername != null ? telegramUsername.trim() : null)
                        .lastLoginAt(LocalDateTime.now())
                        .build()));

        Map<String, Object> response = new HashMap<>();
        response.put("id", reader.getId());
        response.put("phone", reader.getPhone());
        response.put("fullName", reader.getFullName());
        response.put("telegramUsername", reader.getTelegramUsername());
        // Simple secure token based on phone and ID
        response.put("readerToken", Base64.getEncoder().encodeToString((reader.getPhone() + ":" + reader.getId()).getBytes()));
        return response;
    }

    public Map<String, Object> checkAccess(Long resourceId, String phone) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Manba", resourceId));

        Map<String, Object> res = new HashMap<>();
        res.put("resourceId", resource.getId());
        res.put("title", resource.getTitle());
        res.put("author", resource.getAuthor());
        res.put("coverUrl", resource.getCoverUrl());
        res.put("fileUrl", resource.getFileUrl());
        res.put("isPremium", resource.getIsPremium());
        res.put("price", resource.getPrice());
        res.put("previewPagesCount", resource.getPreviewPagesCount() != null ? resource.getPreviewPagesCount() : 10);
        res.put("allowDownload", resource.getAllowDownload());

        if (!Boolean.TRUE.equals(resource.getIsPremium())) {
            res.put("hasFullAccess", true);
            res.put("reason", "FREE");
            return res;
        }

        if (phone != null && !phone.isBlank()) {
            String cleanPhone = phone.replaceAll("[^0-9+]", "");
            if (!cleanPhone.startsWith("+") && cleanPhone.startsWith("998")) {
                cleanPhone = "+" + cleanPhone;
            }
            boolean purchased = purchaseRepository.existsByReaderPhoneAndResourceIdAndStatus(
                    cleanPhone, resourceId, BookPurchase.PaymentStatus.COMPLETED);
            if (purchased) {
                res.put("hasFullAccess", true);
                res.put("reason", "PURCHASED");
                return res;
            }
        }

        res.put("hasFullAccess", false);
        res.put("reason", "PAYWALL");
        return res;
    }

    @Transactional
    public Map<String, Object> purchaseBook(Long resourceId, String phone, String readerName, String providerStr) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Manba", resourceId));

        if (phone == null || phone.isBlank()) {
            throw new IllegalArgumentException("Telefon raqami kiritilishi shart");
        }

        String cleanPhone = phone.replaceAll("[^0-9+]", "");
        if (!cleanPhone.startsWith("+") && cleanPhone.startsWith("998")) {
            cleanPhone = "+" + cleanPhone;
        }

        // Register/update reader if not exists
        final String finalPhone = cleanPhone;
        readerRepository.findByPhone(finalPhone).orElseGet(() -> readerRepository.save(
                BookReader.builder()
                        .phone(finalPhone)
                        .fullName(readerName != null && !readerName.isBlank() ? readerName.trim() : "Kitobxon")
                        .build()
        ));

        BookPurchase.PaymentProvider provider = BookPurchase.PaymentProvider.DEMO;
        try {
            if (providerStr != null) {
                provider = BookPurchase.PaymentProvider.valueOf(providerStr.toUpperCase());
            }
        } catch (Exception ignored) {}

        // Check if already purchased
        Optional<BookPurchase> existing = purchaseRepository.findByReaderPhoneAndResourceIdAndStatus(
                finalPhone, resourceId, BookPurchase.PaymentStatus.COMPLETED);

        BookPurchase purchase;
        if (existing.isPresent()) {
            purchase = existing.get();
        } else {
            purchase = purchaseRepository.save(BookPurchase.builder()
                    .readerPhone(finalPhone)
                    .readerName(readerName != null && !readerName.isBlank() ? readerName.trim() : "Kitobxon")
                    .resourceId(resourceId)
                    .amount(resource.getPrice() != null ? resource.getPrice() : 0L)
                    .status(BookPurchase.PaymentStatus.COMPLETED)
                    .provider(provider)
                    .transactionId("TRX-" + System.currentTimeMillis())
                    .build());
        }

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("purchaseId", purchase.getId());
        res.put("resourceId", resource.getId());
        res.put("title", resource.getTitle());
        res.put("amount", purchase.getAmount());
        res.put("readerPhone", purchase.getReaderPhone());
        res.put("purchasedAt", purchase.getPurchasedAt());
        return res;
    }

    public List<Map<String, Object>> getMyPurchasedBooks(String phone) {
        if (phone == null || phone.isBlank()) return Collections.emptyList();

        String cleanPhone = phone.replaceAll("[^0-9+]", "");
        if (!cleanPhone.startsWith("+") && cleanPhone.startsWith("998")) {
            cleanPhone = "+" + cleanPhone;
        }

        List<BookPurchase> purchases = purchaseRepository.findAllByReaderPhoneOrderByPurchasedAtDesc(cleanPhone);
        List<Map<String, Object>> result = new ArrayList<>();

        for (BookPurchase p : purchases) {
            resourceRepository.findById(p.getResourceId()).ifPresent(r -> {
                Map<String, Object> item = new HashMap<>();
                item.put("purchaseId", p.getId());
                item.put("purchasedAt", p.getPurchasedAt());
                item.put("amount", p.getAmount());
                item.put("resourceId", r.getId());
                item.put("title", r.getTitle());
                item.put("author", r.getAuthor());
                item.put("coverUrl", r.getCoverUrl());
                item.put("fileUrl", r.getFileUrl());
                item.put("resourceType", r.getResourceType());
                result.add(item);
            });
        }
        return result;
    }
}
