package uz.rayimbek.avloniy_muzeyi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.rayimbek.avloniy_muzeyi.dto.request.SiteSettingRequest;
import uz.rayimbek.avloniy_muzeyi.dto.response.SiteSettingResponse;
import uz.rayimbek.avloniy_muzeyi.entity.SiteSetting;
import uz.rayimbek.avloniy_muzeyi.repository.SiteSettingRepository;

@Service
@RequiredArgsConstructor
public class SiteSettingService {

    private final SiteSettingRepository repository;

    public SiteSetting getOrCreate() {
        return repository.findAll().stream().findFirst().orElseGet(() -> {
            SiteSetting setting = SiteSetting.builder()
                    .museumNameUz("Abdulla Avloniy Memorial Muzeyi")
                    .museumNameRu("Мемориальный Музей Абдуллы Авлония")
                    .museumNameEn("Abdulla Avloniy Memorial Museum")
                    .phone("+998 71 200 00 00")
                    .email("info@avloniy-muzey.uz")
                    .telegram("@avloniy_muzey")
                    .addressUz("Toshkent shahri, Yunusobod tumani, Abdulla Avloniy ko'chasi, 34-uy")
                    .addressRu("г. Ташкент, Юнусабадский район, ул. Абдуллы Авлония, 34")
                    .addressEn("34, Abdulla Avloniy Street, Yunusabad District, Tashkent")
                    .workingHoursUz("Dush-Shan: 09:00 - 18:00 | Yak: 10:00 - 16:00")
                    .workingHoursRu("Пн-Сб: 09:00 - 18:00 | Вс: 10:00 - 16:00")
                    .workingHoursEn("Mon-Sat: 09:00 - 18:00 | Sun: 10:00 - 16:00")
                    .telegramUrl("https://t.me/avloniy_muzey")
                    .instagramUrl("https://instagram.com/avloniy_muzey")
                    .youtubeUrl("https://youtube.com/@avloniy_muzey")
                    .facebookUrl("https://facebook.com/avloniy_muzey")
                    .statsExhibits("150+")
                    .statsFigures("50+")
                    .statsResources("1 000+")
                    .statsPhotos("500+")
                    .heroTitleUz("O'zbekiston Jadidlari & Abdulla Avloniy Merosi")
                    .heroTitleRu("Узбекские Джадиды и Наследие Абдуллы Авлония")
                    .heroTitleEn("Uzbek Jadids & The Heritage of Abdulla Avloniy")
                    .heroSubtitleUz("Milliy ma'rifatparvarlik harakati, yangi usul maktablari, matbuot va teatrga poydevor qo'ygan buyuk shaxslarning yagona interaktiv portali.")
                    .heroSubtitleRu("Единый интерактивный портал великих деятелей, заложивших основы национального просвещения, новометодных школ, прессы и театра.")
                    .heroSubtitleEn("Comprehensive interactive portal of great figures who founded national enlightenment, new-method schools, press, and theatre.")
                    .quoteTextUz("Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir.")
                    .quoteTextRu("Воспитание для нас — вопрос жизни или смерти, спасения или погибели, счастья или несчастья.")
                    .quoteTextEn("Upbringing for us is a matter of life or death, salvation or destruction, happiness or catastrophe.")
                    .build();
            return repository.save(setting);
        });
    }

    public SiteSettingResponse getSettings(String locale) {
        SiteSetting setting = getOrCreate();
        return toResponse(setting, locale);
    }

    @Transactional
    public SiteSettingResponse updateSettings(SiteSettingRequest request) {
        SiteSetting setting = getOrCreate();

        setting.setMuseumNameUz(request.getMuseumNameUz());
        setting.setMuseumNameRu(request.getMuseumNameRu());
        setting.setMuseumNameEn(request.getMuseumNameEn());

        setting.setPhone(request.getPhone());
        setting.setEmail(request.getEmail());
        setting.setTelegram(request.getTelegram());

        setting.setAddressUz(request.getAddressUz());
        setting.setAddressRu(request.getAddressRu());
        setting.setAddressEn(request.getAddressEn());

        setting.setWorkingHoursUz(request.getWorkingHoursUz());
        setting.setWorkingHoursRu(request.getWorkingHoursRu());
        setting.setWorkingHoursEn(request.getWorkingHoursEn());

        setting.setTelegramUrl(request.getTelegramUrl());
        setting.setInstagramUrl(request.getInstagramUrl());
        setting.setYoutubeUrl(request.getYoutubeUrl());
        setting.setFacebookUrl(request.getFacebookUrl());

        setting.setStatsExhibits(request.getStatsExhibits());
        setting.setStatsFigures(request.getStatsFigures());
        setting.setStatsResources(request.getStatsResources());
        setting.setStatsPhotos(request.getStatsPhotos());

        setting.setHeroTitleUz(request.getHeroTitleUz());
        setting.setHeroTitleRu(request.getHeroTitleRu());
        setting.setHeroTitleEn(request.getHeroTitleEn());

        setting.setHeroSubtitleUz(request.getHeroSubtitleUz());
        setting.setHeroSubtitleRu(request.getHeroSubtitleRu());
        setting.setHeroSubtitleEn(request.getHeroSubtitleEn());

        setting.setQuoteTextUz(request.getQuoteTextUz());
        setting.setQuoteTextRu(request.getQuoteTextRu());
        setting.setQuoteTextEn(request.getQuoteTextEn());

        if (request.getHeroQuotesJson() != null) {
            setting.setHeroQuotesJson(request.getHeroQuotesJson());
        }

        SiteSetting saved = repository.save(setting);
        return toResponse(saved, "uz");
    }

    private SiteSettingResponse toResponse(SiteSetting s, String locale) {
        String museumName, address, workingHours, heroTitle, heroSubtitle, quoteText;

        if ("ru".equals(locale) && s.getMuseumNameRu() != null) {
            museumName = s.getMuseumNameRu();
            address = s.getAddressRu();
            workingHours = s.getWorkingHoursRu();
            heroTitle = s.getHeroTitleRu();
            heroSubtitle = s.getHeroSubtitleRu();
            quoteText = s.getQuoteTextRu();
        } else if ("en".equals(locale) && s.getMuseumNameEn() != null) {
            museumName = s.getMuseumNameEn();
            address = s.getAddressEn();
            workingHours = s.getWorkingHoursEn();
            heroTitle = s.getHeroTitleEn();
            heroSubtitle = s.getHeroSubtitleEn();
            quoteText = s.getQuoteTextEn();
        } else {
            museumName = s.getMuseumNameUz();
            address = s.getAddressUz();
            workingHours = s.getWorkingHoursUz();
            heroTitle = s.getHeroTitleUz();
            heroSubtitle = s.getHeroSubtitleUz();
            quoteText = s.getQuoteTextUz();
        }

        return SiteSettingResponse.builder()
                .id(s.getId())
                .museumNameUz(s.getMuseumNameUz())
                .museumNameRu(s.getMuseumNameRu())
                .museumNameEn(s.getMuseumNameEn())
                .phone(s.getPhone())
                .email(s.getEmail())
                .telegram(s.getTelegram())
                .addressUz(s.getAddressUz())
                .addressRu(s.getAddressRu())
                .addressEn(s.getAddressEn())
                .workingHoursUz(s.getWorkingHoursUz())
                .workingHoursRu(s.getWorkingHoursRu())
                .workingHoursEn(s.getWorkingHoursEn())
                .telegramUrl(s.getTelegramUrl())
                .instagramUrl(s.getInstagramUrl())
                .youtubeUrl(s.getYoutubeUrl())
                .facebookUrl(s.getFacebookUrl())
                .statsExhibits(s.getStatsExhibits())
                .statsFigures(s.getStatsFigures())
                .statsResources(s.getStatsResources())
                .statsPhotos(s.getStatsPhotos())
                .heroTitleUz(s.getHeroTitleUz())
                .heroTitleRu(s.getHeroTitleRu())
                .heroTitleEn(s.getHeroTitleEn())
                .heroSubtitleUz(s.getHeroSubtitleUz())
                .heroSubtitleRu(s.getHeroSubtitleRu())
                .heroSubtitleEn(s.getHeroSubtitleEn())
                .quoteTextUz(s.getQuoteTextUz())
                .quoteTextRu(s.getQuoteTextRu())
                .quoteTextEn(s.getQuoteTextEn())
                .heroQuotesJson(s.getHeroQuotesJson())
                .museumName(museumName)
                .address(address)
                .workingHours(workingHours)
                .heroTitle(heroTitle)
                .heroSubtitle(heroSubtitle)
                .quoteText(quoteText)
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
