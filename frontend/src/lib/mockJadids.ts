import { HistoricalFigure } from './api';

export const MOCK_JADIDS: HistoricalFigure[] = [
    {
        id: 1,
        nameUz: "Abdulla Avloniy",
        nameRu: "Абдулла Авлоний",
        nameEn: "Abdulla Avloniy",
        titleUz: "Shoir, dramaturg, pedagog, matbuot asoschisi",
        titleRu: "Поэт, драматург, педагог, основатель прессы",
        titleEn: "Poet, playwright, educator, founder of press",
        bioUz: "Abdulla Avloniy (1878–1934) — XX asr boshidagi o'zbek ma'rifatparvarlik va jadidchilik harakatining eng ko'zga ko'ringan vakillaridan biri. Toshkentda yangi usul maktablari, 'Shuhrat', 'Taraqqiy', 'Osiyo' gazetalariga asos solgan. Uning 'Turkiy Guliston yoxud axloq' asari milliy pedagogikamiz durdonasidir.",
        bioRu: "Абдулла Авлоний (1878–1934) — один из самых ярких представителей узбекского просветительского движения джадидов начала XX века. Основатель новометодных школ в Ташкенте и газет «Шухрат», «Тараккий». Его труд «Туркий Гулистон ёхуд ахлоқ» является жемчужиной национальной педагогики.",
        bioEn: "Abdulla Avloniy (1878–1934) — one of the most prominent figures of the Uzbek Jadid enlightenment movement of the early 20th century. Founder of new-method schools in Tashkent and newspapers 'Shuhrat', 'Taraqqiy'. His work 'Turkiy Guliston yoxud axloq' remains a masterpiece of national pedagogy.",
        name: "Abdulla Avloniy",
        title: "Shoir, dramaturg, pedagog, matbuot asoschisi",
        bio: "Abdulla Avloniy — XX asr boshidagi o'zbek ma'rifatparvarlik va jadidchilik harakatining eng ko'zga ko'ringan vakillaridan biri. Toshkentda yangi usul maktablari, 'Shuhrat', 'Taraqqiy', 'Osiyo' gazetalariga asos solgan. Uning 'Turkiy Guliston yoxud axloq' asari milliy pedagogikamiz durdonasidir.",
        years: "1878–1934",
        imageUrl: "/avatars/avloniy.jpg",
        works: "Turkiy Guliston yoxud axloq, Muallimi soniy, Adabiyot yoxud milliy she'rlar",
        pdfUrl: "/books/turkiy_guliston.pdf",
        featured: true,
        sortOrder: 1,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Toshkent",
        category: "Ta'lim & Matbuot",
        quote: "Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir.",
        timeline: [
            { year: "1878", title: "Tavallud", desc: "Toshkentning Mergancha mahallasida hunarmand oilasida dunyoga kelgan." },
            { year: "1904", title: "Yangi usul maktabi", desc: "Toshkentda 'Usuli savtiyab' (yangi usul) maktabini tashkil etgan." },
            { year: "1907", title: "Matbuot faoliyati", desc: "'Shuhrat' va 'Taraqqiy' gazetalariga asos solib, ma'rifiy g'oyalarni tarqatdi." },
            { year: "1913", title: "'Turkiy Guliston' nashri", desc: "Sharq va G'arb hikmatini jamlagan pedagogik shoh asarini nashr qildi." },
            { year: "1934", title: "Abadiyat", desc: "Toshkentda vafot etdi va Botkin qabristoniga dafn etildi." }
        ],
        galleryPhotos: [
            { title: "Abdulla Avloniy shaxsiy surati (1920)", url: "/gallery/avloniy_1.jpg" },
            { title: "Yangi usul maktabi o'quvchilari bilan (1914)", url: "/gallery/avloniy_2.jpg" },
            { title: "Turkiy Guliston kitobining birinchi nusxasi (1913)", url: "/gallery/avloniy_3.jpg" }
        ],
        figureWorks: [
            { id: 101, title: "Turkiy Guliston yoxud axloq", year: 1913, pdfUrl: "/books/turkiy_guliston.pdf", sortOrder: 1 },
            { id: 102, title: "Muallimi soniy (Ikkinchi muallim)", year: 1917, pdfUrl: "/books/muallimi_soniy.pdf", sortOrder: 2 },
            { id: 103, title: "Adabiyot yoxud milliy she'rlar", year: 1909, pdfUrl: "/books/adabiyot.pdf", sortOrder: 3 },
            { id: 104, title: "Pinxona dramalari to'plami", year: 1916, pdfUrl: "/books/pinxona.pdf", sortOrder: 4 }
        ]
    },
    {
        id: 2,
        nameUz: "Mahmudxo'ja Behbudiy",
        nameRu: "Махмудходжа Бехбудий",
        nameEn: "Mahmudkhoja Behbudiy",
        titleUz: "Jadidchilik harakati sarvari, dramaturg, noshir",
        titleRu: "Лидер движения джадидов, драматург, издатель",
        titleEn: "Leader of the Jadid movement, playwright, publisher",
        bioUz: "Mahmudxo'ja Behbudiy (1875–1919) — Turkiston jadidchilik harakatining rahnamosi, publitsist, noshir va birinchi o'zbek dramasi 'Padarkush' muallifi. Samarqandda 'Samarqand' gazetasi va 'Oyna' jurnalini nashr etib, milliy o'zlikni anglashga ulkan hissa qo'shgan.",
        bioRu: "Махмудходжа Бехбудий (1875–1919) — признанный лидер джадидизма в Туркестане, публицист, издатель и автор первой узбекской драмы «Падаркуш». В Самарканде издавал газету «Самарканд» и журнал «Ойна».",
        bioEn: "Mahmudkhoja Behbudiy (1875–1919) — the ideological leader of Turkestan Jadidism, publicist, publisher, and author of the first Uzbek drama 'Padarkush'. Published 'Samarqand' newspaper and 'Oyna' magazine.",
        name: "Mahmudxo'ja Behbudiy",
        title: "Jadidchilik harakati sarvari, dramaturg, noshir",
        bio: "Mahmudxo'ja Behbudiy — Turkiston jadidchilik harakatining rahnamosi, publitsist, noshir va birinchi o'zbek dramasi 'Padarkush' muallifi. Samarqandda 'Samarqand' gazetasi va 'Oyna' jurnalini nashr etib, milliy o'zlikni anglashga ulkan hissa qo'shgan.",
        years: "1875–1919",
        imageUrl: "/avatars/behbudiy.jpg",
        works: "Padarkush, Oyna jurnali to'plami, Muntaxabi jugrofiyayi umumiy",
        pdfUrl: "/books/padarkush.pdf",
        featured: false,
        sortOrder: 2,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Samarqand",
        category: "Matbuot & Teatr",
        quote: "Haq olinadur, berilmaydur! Dunyoda turmoq uchun dunyoviy fan va ilm lozimdir.",
        timeline: [
            { year: "1875", title: "Tavallud", desc: "Samarqand yaqinidagi BAXSHITEPA qishlog'ida tug'ilgan." },
            { year: "1903", title: "Maktablar harakati", desc: "Samarqandda yangi usul maktablarini tashkil qildi." },
            { year: "1911", title: "'Padarkush' dramasi", desc: "Birinchi o'zbek professional dramasi 'Padarkush'ni yozgan." },
            { year: "1913", title: "'Oyna' jurnali", desc: "'Oyna' jurnali va 'Samarqand' gazetasiga asos solgan." },
            { year: "1919", title: "Fojiali o'lim", desc: "Qarshi shahrida ma'rifat yo'lidagi kurashda halok bo'lgan." }
        ],
        galleryPhotos: [
            { title: "Mahmudxo'ja Behbudiy portreti (1915)", url: "/gallery/behbudiy_1.jpg" },
            { title: "Padarkush spektakli afrishasi (1914)", url: "/gallery/behbudiy_2.jpg" },
            { title: "Oyna jurnali birinchi soni muqovasi (1913)", url: "/gallery/behbudiy_3.jpg" }
        ],
        figureWorks: [
            { id: 201, title: "Padarkush yoxud o'qimagan bolaning holi", year: 1911, pdfUrl: "/books/padarkush.pdf", sortOrder: 1 },
            { id: 202, title: "Oyna jurnali maqolalar to'plami", year: 1913, pdfUrl: "/books/oyna.pdf", sortOrder: 2 },
            { id: 203, title: "Muntaxabi jugrofiyayi umumiy", year: 1906, pdfUrl: "/books/jugrofiya.pdf", sortOrder: 3 }
        ]
    },
    {
        id: 3,
        nameUz: "Munavvarqori Abdurrashidxonov",
        nameRu: "Мунавваркары Абдуррашидханов",
        nameEn: "Munawwar Qari Abdurrashidkhanov",
        titleUz: "Toshkent jadidlarining yetakchisi, pedagog, jamoat arbobi",
        titleRu: "Лидер ташкентских джадидов, педагог, общественный деятель",
        titleEn: "Leader of Tashkent Jadids, educator, public figure",
        bioUz: "Munavvarqori Abdurrashidxonov (1878–1931) — Toshkentdagi jadidchilik harakatining asoschisi va g'oyaviy rahnamosi. 'Xurshid', 'Najot' gazetalarini tashkil etgan, 'Jamiyati imdodiya' xayriya jamiyatiga hamda 'Turon' teatr truppasiga boshchilik qilgan.",
        bioRu: "Мунавваркары Абдуррашидханов (1878–1931) — основатель и идеолог движения джадидов в Ташкенте. Основал газеты «Хуршид», «Нажот», руководил благотворительным обществом «Жамияти имдодия».",
        bioEn: "Munawwar Qari Abdurrashidkhanov (1878–1931) — founder and leader of Tashkent Jadidism. Founded 'Khurshid' and 'Najot' newspapers, headed the 'Jamiyati imdodiya' charity society.",
        name: "Munavvarqori Abdurrashidxonov",
        title: "Toshkent jadidlarining yetakchisi, pedagog, jamoat arbobi",
        bio: "Munavvarqori Abdurrashidxonov — Toshkentdagi jadidchilik harakatining asoschisi va g'oyaviy rahnamosi. 'Xurshid', 'Najot' gazetalarini tashkil etgan, 'Jamiyati imdodiya' xayriya jamiyatiga hamda 'Turon' teatr truppasiga boshchilik qilgan.",
        years: "1878–1931",
        imageUrl: "/avatars/munavvarqori.jpg",
        works: "Adibi soniy, Sabzavor, Tajvidul Qur'on",
        pdfUrl: "/books/adibi_soniy.pdf",
        featured: false,
        sortOrder: 3,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Toshkent",
        category: "Ta'lim & Jamiyat",
        quote: "Bizni jaholat va nodonlik qorong'uligidan faqat ilm, ma'rifat va maktab qutqara oladi.",
        timeline: [
            { year: "1878", title: "Tavallud", desc: "Toshkentning Shayxontohur dahasida tavallud topgan." },
            { year: "1901", title: "Birinchi maktab", desc: "Toshkentda o'z hovlisida birinchi jadid maktabini ochgan." },
            { year: "1906", title: "'Xurshid' gazetasi", desc: "'Xurshid' gazetasini chop eta boshlagan." },
            { year: "1914", title: "'Turon' jamiyati", desc: "'Turon' jamiyati va teatr truppasini tuzgan." },
            { year: "1931", title: "Qatag'on", desc: "Moskvada qatag'on qurboni bo'lgan." }
        ],
        galleryPhotos: [
            { title: "Munavvarqori Abdurrashidxonov surati (1917)", url: "/gallery/munavvarqori_1.jpg" },
            { title: "Toshkent jadidlari majlisi (1918)", url: "/gallery/munavvarqori_2.jpg" }
        ],
        figureWorks: [
            { id: 301, title: "Adibi soniy", year: 1907, pdfUrl: "/books/adibi_soniy.pdf", sortOrder: 1 },
            { id: 302, title: "Sabzavor (O'qish kitobi)", year: 1912, pdfUrl: "/books/sabzavor.pdf", sortOrder: 2 },
            { id: 303, title: "Yer yuzi (Jugrofiya darsligi)", year: 1918, pdfUrl: "/books/yer_yuzi.pdf", sortOrder: 3 }
        ]
    },
    {
        id: 4,
        nameUz: "Abdulhamid Cho'lpon",
        nameRu: "Абдулхамид Чулпан",
        nameEn: "Abdulhamid Cholpon",
        titleUz: "Buyuk shoir, yozuvchi, tarjimon",
        titleRu: "Великий поэт, писатель, переводчик",
        titleEn: "Great poet, novelist, translator",
        bioUz: "Abdulhamid Sulaymon o'g'li Cho'lpon (1897–1938) — XX asr o'zbek she'riyati va nasrining tengsiz namoyandasi. Uning 'Kecha va kunduz' romani hamda otashin she'rlari erkinlik, ma'rifat va milliy g'urur madhiyasi bo'lib qoldi.",
        bioRu: "Абдулхамид Сулаймон огли Чулпан (1897–1938) — выдающийся узбекский поэт и прозаик. Его роман «Ночь и день» и пламенные стихи стали гимном свободы и просвещения.",
        bioEn: "Abdulhamid Cholpon (1897–1938) — outstanding Uzbek poet and writer. His novel 'Night and Day' and passionate poems became a hymn for freedom and education.",
        name: "Abdulhamid Cho'lpon",
        title: "Buyuk shoir, yozuvchi, tarjimon",
        bio: "Abdulhamid Sulaymon o'g'li Cho'lpon — XX asr o'zbek she'riyati va nasrining tengsiz namoyandasi. Uning 'Kecha va kunduz' romani hamda otashin she'rlari erkinlik, ma'rifat va milliy g'urur madhiyasi bo'lib qoldi.",
        years: "1897–1938",
        imageUrl: "/avatars/cholpon.jpg",
        works: "Kecha va kunduz, Buloqlar, Uyg'onish, Yorqinoy",
        pdfUrl: "/books/kecha_va_kunduz.pdf",
        featured: false,
        sortOrder: 4,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Farg'ona",
        category: "Adabiyot & She'riyat",
        quote: "Go'zal Turkiston, senga ne bo'ldi? Yonar bag'ringizda alanga qayda?",
        timeline: [
            { year: "1897", title: "Tavallud", desc: "Andijon shahrida ziyoli oilada tug'ilgan." },
            { year: "1914", title: "Ilk ijod", desc: "Birinchi she'rlari va maqolalarini matbuotda chop ettirgan." },
            { year: "1922", title: "'Uyg'onish' to'plami", desc: "Mashhur 'Uyg'onish' she'riy to'plami bosilib chiqqan." },
            { year: "1936", title: "'Kecha va kunduz'", desc: "O'zbek adabiyoti shoh romani 'Kecha va kunduz' nashr etilgan." },
            { year: "1938", title: "Qatag'on", desc: "Toshkentda foljiatli tarzda qatag'on qilingan." }
        ],
        galleryPhotos: [
            { title: "Abdulhamid Cho'lpon surati (1930)", url: "/gallery/cholpon_1.jpg" },
            { title: "Kecha va kunduz birinchi nashri muqovasi (1936)", url: "/gallery/cholpon_2.jpg" }
        ],
        figureWorks: [
            { id: 401, title: "Kecha va kunduz (Roman)", year: 1936, pdfUrl: "/books/kecha_va_kunduz.pdf", sortOrder: 1 },
            { id: 402, title: "Buloqlar (She'riy to'plam)", year: 1923, pdfUrl: "/books/buloqlar.pdf", sortOrder: 2 },
            { id: 403, title: "Uyg'onish (She'riy to'plam)", year: 1922, pdfUrl: "/books/uygonish.pdf", sortOrder: 3 }
        ]
    },
    {
        id: 5,
        nameUz: "Abdurauf Fitrat",
        nameRu: "Абдурауф Фитрат",
        nameEn: "Abdurauf Fitrat",
        titleUz: "Olim, dramaturg, davlat va jamoat arbobi, akademik",
        titleRu: "Учёный, драматург, государственный деятель, академик",
        titleEn: "Scholar, playwright, statesman, academician",
        bioUz: "Abdurauf Fitrat (1886–1938) — Buxoro jadidchilik harakatining yo'lboshchisi, o'zbek filologiyasi va adabiyotshunosligiga asos solgan buyuk aloma. Turkiy tillar, adabiyot tarixi va musiqa bo'yicha fundamental ilmiy asarlar muallifi.",
        bioRu: "Абдурауф Фитрат (1886–1938) — лидер движения джадидов Бухары, основоположник узбекской филологии. Автор фундаментальных трудов по языкознанию, литературе и музыке.",
        bioEn: "Abdurauf Fitrat (1886–1938) — leader of Bukhara Jadidism, founder of Uzbek linguistics and literary studies. Author of fundamental research works.",
        name: "Abdurauf Fitrat",
        title: "Olim, dramaturg, davlat va jamoat arbobi, akademik",
        bio: "Abdurauf Fitrat — Buxoro jadidchilik harakatining yo'lboshchisi, o'zbek filologiyasi va adabiyotshunosligiga asos solgan buyuk aloma. Turkiy tillar, adabiyot tarixi va musiqa bo'yicha fundamental ilmiy asarlar muallifi.",
        years: "1886–1938",
        imageUrl: "/avatars/fitrat.jpg",
        works: "Munozara, Hind sayyohi bayonoti, O'zbek tili qoidalari, Abulfayzxon",
        pdfUrl: "/books/munozara.pdf",
        featured: false,
        sortOrder: 5,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Buxoro",
        category: "Adabiyot & Fan",
        quote: "Haqiqat egiladi, bukiladi, ammo sinmaydi! Millat ma'rifat bilan yashaydi.",
        timeline: [
            { year: "1886", title: "Tavallud", desc: "Buxoro shahrida tavallud topgan." },
            { year: "1909", title: "Istanbul yillari", desc: "Istanbulda o'qib, 'Buxoro ta'limi maorif' jamiyatini tuzgan." },
            { year: "1911", title: "'Munozara' e'loni", desc: "Mashhur 'Munozara' asarini e'lon qilgan." },
            { year: "1926", title: "Professor unvoni", desc: "Birinchi o'zbek professorlaridan biriga aylangan." },
            { year: "1938", title: "Qatag'on", desc: "Toshkentda qatag'on qilingan." }
        ],
        galleryPhotos: [
            { title: "Abdurauf Fitrat surati (1925)", url: "/gallery/fitrat_1.jpg" },
            { title: "O'zbek tili qoidalari darsligi muqovasi (1925)", url: "/gallery/fitrat_2.jpg" }
        ],
        figureWorks: [
            { id: 501, title: "Munozara", year: 1911, pdfUrl: "/books/munozara.pdf", sortOrder: 1 },
            { id: 502, title: "Hind sayyohi bayonoti", year: 1912, pdfUrl: "/books/hind_sayyohi.pdf", sortOrder: 2 },
            { id: 503, title: "Abulfayzxon (Tarixiy drama)", year: 1924, pdfUrl: "/books/abulfayzxon.pdf", sortOrder: 3 }
        ]
    },
    {
        id: 6,
        nameUz: "Ishoqxon Ibrat",
        nameRu: "Исхокхон Ибрат",
        nameEn: "Ishoqkhon Ibrat",
        titleUz: "Tilshunos olim, ma'rifatparvar, noshir",
        titleRu: "Учёный-языковед, просветитель, издатель",
        titleEn: "Linguist, enlightener, publisher",
        bioUz: "Ishoqxon Junaydullaxo'ja o'g'li Ibrat (1862–1937) — Namangan viloyatining To'raqo'rg'onida tug'ilgan buyuk ma'rifatparvar. U 6 ta tilni mukammal bilgan va o'z qishlog'ida bosmaxona ('Matbaai Ibratiya') tashkil etgan.",
        bioRu: "Исхокхон Ибрат (1862–1937) — просветитель из Намангана. Владел 6 языками, составил 6-язычный словарь и основал первую типографию «Матбааи Ибратия».",
        bioEn: "Ishoqkhon Ibrat (1862–1937) — enlightener from Namangan. Mastered 6 languages, compiled a 6-language dictionary, and established the 'Matbaai Ibratiya' print house.",
        name: "Ishoqxon Ibrat",
        title: "Tilshunos olim, ma'rifatparvar, noshir",
        bio: "Ishoqxon Junaydullaxo'ja o'g'li Ibrat — Namangan viloyatining To'raqo'rg'onida tug'ilgan buyuk ma'rifatparvar. U 6 ta tilni mukammal bilgan va o'z qishlog'ida bosmaxona ('Matbaai Ibratiya') tashkil etgan.",
        years: "1862–1937",
        imageUrl: "/avatars/ibrat.jpg",
        works: "Lug'ati sitta-alsina, Jame' ul-xutut, Tarixi Farg'ona",
        pdfUrl: "/books/lugati_sitta.pdf",
        featured: false,
        sortOrder: 6,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Farg'ona",
        category: "Ta'lim & Matbaa",
        quote: "Har bir millat o'z tilida sadosini topmog'i va dunyo ilmlarini egallamog'i lozim.",
        timeline: [
            { year: "1862", title: "Tavallud", desc: "To'raqo'rg'on tumanida tavallud topgan." },
            { year: "1886", title: "Dunyo sayohati", desc: "Sharq va Yevropa mamlakatlariga sayohat qilib, tillar o'rgangan." },
            { year: "1901", title: "Olti tilli lug'at", desc: "'Lug'ati sitta-alsina' (Olti tilli lug'at) asarini yaratgan." },
            { year: "1908", title: "Bosmaxona", desc: "To'raqo'rg'onda birinchi bosmaxonasini ishga tushirgan." },
            { year: "1937", title: "Qatag'on", desc: "Andijon qamoqxonasida vafot etgan." }
        ],
        galleryPhotos: [
            { title: "Ishoqxon Ibrat shaxsiy surati (1925)", url: "/gallery/ibrat_1.jpg" },
            { title: "Lug'ati sitta-alsina kitobi (1901)", url: "/gallery/ibrat_2.jpg" }
        ],
        figureWorks: [
            { id: 601, title: "Lug'ati sitta-alsina (Olti tilli lug'at)", year: 1901, pdfUrl: "/books/lugati_sitta.pdf", sortOrder: 1 },
            { id: 602, title: "Jame' ul-xutut (Yozuvlar to'plami)", year: 1912, pdfUrl: "/books/jame_ul_xutut.pdf", sortOrder: 2 }
        ]
    },
    {
        id: 7,
        nameUz: "Mashriq Yunusov (Elbek)",
        nameRu: "Элбек (Машрик Юнусов)",
        nameEn: "Elbek (Mashriq Yunusov)",
        titleUz: "Shoir, tilshunos olim, jadid adabiyoti vakili",
        titleRu: "Поэт, языковед, представитель литературы джадидов",
        titleEn: "Poet, linguist, representative of Jadid literature",
        bioUz: "Elbek (1898–1939) — o'zbek bolalar adabiyoti va folklorshunosligining ilk darg'alaridan biri. U jadid maktablari uchun ko'plab darsliklar va she'riy to'plamlar yaratgan.",
        bioRu: "Элбек (1898–1939) — один из зачинателей узбекской детской литературы и фольклористики. Составитель учебников для школ джадидов.",
        bioEn: "Elbek (1898–1939) — pioneer of Uzbek children's literature and folklore. Compiled textbooks for Jadid schools.",
        name: "Mashriq Yunusov (Elbek)",
        title: "Shoir, tilshunos olim, jadid adabiyoti vakili",
        bio: "Elbek — o'zbek bolalar adabiyoti va folklorshunosligining ilk darg'alaridan biri. U jadid maktablari uchun ko'plab darsliklar va she'riy to'plamlar yaratgan.",
        years: "1898–1939",
        imageUrl: "/avatars/elbek.jpg",
        works: "Armug'on, Yozig'lar, Chirchiq bo'ylarida",
        pdfUrl: "/books/armugon.pdf",
        featured: false,
        sortOrder: 7,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Toshkent",
        category: "Adabiyot & Tilshunoslik",
        quote: "O'zbek tili — boy va jozibador til. Uni asramoq ham farz, ham qarzdir.",
        timeline: [
            { year: "1898", title: "Tavallud", desc: "Toshkent viloyatining Bo'stonliq tumanida tug'ilgan." },
            { year: "1917", title: "Jadidchilik harakati", desc: "Jadid matbuoti va ma'rifiy to'garaklarda faol qatnashgan." },
            { year: "1921", title: "'Armug'on' to'plami", desc: "Ilk she'riy to'plamini nashr etgan." },
            { year: "1939", title: "Abadiyat", desc: "Qatag'on yillarida vafot etgan." }
        ],
        galleryPhotos: [
            { title: "Elbek surati (1928)", url: "/gallery/elbek_1.jpg" }
        ],
        figureWorks: [
            { id: 701, title: "Armug'on (She'riy to'plam)", year: 1921, pdfUrl: "/books/armugon.pdf", sortOrder: 1 },
            { id: 702, title: "Yozig'lar (O'qish darsligi)", year: 1923, pdfUrl: "/books/yoziglar.pdf", sortOrder: 2 }
        ]
    }
];

export function getLocalizedJadids(locale: string = 'uz'): HistoricalFigure[] {
    return MOCK_JADIDS.map(j => {
        const name = locale === 'ru' ? j.nameRu || j.nameUz : locale === 'en' ? j.nameEn || j.nameUz : j.nameUz;
        const title = locale === 'ru' ? j.titleRu || j.titleUz : locale === 'en' ? j.titleEn || j.titleUz : j.titleUz;
        const bio = locale === 'ru' ? j.bioRu || j.bioUz : locale === 'en' ? j.bioEn || j.bioUz : j.bioUz;
        return {
            ...j,
            name,
            title,
            bio
        };
    });
}
