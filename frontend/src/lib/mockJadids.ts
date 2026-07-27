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
        imageUrl: "/jadidlar/avloniy.jpg",
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
            { title: "Abdulla Avloniy shaxsiy surati (1920)", url: "/jadidlar/avloniy.jpg" },
            { title: "Turkiy Guliston kitobining birinchi nusxasi (1913)", url: "/gallery/avloniy_3.jpg" }
        ],
        figureWorks: [
            { id: 101, title: "Turkiy Guliston yoxud axloq", year: 1913, pdfUrl: "/books/turkiy_guliston.pdf", sortOrder: 1 },
            { id: 102, title: "Muallimi soniy (Ikkinchi muallim)", year: 1917, pdfUrl: "/books/muallimi_soniy.pdf", sortOrder: 2 },
            { id: 103, title: "Adabiyot yoxud milliy she'rlar", year: 1909, pdfUrl: "/books/adabiyot.pdf", sortOrder: 3 }
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
        imageUrl: "/jadidlar/behbudiy.jpg",
        works: "Padarkush, Oyna jurnali to'plami, Muntaxabi jugrofiyayi umumiy",
        pdfUrl: "/books/padarkush.pdf",
        featured: true,
        sortOrder: 2,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Samarqand",
        category: "Matbuot & Teatr",
        quote: "Haq olinadur, berilmaydur! Dunyoda turmoq uchun dunyoviy fan va ilm lozimdir.",
        timeline: [
            { year: "1875", title: "Tavallud", desc: "Samarqand yaqinidagi Baxshitepa qishlog'ida tug'ilgan." },
            { year: "1903", title: "Maktablar harakati", desc: "Samarqandda yangi usul maktablarini tashkil qildi." },
            { year: "1911", title: "'Padarkush' dramasi", desc: "Birinchi o'zbek professional dramasi 'Padarkush'ni yozgan." },
            { year: "1913", title: "'Oyna' jurnali", desc: "'Oyna' jurnali va 'Samarqand' gazetasiga asos solgan." },
            { year: "1919", title: "Fojiali o'lim", desc: "Qarshi shahrida ma'rifat yo'lidagi kurashda halok bo'lgan." }
        ],
        galleryPhotos: [
            { title: "Mahmudxo'ja Behbudiy portreti (1915)", url: "/jadidlar/behbudiy.jpg" }
        ],
        figureWorks: [
            { id: 201, title: "Padarkush yoxud o'qimagan bolaning holi", year: 1911, pdfUrl: "/books/padarkush.pdf", sortOrder: 1 },
            { id: 202, title: "Oyna jurnali maqolalar to'plami", year: 1913, pdfUrl: "/books/oyna.pdf", sortOrder: 2 }
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
        imageUrl: "/jadidlar/munavvarqori.png",
        works: "Adibi soniy, Sabzavor, Tajvidul Qur'on",
        pdfUrl: "/books/adibi_soniy.pdf",
        featured: true,
        sortOrder: 3,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Toshkent",
        category: "Ta'lim & Jamiyat",
        quote: "Bizni jaholat va nodonlik qorong'uligidan faqat ilm, ma'rifat va maktab qutqara oladi.",
        timeline: [
            { year: "1878", title: "Tavallud", desc: "Toshkentning Shayxontohur dahasida tavallud topgan." },
            { year: "1901", title: "Birinchi maktab", desc: "Toshkentda o'z hovlisida birinchi jadid maktabini ochgan." },
            { year: "1906", title: "'Xurshid' gazetasi", desc: "'Xurshid' gazetasini chop eta boshlagan." },
            { year: "1931", title: "Qatag'on", desc: "Moskvada qatag'on qurboni bo'lgan." }
        ],
        galleryPhotos: [
            { title: "Munavvarqori Abdurrashidxonov surati (1917)", url: "/jadidlar/munavvarqori.png" }
        ],
        figureWorks: [
            { id: 301, title: "Adibi soniy", year: 1907, pdfUrl: "/books/adibi_soniy.pdf", sortOrder: 1 }
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
        imageUrl: "/jadidlar/cholpon.jpg",
        works: "Kecha va kunduz, Buloqlar, Uyg'onish, Yorqinoy",
        pdfUrl: "/books/kecha_va_kunduz.pdf",
        featured: true,
        sortOrder: 4,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Farg'ona",
        category: "Adabiyot & She'riyat",
        quote: "Go'zal Turkiston, senga ne bo'ldi? Yonar bag'ringizda alanga qayda?",
        timeline: [
            { year: "1897", title: "Tavallud", desc: "Andijon shahrida ziyoli oilada tug'ilgan." },
            { year: "1922", title: "'Uyg'onish' to'plami", desc: "Mashhur 'Uyg'onish' she'riy to'plami bosilib chiqqan." },
            { year: "1936", title: "'Kecha va kunduz'", desc: "O'zbek adabiyoti shoh romani 'Kecha va kunduz' nashr etilgan." },
            { year: "1938", title: "Qatag'on", desc: "Toshkentda fojiali tarzda qatag'on qilingan." }
        ],
        galleryPhotos: [
            { title: "Abdulhamid Cho'lpon surati (1930)", url: "/jadidlar/cholpon.jpg" }
        ],
        figureWorks: [
            { id: 401, title: "Kecha va kunduz (Roman)", year: 1936, pdfUrl: "/books/kecha_va_kunduz.pdf", sortOrder: 1 }
        ]
    },
    {
        id: 5,
        nameUz: "Abdurauf Fitrat",
        nameRu: "Абдурауф Фитрат",
        nameEn: "Abdurauf Fitrat",
        titleUz: "Olim, dramaturg, davlat va jamoat arbobi, akademik",
        titleRu: "Учённый, драматург, государственный деятель, академик",
        titleEn: "Scholar, playwright, statesman, academician",
        bioUz: "Abdurauf Fitrat (1886–1938) — Buxoro jadidchilik harakatining yo'lboshchisi, o'zbek filologiyasi va adabiyotshunosligiga asos solgan buyuk aloma. Turkiy tillar, adabiyot tarixi va musiqa bo'yicha fundamental ilmiy asarlar muallifi.",
        bioRu: "Абдурауф Фитрат (1886–1938) — лидер движения джадидов Бухары, основоположник узбекской филологии. Автор фундаментальных трудов по языкознанию, литературе и музыке.",
        bioEn: "Abdurauf Fitrat (1886–1938) — leader of Bukhara Jadidism, founder of Uzbek linguistics and literary studies. Author of fundamental research works.",
        name: "Abdurauf Fitrat",
        title: "Olim, dramaturg, davlat va jamoat arbobi, akademik",
        bio: "Abdurauf Fitrat — Buxoro jadidchilik harakatining yo'lboshchisi, o'zbek filologiyasi va adabiyotshunosligiga asos solgan buyuk aloma. Turkiy tillar, adabiyot tarixi va musiqa bo'yicha fundamental ilmiy asarlar muallifi.",
        years: "1886–1938",
        imageUrl: "/jadidlar/fitrat.jpg",
        works: "Munozara, Hind sayyohi bayonoti, O'zbek tili qoidalari, Abulfayzxon",
        pdfUrl: "/books/munozara.pdf",
        featured: true,
        sortOrder: 5,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Buxoro",
        category: "Adabiyot & Fan",
        quote: "Haqiqat egiladi, bukiladi, ammo sinmaydi! Millat ma'rifat bilan yashaydi.",
        timeline: [
            { year: "1886", title: "Tavallud", desc: "Buxoro shahrida tavallud topgan." },
            { year: "1911", title: "'Munozara' e'loni", desc: "Mashhur 'Munozara' asarini e'lon qilgan." },
            { year: "1938", title: "Qatag'on", desc: "Toshkentda qatag'on qilingan." }
        ],
        galleryPhotos: [
            { title: "Abdurauf Fitrat surati (1925)", url: "/jadidlar/fitrat.jpg" }
        ],
        figureWorks: [
            { id: 501, title: "Munozara", year: 1911, pdfUrl: "/books/munozara.pdf", sortOrder: 1 }
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
        imageUrl: "/jadidlar/ibrat.jpg",
        works: "Lug'ati sitta-alsina, Jame' ul-xutut, Tarixi Farg'ona",
        pdfUrl: "/books/lugati_sitta.pdf",
        featured: true,
        sortOrder: 6,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Farg'ona",
        category: "Ta'lim & Matbaa",
        quote: "Har bir millat o'z tilida sadosini topmog'i va dunyo ilmlarini egallamog'i lozim.",
        timeline: [
            { year: "1862", title: "Tavallud", desc: "To'raqo'rg'on tumanida tavallud topgan." },
            { year: "1908", title: "Bosmaxona", desc: "To'raqo'rg'onda birinchi bosmaxonasini ishga tushirgan." },
            { year: "1937", title: "Qatag'on", desc: "Andijon qamoqxonasida vafot etgan." }
        ],
        galleryPhotos: [
            { title: "Ishoqxon Ibrat shaxsiy surati (1925)", url: "/jadidlar/ibrat.jpg" }
        ],
        figureWorks: [
            { id: 601, title: "Lug'ati sitta-alsina (Olti tilli lug'at)", year: 1901, pdfUrl: "/books/lugati_sitta.pdf", sortOrder: 1 }
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
        imageUrl: "/jadidlar/elbek.png",
        works: "Armug'on, Yozig'lar, Chirchiq bo'ylarida",
        pdfUrl: "/books/armugon.pdf",
        featured: false,
        sortOrder: 7,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Toshkent",
        category: "Adabiyot & Tilshunoslik",
        quote: "O'zbek tili — boy va jozibador til. Uni asramoq ham farz, ham qarzdir.",
        timeline: [
            { year: "1898", title: "Tavallud", desc: "Bo'stonliq tumanida tug'ilgan." },
            { year: "1939", title: "Abadiyat", desc: "Qatag'on yillarida vafot etgan." }
        ],
        galleryPhotos: [
            { title: "Elbek surati (1928)", url: "/jadidlar/elbek.png" }
        ],
        figureWorks: [
            { id: 701, title: "Armug'on (She'riy to'plam)", year: 1921, pdfUrl: "/books/armugon.pdf", sortOrder: 1 }
        ]
    },
    {
        id: 8,
        nameUz: "Fayzulla Xo'jayev",
        nameRu: "Файзулла Ходжаев",
        nameEn: "Fayzulla Khodjayev",
        titleUz: "Buxoro jadidlari yetakchisi, davlat va jamoat arbobi",
        titleRu: "Лидер бухарских джадидов, государственный деятель",
        titleEn: "Leader of Bukhara Jadids, statesman",
        bioUz: "Fayzulla Xo'jayev (1896–1938) — Buxorodagi 'Yo'sh buxorolilar' jadidchilik harakatining rahnamosi va davlat arbobi. U milliy maorif va iqtisodiy islohotlarga ulkan hissa qo'shgan.",
        bioRu: "Файзулла Ходжаев (1896–1938) — лидер движения «Младобухарцы», государственный и политический деятель.",
        bioEn: "Fayzulla Khodjayev (1896–1938) — leader of the Young Bukharans movement and prominent statesman.",
        name: "Fayzulla Xo'jayev",
        title: "Buxoro jadidlari yetakchisi, davlat va jamoat arbobi",
        bio: "Fayzulla Xo'jayev — Buxorodagi 'Yo'sh buxorolilar' jadidchilik harakatining rahnamosi va davlat arbobi. U milliy maorif va iqtisodiy islohotlarga ulkan hissa qo'shgan.",
        years: "1896–1938",
        imageUrl: "/jadidlar/fayzulla.jpg",
        works: "Buxoro inqilobining tarixi, Tanlangan asarlar",
        pdfUrl: "/books/buxoro_tarixi.pdf",
        featured: false,
        sortOrder: 8,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Buxoro",
        category: "Davlat & Jamiyat",
        quote: "Buxoro va Turkiston xalqi ozod, ma'rifatli va mustaqil yashashga munosibdir.",
        timeline: [
            { year: "1896", title: "Tavallud", desc: "Buxoroning Goziyon mahallasida yirik tajir oilasida tug'ilgan." },
            { year: "1917", title: "Yosh buxorolilar", desc: "'Yosh buxorolilar' partiyasi MK raisi etib saylangan." },
            { year: "1938", title: "Qatag'on", desc: "Moskvada qatag'on etilgan." }
        ],
        galleryPhotos: [
            { title: "Fayzulla Xo'jayev surati (1925)", url: "/jadidlar/fayzulla.jpg" }
        ],
        figureWorks: [
            { id: 801, title: "Buxoro inqilobining tarixi manbalari", year: 1926, pdfUrl: "/books/buxoro_tarixi.pdf", sortOrder: 1 }
        ]
    },
    {
        id: 9,
        nameUz: "Siddiqiy Ajziy",
        nameRu: "Сиддикий Аджзи",
        nameEn: "Siddiqiy Ajziy",
        titleUz: "Shoir, ma'rifatparvar, tarjimon va pedagog",
        titleRu: "Поэт, просветитель, переводчик и педагог",
        titleEn: "Poet, enlightener, translator and educator",
        bioUz: "Siddiqiy Ajziy (1864–1927) — Samarqand jadidchilik harakatining yirik namoyandalaridan biri. U jadid maktablari uchun darsliklar yaratgan, she'riy to'plamlar va ma'rifiy asarlar nashr etgan.",
        bioRu: "Сиддикий Аджзи (1864–1927) — один из крупнейших представителей Самаркандского джадидизма.",
        bioEn: "Siddiqiy Ajziy (1864–1927) — prominent representative of Samarqand Jadidism.",
        name: "Siddiqiy Ajziy",
        title: "Shoir, ma'rifatparvar, tarjimon va pedagog",
        bio: "Siddiqiy Ajziy — Samarqand jadidchilik harakatining yirik namoyandalaridan biri. U jadid maktablari uchun darsliklar yaratgan, she'riy to'plamlar va ma'rifiy asarlar nashr etgan.",
        years: "1864–1927",
        imageUrl: "/jadidlar/ajziy.jpg",
        works: "Mir'oti ibrat, Ganjinayi hikmat, Anjumani arva",
        pdfUrl: "/books/miroti_ibrat.pdf",
        featured: false,
        sortOrder: 9,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Samarqand",
        category: "Adabiyot & Ta'lim",
        quote: "Nodonlik va g'aflatdan qutulmoqning yakka chorasi — maktab va ma'rifatdir.",
        timeline: [
            { year: "1864", title: "Tavallud", desc: "Samarqand yaqinidagi Halvoyi qishlog'ida tug'ilgan." },
            { year: "1903", title: "Jadid maktabi", desc: "Halvoyi qishlog'ida yangi usul jadid maktabini ochgan." },
            { year: "1927", title: "Abadiyat", desc: "Samarqandda vafot etgan." }
        ],
        galleryPhotos: [
            { title: "Siddiqiy Ajziy portreti (1920)", url: "/jadidlar/ajziy.jpg" }
        ],
        figureWorks: [
            { id: 901, title: "Mir'oti ibrat", year: 1914, pdfUrl: "/books/miroti_ibrat.pdf", sortOrder: 1 }
        ]
    },
    {
        id: 10,
        nameUz: "Hamza Hakimzoda Niyoziy",
        nameRu: "Хамза Хакимзаде Ниязи",
        nameEn: "Hamza Hakimzoda Niyoziy",
        titleUz: "Shoir, dramaturg, kompozitor, ma'rifatparvar",
        titleRu: "Поэт, драматург, композитор, просветитель",
        titleEn: "Poet, playwright, composer, enlightener",
        bioUz: "Hamza Hakimzoda Niyoziy (1889–1929) — Farg'ona vodiysidagi ma'rifatparvarlik harakati arbobi. Qo'qon va Marg'ilonda jadid maktablari va teatr truppalarini tashkil etgan.",
        bioRu: "Хамза Хакимзаде Ниязи (1889–1929) — узбекский поэт, драматург, композитор, просветитель.",
        bioEn: "Hamza Hakimzoda Niyoziy (1889–1929) — Uzbek poet, playwright, composer and educator.",
        name: "Hamza Hakimzoda Niyoziy",
        title: "Shoir, dramaturg, kompozitor, ma'rifatparvar",
        bio: "Hamza Hakimzoda Niyoziy — Farg'ona vodiysidagi ma'rifatparvarlik harakati arbobi. Qo'qon va Marg'ilonda jadid maktablari va teatr truppalarini tashkil etgan.",
        years: "1889–1929",
        imageUrl: "/jadidlar/niyoziy.jpg",
        works: "Maysaraning ishi, Boy ila xizmatchi, Yengil adabiyot",
        pdfUrl: "/books/maysara.pdf",
        featured: false,
        sortOrder: 10,
        createdAt: "2026-01-01T00:00:00Z",
        region: "Farg'ona",
        category: "Teatr & Musiqa",
        quote: "O'qu, o'rgan, bilim ol, millat uchun xizmat qil!",
        timeline: [
            { year: "1889", title: "Tavallud", desc: "Qo'qon shahrida tabib oilasida tug'ilgan." },
            { year: "1911", title: "Jadid maktabi", desc: "Qo'qon va Marg'ilonda bepul maktablar ochgan." },
            { year: "1929", title: "Fojiali o'lim", desc: "Shohimardonda halok bo'lgan." }
        ],
        galleryPhotos: [
            { title: "Hamza Hakimzoda Niyoziy surati (1924)", url: "/jadidlar/niyoziy.jpg" }
        ],
        figureWorks: [
            { id: 1001, title: "Maysaraning ishi (Komediya)", year: 1926, pdfUrl: "/books/maysara.pdf", sortOrder: 1 }
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
