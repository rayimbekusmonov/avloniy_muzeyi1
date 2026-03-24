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
import uz.rayimbek.avloniy_muzeyi.exception.ResourceNotFoundException;
import uz.rayimbek.avloniy_muzeyi.repository.NewsRepository;
import uz.rayimbek.avloniy_muzeyi.repository.UserRepository;

import java.text.Normalizer;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;

    // O'zbek harflarini transliteratsiya qilish
    private static final Map<String, String> UZ_TRANSLIT = new HashMap<>();
    static {
        UZ_TRANSLIT.put("sh", "sh"); UZ_TRANSLIT.put("ch", "ch");
        UZ_TRANSLIT.put("o'", "o");  UZ_TRANSLIT.put("g'", "g");
        UZ_TRANSLIT.put("o`", "o");  UZ_TRANSLIT.put("g`", "g");
        UZ_TRANSLIT.put("oʻ", "o"); UZ_TRANSLIT.put("gʻ", "g");
        // Kirill harflari
        UZ_TRANSLIT.put("ш", "sh"); UZ_TRANSLIT.put("ч", "ch");
        UZ_TRANSLIT.put("ю", "yu"); UZ_TRANSLIT.put("я", "ya");
        UZ_TRANSLIT.put("ё", "yo"); UZ_TRANSLIT.put("ж", "j");
        UZ_TRANSLIT.put("х", "x");  UZ_TRANSLIT.put("ц", "ts");
        UZ_TRANSLIT.put("щ", "shch");
        UZ_TRANSLIT.put("а", "a"); UZ_TRANSLIT.put("б", "b"); UZ_TRANSLIT.put("в", "v");
        UZ_TRANSLIT.put("г", "g"); UZ_TRANSLIT.put("д", "d"); UZ_TRANSLIT.put("е", "e");
        UZ_TRANSLIT.put("з", "z"); UZ_TRANSLIT.put("и", "i"); UZ_TRANSLIT.put("й", "y");
        UZ_TRANSLIT.put("к", "k"); UZ_TRANSLIT.put("л", "l"); UZ_TRANSLIT.put("м", "m");
        UZ_TRANSLIT.put("н", "n"); UZ_TRANSLIT.put("о", "o"); UZ_TRANSLIT.put("п", "p");
        UZ_TRANSLIT.put("р", "r"); UZ_TRANSLIT.put("с", "s"); UZ_TRANSLIT.put("т", "t");
        UZ_TRANSLIT.put("у", "u"); UZ_TRANSLIT.put("ф", "f");
        UZ_TRANSLIT.put("ъ", ""); UZ_TRANSLIT.put("ь", "");
        UZ_TRANSLIT.put("э", "e"); UZ_TRANSLIT.put("ў", "o"); UZ_TRANSLIT.put("қ", "q");
        UZ_TRANSLIT.put("ғ", "g"); UZ_TRANSLIT.put("ҳ", "h");
    }

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
                .orElseThrow(() -> new ResourceNotFoundException("Yangilik", slug));
        return toResponse(news, locale);
    }

    public NewsResponse create(NewsRequest request) {
        String username = Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()).getName();
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Foydalanuvchi", username));

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
                .orElseThrow(() -> new ResourceNotFoundException("Yangilik", id));

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
            throw new ResourceNotFoundException("Yangilik", id);
        }
        newsRepository.deleteById(id);
    }

    public Page<NewsResponse> getAllForAdmin(int page, int size) {
        return newsRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(this::toAdminResponse);
    }

    // --- Helper methods ---

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
        if (slug.isBlank()) {
            slug = "news-" + System.currentTimeMillis();
        }
        if (newsRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }
        return slug;
    }

    /**
     * O'zbek va kirill harflarini to'g'ri transliteratsiya qiluvchi slug generator.
     */
    private String toSlug(String input) {
        if (input == null || input.isBlank()) return "";

        String text = input.toLowerCase().trim();

        // O'zbek maxsus harflarini transliteratsiya
        for (Map.Entry<String, String> entry : UZ_TRANSLIT.entrySet()) {
            text = text.replace(entry.getKey(), entry.getValue());
        }

        // Unicode normalizatsiya — aksent belgilarini olib tashlash
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        Pattern diacritics = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        text = diacritics.matcher(normalized).replaceAll("");

        // Faqat lotin harf va raqamlarni qoldirish
        text = text.replaceAll("[^a-z0-9\\s-]", "");
        text = text.replaceAll("\\s+", "-");
        text = text.replaceAll("-+", "-");
        text = text.replaceAll("^-|-$", "");

        // Maksimal uzunlik
        if (text.length() > 100) {
            text = text.substring(0, 100);
            // So'z o'rtasida kesmaslik
            int lastDash = text.lastIndexOf('-');
            if (lastDash > 50) {
                text = text.substring(0, lastDash);
            }
        }

        return text;
    }
}
