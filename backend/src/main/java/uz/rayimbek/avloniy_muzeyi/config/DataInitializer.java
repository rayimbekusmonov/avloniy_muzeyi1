package uz.rayimbek.avloniy_muzeyi.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uz.rayimbek.avloniy_muzeyi.entity.HistoricalFigure;
import uz.rayimbek.avloniy_muzeyi.entity.User;
import uz.rayimbek.avloniy_muzeyi.repository.HistoricalFigureRepository;
import uz.rayimbek.avloniy_muzeyi.repository.UserRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HistoricalFigureRepository figureRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.username:admin}")
    private String defaultUsername;

    @Value("${app.default-admin.password:admin123}")
    private String defaultPassword;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Foydalanuvchilar topilmadi. Boshlang'ich admin akkaunti yaratilmoqda...");
            User admin = User.builder()
                    .username(defaultUsername)
                    .password(passwordEncoder.encode(defaultPassword))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Boshlang'ich admin yaratildi. Username: '{}'", defaultUsername);
        }

        if (figureRepository.count() == 0) {
            log.info("Jadid ma'rifatparvarlari topilmadi. Boshlang'ich jadidlar kiritilmoqda...");

            HistoricalFigure avloniy = HistoricalFigure.builder()
                    .nameUz("Abdulla Avloniy")
                    .nameRu("Абдулла Авлоний")
                    .nameEn("Abdulla Avloniy")
                    .titleUz("Shoir, dramaturg, pedagog, matbuot asoschisi")
                    .titleRu("Поэт, драматург, педагог, основатель прессы")
                    .titleEn("Poet, playwright, educator, founder of press")
                    .bioUz("Abdulla Avloniy (1878–1934) — XX asr boshidagi o'zbek ma'rifatparvarlik va jadidchilik harakatining eng ko'zga ko'ringan vakillaridan biri. Toshkentda yangi usul maktablari, 'Shuhrat', 'Taraqqiy', 'Osiyo' gazetalariga asos solgan.")
                    .bioRu("Абдулла Авлоний (1878–1934) — один из самых ярких представителей узбекского движения джадидов начала XX века.")
                    .bioEn("Abdulla Avloniy (1878–1934) — prominent Uzbek Jadid educator and writer.")
                    .years("1878–1934")
                    .imageUrl("/jadidlar/avloniy.jpg")
                    .works("Turkiy Guliston yoxud axloq, Muallimi soniy, Adabiyot yoxud milliy she'rlar")
                    .pdfUrl("/books/turkiy_guliston.pdf")
                    .featured(true)
                    .sortOrder(1)
                    .region("Toshkent")
                    .category("Ta'lim & Matbuot")
                    .quote("Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir.")
                    .build();

            HistoricalFigure behbudiy = HistoricalFigure.builder()
                    .nameUz("Mahmudxo'ja Behbudiy")
                    .nameRu("Махмудходжа Бехбудий")
                    .nameEn("Mahmudkhoja Behbudiy")
                    .titleUz("Jadidchilik harakati sarvari, dramaturg, noshir")
                    .titleRu("Лидер движения джадидов, драматург, издатель")
                    .titleEn("Leader of the Jadid movement, playwright, publisher")
                    .bioUz("Mahmudxo'ja Behbudiy (1875–1919) — Turkiston jadidchilik harakatining rahnamosi, publitsist, noshir va birinchi o'zbek dramasi 'Padarkush' muallifi.")
                    .bioRu("Махмудходжа Бехбудий (1875–1919) — признанный лидер джадидизма в Туркестане, издатель газеты «Самарканд» и журнала «Ойна».")
                    .bioEn("Mahmudkhoja Behbudiy (1875–1919) — leader of Turkestan Jadidism, founder of 'Oyna' magazine.")
                    .years("1875–1919")
                    .imageUrl("/jadidlar/behbudiy.jpg")
                    .works("Padarkush, Oyna jurnali to'plami, Muntaxabi jugrofiyayi umumiy")
                    .pdfUrl("/books/padarkush.pdf")
                    .featured(true)
                    .sortOrder(2)
                    .region("Samarqand")
                    .category("Matbuot & Teatr")
                    .quote("Haq olinadur, berilmaydur! Dunyoda turmoq uchun dunyoviy fan va ilm lozimdir.")
                    .build();

            HistoricalFigure munavvarqori = HistoricalFigure.builder()
                    .nameUz("Munavvarqori Abdurrashidxonov")
                    .nameRu("Мунавваркары Абдуррашидханов")
                    .nameEn("Munawwar Qari Abdurrashidkhanov")
                    .titleUz("Toshkent jadidlarining yetakchisi, pedagog, jamoat arbobi")
                    .titleRu("Лидер ташкентских джадидов, педагог, общественный деятель")
                    .titleEn("Leader of Tashkent Jadids, educator, public figure")
                    .bioUz("Munavvarqori Abdurrashidxonov (1878–1931) — Toshkentdagi jadidchilik harakatining asoschisi va g'oyaviy rahnamosi. 'Xurshid', 'Najot' gazetalarini tashkil etgan.")
                    .bioRu("Мунавваркары Абдуррашидханов (1878–1931) — основатель и идеолог движения джадидов в Ташкенте.")
                    .bioEn("Munawwar Qari Abdurrashidkhanov (1878–1931) — founder and leader of Tashkent Jadidism.")
                    .years("1878–1931")
                    .imageUrl("/jadidlar/munavvarqori.png")
                    .works("Adibi soniy, Sabzavor, Tajvidul Qur'on")
                    .pdfUrl("/books/adibi_soniy.pdf")
                    .featured(true)
                    .sortOrder(3)
                    .region("Toshkent")
                    .category("Ta'lim & Jamiyat")
                    .quote("Bizni jaholat va nodonlik qorong'uligidan faqat ilm, ma'rifat va maktab qutqara oladi.")
                    .build();

            HistoricalFigure cholpon = HistoricalFigure.builder()
                    .nameUz("Abdulhamid Cho'lpon")
                    .nameRu("Абдулхамид Чулпан")
                    .nameEn("Abdulhamid Cholpon")
                    .titleUz("Buyuk shoir, yozuvchi, tarjimon")
                    .titleRu("Великий поэт, писатель, переводчик")
                    .titleEn("Great poet, novelist, translator")
                    .bioUz("Abdulhamid Sulaymon o'g'li Cho'lpon (1897–1938) — XX asr o'zbek she'riyati va nasrining tengsiz namoyandasi. 'Kecha va kunduz' romani muallifi.")
                    .bioRu("Абдулхамид Сулаймон огли Чулпан (1897–1938) — выдающийся узбекский поэт и прозаик.")
                    .bioEn("Abdulhamid Cholpon (1897–1938) — outstanding Uzbek poet and author of 'Night and Day'.")
                    .years("1897–1938")
                    .imageUrl("/jadidlar/cholpon.jpg")
                    .works("Kecha va kunduz, Buloqlar, Uyg'onish")
                    .pdfUrl("/books/kecha_va_kunduz.pdf")
                    .featured(true)
                    .sortOrder(4)
                    .region("Farg'ona")
                    .category("Adabiyot & She'riyat")
                    .quote("Go'zal Turkiston, senga ne bo'ldi? Yonar bag'ringizda alanga qayda?")
                    .build();

            HistoricalFigure fitrat = HistoricalFigure.builder()
                    .nameUz("Abdurauf Fitrat")
                    .nameRu("Абдурауф Фитрат")
                    .nameEn("Abdurauf Fitrat")
                    .titleUz("Olim, dramaturg, akademik")
                    .titleRu("Учёный, драматург, академик")
                    .titleEn("Scholar, playwright, academician")
                    .bioUz("Abdurauf Fitrat (1886–1938) — Buxoro jadidchilik harakatining yo'lboshchisi va aloma.")
                    .years("1886–1938")
                    .imageUrl("/jadidlar/fitrat.jpg")
                    .works("Munozara, Hind sayyohi bayonoti")
                    .featured(true)
                    .sortOrder(5)
                    .region("Buxoro")
                    .category("Adabiyot & Fan")
                    .quote("Haqiqat egiladi, bukiladi, ammo sinmaydi! Millat ma'rifat bilan yashaydi.")
                    .build();

            figureRepository.saveAll(java.util.List.of(avloniy, behbudiy, munavvarqori, cholpon, fitrat));
            log.info("Boshlang'ich jadid ma'rifatparvarlari ma'lumotlar bazasiga saqlandi.");
        }
    }
}
