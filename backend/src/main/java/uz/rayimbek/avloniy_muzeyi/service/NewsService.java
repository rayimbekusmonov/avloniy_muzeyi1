package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import uz.rayimbek.avloniy_muzeyi.dto.request.NewsRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.NewsResponse;
import uz.rayimbek.avloniy_muzeyi.entity.News;
import uz.rayimbek.avloniy_muzeyi.entity.User;
import uz.rayimbek.avloniy_muzeyi.repository.NewsRepository;
import uz.rayimbek.avloniy_muzeyi.repository.UserRepository;

import java.text.Normalizer;
import java.util.Objects;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    public Page<NewsResponse> getPublishedNews(int page, int size, String category, String locale) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> newsPage;

        if (category != null && !category.isBlank()) {
            News.Category cat = News.Category.valueOf(category.toUpperCase());
            newsPage = newsRepository.findAllByPublishedTrueAndCategoryOrderByCreatedAtDesc(cat, pageable);
        } else {
            newsPage = newsRepository.findAllByPublishedTrueOrderByCreatedAtDesc(pageable);
        }

        return newsPage.map(n -> toResponse(n, locale));
    }

    public NewsResponse getNewsBySlug(String slug, String locale) {
        News news = newsRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Yangilik topilmadi: " + slug));
        return toResponse(news, locale);
    }

    public NewsResponse create(NewsRequest request) {
        String username = Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()).getName();
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Foydalanuvchi topilmadi"));

        String slug = generateUniqueSlug(request.getTitleUz());

        News news = News.builder()
                .titleUz(request.getTitleUz())
                .contentUz(request.getContentUz())
                .excerptUz(request.getExcerptUz())
                .titleRu(request.getTitleRu())
                .contentRu(request.getContentRu())
                .excerptRu(request.getExcerptRu())
                .titleEn(request.getTitleEn())
                .contentEn(request.getContentEn())
                .excerptEn(request.getExcerptEn())
                .slug(slug)
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .published(request.getPublished())
                .author(author)
                .build();

        return toAdminResponse(newsRepository.save(news));
    }

    public NewsResponse update(Long id, NewsRequest request) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yangilik topilmadi: " + id));

        news.setTitleUz(request.getTitleUz());
        news.setContentUz(request.getContentUz());
        news.setExcerptUz(request.getExcerptUz());
        news.setTitleRu(request.getTitleRu());
        news.setContentRu(request.getContentRu());
        news.setExcerptRu(request.getExcerptRu());
        news.setTitleEn(request.getTitleEn());
        news.setContentEn(request.getContentEn());
        news.setExcerptEn(request.getExcerptEn());
        news.setImageUrl(request.getImageUrl());
        news.setCategory(request.getCategory());
        news.setPublished(request.getPublished());

        return toAdminResponse(newsRepository.save(news));
    }

    public void delete(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new RuntimeException("Yangilik topilmadi: " + id);
        }
        newsRepository.deleteById(id);
    }

    public Page<NewsResponse> getAllForAdmin(int page, int size) {
        return newsRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(this::toAdminResponse);
    }

    // --- Helper methods ---

    // Locale bo'yicha to'g'ri tilni qaytaradi (frontend uchun)
    private NewsResponse toResponse(News news, String locale) {
        String title, content, excerpt;

        if ("ru".equals(locale) && news.getTitleRu() != null && !news.getTitleRu().isBlank()) {
            title   = news.getTitleRu();
            content = news.getContentRu();
            excerpt = news.getExcerptRu();
        } else if ("en".equals(locale) && news.getTitleEn() != null && !news.getTitleEn().isBlank()) {
            title   = news.getTitleEn();
            content = news.getContentEn();
            excerpt = news.getExcerptEn();
        } else {
            // Default: o'zbek tili
            title   = news.getTitleUz();
            content = news.getContentUz();
            excerpt = news.getExcerptUz();
        }

        return NewsResponse.builder()
                .id(news.getId())
                .slug(news.getSlug())
                .title(title)
                .content(content)
                .excerpt(excerpt)
                .imageUrl(news.getImageUrl())
                .category(news.getCategory())
                .published(news.getPublished())
                .authorUsername(news.getAuthor() != null ? news.getAuthor().getUsername() : null)
                .createdAt(news.getCreatedAt())
                .updatedAt(news.getUpdatedAt())
                .build();
    }

    // Admin uchun — barcha til maydonlari qaytariladi
    private NewsResponse toAdminResponse(News news) {
        return NewsResponse.builder()
                .id(news.getId())
                .slug(news.getSlug())
                .titleUz(news.getTitleUz())
                .contentUz(news.getContentUz())
                .excerptUz(news.getExcerptUz())
                .titleRu(news.getTitleRu())
                .contentRu(news.getContentRu())
                .excerptRu(news.getExcerptRu())
                .titleEn(news.getTitleEn())
                .contentEn(news.getContentEn())
                .excerptEn(news.getExcerptEn())
                // title ni o'zbek tilida qo'yamiz (admin listda ko'rinishi uchun)
                .title(news.getTitleUz())
                .content(news.getContentUz())
                .excerpt(news.getExcerptUz())
                .imageUrl(news.getImageUrl())
                .category(news.getCategory())
                .published(news.getPublished())
                .authorUsername(news.getAuthor() != null ? news.getAuthor().getUsername() : null)
                .createdAt(news.getCreatedAt())
                .updatedAt(news.getUpdatedAt())
                .build();
    }

    private String generateUniqueSlug(String title) {
        String slug = toSlug(title);
        if (newsRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }
        return slug;
    }

    private String toSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized)
                .replaceAll("")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
}