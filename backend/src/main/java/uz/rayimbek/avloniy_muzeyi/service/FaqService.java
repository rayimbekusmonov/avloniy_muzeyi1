package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.rayimbek.avloniy_muzeyi.dto.request.FaqRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.FaqResponse;
import uz.rayimbek.avloniy_muzeyi.entity.Faq;
import uz.rayimbek.avloniy_muzeyi.exception.ResourceNotFoundException;
import uz.rayimbek.avloniy_muzeyi.repository.FaqRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository repository;

    public List<FaqResponse> getAll(String locale) {
        return repository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(faq -> toResponse(faq, locale))
                .collect(Collectors.toList());
    }

    public List<FaqResponse> getAllForAdmin() {
        return repository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(faq -> toResponse(faq, "uz"))
                .collect(Collectors.toList());
    }

    public FaqResponse getById(Long id) {
        Faq faq = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ", id));
        return toResponse(faq, "uz");
    }

    @Transactional
    public FaqResponse create(FaqRequest request) {
        Faq faq = Faq.builder()
                .questionUz(request.getQuestionUz())
                .questionRu(request.getQuestionRu())
                .questionEn(request.getQuestionEn())
                .answerUz(request.getAnswerUz())
                .answerRu(request.getAnswerRu())
                .answerEn(request.getAnswerEn())
                .category(request.getCategory() != null ? request.getCategory() : "Tashrif")
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();

        Faq saved = repository.save(faq);
        return toResponse(saved, "uz");
    }

    @Transactional
    public FaqResponse update(Long id, FaqRequest request) {
        Faq faq = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ", id));

        faq.setQuestionUz(request.getQuestionUz());
        faq.setQuestionRu(request.getQuestionRu());
        faq.setQuestionEn(request.getQuestionEn());
        faq.setAnswerUz(request.getAnswerUz());
        faq.setAnswerRu(request.getAnswerRu());
        faq.setAnswerEn(request.getAnswerEn());
        faq.setCategory(request.getCategory());
        faq.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);

        return toResponse(repository.save(faq), "uz");
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("FAQ", id);
        }
        repository.deleteById(id);
    }

    private FaqResponse toResponse(Faq faq, String locale) {
        String q, a;
        if ("ru".equals(locale) && faq.getQuestionRu() != null && !faq.getQuestionRu().isBlank()) {
            q = faq.getQuestionRu();
            a = faq.getAnswerRu() != null ? faq.getAnswerRu() : faq.getAnswerUz();
        } else if ("en".equals(locale) && faq.getQuestionEn() != null && !faq.getQuestionEn().isBlank()) {
            q = faq.getQuestionEn();
            a = faq.getAnswerEn() != null ? faq.getAnswerEn() : faq.getAnswerUz();
        } else {
            q = faq.getQuestionUz();
            a = faq.getAnswerUz();
        }

        return FaqResponse.builder()
                .id(faq.getId())
                .questionUz(faq.getQuestionUz())
                .questionRu(faq.getQuestionRu())
                .questionEn(faq.getQuestionEn())
                .answerUz(faq.getAnswerUz())
                .answerRu(faq.getAnswerRu())
                .answerEn(faq.getAnswerEn())
                .question(q)
                .answer(a)
                .category(faq.getCategory())
                .sortOrder(faq.getSortOrder())
                .createdAt(faq.getCreatedAt())
                .build();
    }
}
