'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'

const Icons = {
    Pen: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
    ),
    PenLg: () => (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
    ),
    Scroll: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
    ),
    Edit: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
    ),
    Theater: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10s3-3 3-8h14s0 5 3 8"/><path d="M6 10a10 10 0 0 0 12 0"/><path d="M8 19a4 4 0 0 0 8 0"/><line x1="12" y1="10" x2="12" y2="19"/>
        </svg>
    ),
    FileText: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
    ),
    Book: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    BookOpen: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
    ),
    X: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
}

const JADID_ICONS: Record<string, React.FC> = {
    avloniy: Icons.PenLg,
    behbudiy: Icons.Scroll,
    fitrat: Icons.Edit,
    hamza: Icons.Theater,
    cholpon: Icons.FileText,
    qodiriy: Icons.Book,
}

interface Jadid {
    id: string
    nameUz: string; nameRu: string; nameEn: string
    years: string
    titleUz: string; titleRu: string; titleEn: string
    bioUz: string; bioRu: string; bioEn: string
    works: string[]
    color: string
    featured?: boolean
}

const JADIDLAR: Jadid[] = [
    {
        id: 'avloniy', nameUz: 'Abdulla Avloniy', nameRu: 'Абдулла Авлоний', nameEn: 'Abdulla Avloniy',
        years: '1878–1934',
        titleUz: "Shoir, dramaturg, pedagog va ma'rifatparvar", titleRu: 'Поэт, драматург, педагог и просветитель', titleEn: 'Poet, playwright, pedagogue and enlightener',
        bioUz: "Abdulla Avloniy Toshkentda tug'ilib, o'zbek ma'rifatchilik harakatining yetakchi namoyandalaridan biriga aylandi. U Toshkentda yangi usul maktablari ochdi, o'quv qo'llanmalar yozdi. \"Turkiy Guliston yoxud axloq\" asari milliy pedagogika tarixidagi muhim manbadir. \"Shuhrat\" va \"Osiyo\" gazetalarini tahrirladi. Dramaturgiyada ham kuchli iz qoldirdi.",
        bioRu: 'Абдулла Авлоний родился в Ташкенте и стал одним из ведущих представителей узбекского просветительского движения. Он открывал в Ташкенте школы нового метода, писал учебные пособия. «Туркий Гулистон ёхуд ахлоқ» — важный источник в истории национальной педагогики. Редактировал газеты «Шухрат» и «Осиё».',
        bioEn: 'Abdulla Avloniy was born in Tashkent and became one of the leading figures of the Uzbek enlightenment movement. He opened new-method schools in Tashkent and wrote educational manuals. "Turkiy Guliston yokhud Akhlok" is an important source in the history of national pedagogy.',
        works: ['Turkiy Guliston yoxud axloq (1913)', 'Adib (1907)', 'Baxtsiz kuyov (pyesa)', 'Shuhrat gazetasi'],
        color: '#1B3A6B', featured: true,
    },
    {
        id: 'behbudiy', nameUz: "Mahmudxo'ja Behbudiy", nameRu: 'Махмудходжа Бехбудий', nameEn: 'Mahmudkhoja Behbudiy',
        years: '1875–1919',
        titleUz: "Yozuvchi, dramaturg va jadidchilik harakatining asoschisi", titleRu: 'Писатель, драматург и основатель движения джадидизма', titleEn: 'Writer, playwright and founder of the Jadidism movement',
        bioUz: "Mahmudxo'ja Behbudiy Samarqandda tug'ilib, o'zbek jadidchiligi harakatining eng yirik vakillaridan biri bo'ldi. Birinchi o'zbek dramasi — \"Padarkush\" asarining muallifi. Samarqandda \"Oyina\" jurnalini va \"Samarqand\" gazetasini nashr qildi. 1919-yilda Buxoro amiri buyrug'i bilan qatl etildi.",
        bioRu: 'Махмудходжа Бехбудий родился в Самарканде. Автор первой узбекской драмы — «Падаркуш». Издавал журнал «Ойина» и газету «Самарканд». В 1919 году был казнён по приказу бухарского эмира.',
        bioEn: 'Mahmudkhoja Behbudiy was born in Samarkand. Author of the first Uzbek drama "Padarkush". He published the journal "Oyina" and newspaper "Samarkand". In 1919 he was executed on the orders of the Bukhara emir.',
        works: ['Padarkush (1911)', 'Oyina jurnali', 'Samarqand gazetasi', 'Muxtasar tarixi islom'],
        color: '#2d4a1a',
    },
    {
        id: 'fitrat', nameUz: 'Abdurauf Fitrat', nameRu: 'Абдурауф Фитрат', nameEn: 'Abdurauf Fitrat',
        years: '1886–1938',
        titleUz: "Yozuvchi, dramaturg, olim va siyosatchi", titleRu: 'Писатель, драматург, учёный и политик', titleEn: 'Writer, playwright, scholar and politician',
        bioUz: "Abdurauf Fitrat Buxoroda tug'ildi. Istanbulda ta'lim olib, pan-turkizm va jadidchilik g'oyalarini o'rganib qaytdi. Buxoro Xalq Respublikasida tashqi ishlar vaziri bo'ldi. 1938-yilda Stalin repressiyasida otib tashlandi.",
        bioRu: 'Абдурауф Фитрат родился в Бухаре. Получил образование в Стамбуле. Стал министром иностранных дел Бухарской Народной Республики. В 1938 году расстрелян в ходе сталинских репрессий.',
        bioEn: "Abdurauf Fitrat was born in Bukhara. He studied in Istanbul. He became Minister of Foreign Affairs of the Bukhara People's Republic. In 1938 he was shot during Stalin's repressions.",
        works: ['Hind sayyohi (1912)', 'Qiyomat (1923)', 'Bedil', 'Abu Muslim (drama)'],
        color: '#2d1a3a',
    },
    {
        id: 'hamza', nameUz: 'Hamza Hakimzoda Niyoziy', nameRu: 'Хамза Хакимзаде Ниязи', nameEn: 'Hamza Hakimzoda Niyozi',
        years: '1889–1929',
        titleUz: "Shoir, dramaturg, kompozitor va ma'rifatparvar", titleRu: 'Поэт, драматург, композитор и просветитель', titleEn: 'Poet, playwright, composer and enlightener',
        bioUz: "Hamza Hakimzoda Niyoziy Qo'qonda tug'ildi. O'zbek sovet adabiyotining asoschisi. Yangi usul maktablari ochdi, ayollar ozodligi uchun kurashdi. 1929-yilda diniy fanatiklar tomonidan toshbo'ron qilib o'ldirildi.",
        bioRu: 'Хамза Хакимзаде Ниязи родился в Коканде. Основатель узбекской советской литературы. В 1929 году был забит камнями религиозными фанатиками.',
        bioEn: 'Hamza Hakimzoda Niyozi was born in Kokand. Founder of Uzbek Soviet literature. In 1929 he was stoned to death by religious fanatics.',
        works: ["Yer yuzida yangi kun", "Zaharli hayot yoxud ishq qurbonlari", "Maysaraning ishi", "Ko'p qo'ychi"],
        color: '#1a2d00',
    },
    {
        id: 'cholpon', nameUz: 'Abdulhamid Sulaymon Cholpon', nameRu: 'Абдулхамид Сулайман Чулпан', nameEn: 'Abdulhamid Sulaymon Cholpon',
        years: '1897–1938',
        titleUz: "Shoir, yozuvchi va tarjimon", titleRu: 'Поэт, писатель и переводчик', titleEn: 'Poet, writer and translator',
        bioUz: "Cholpon (taxallus) Andijondan. \"Kecha va kunduz\" romani o'zbek adabiyotining durdonasi. Hamletni o'zbek tiliga tarjima qildi. 1938-yilda Stalin repressiyasida otib tashlandi.",
        bioRu: "Чулпан из Андижана. Роман «Ночь и день» — жемчужина узбекской литературы. Переводил Гамлета на узбекский язык. В 1938 году расстрелян.",
        bioEn: "Cholpon from Andijan. The novel \"Night and Day\" is a pearl of Uzbek literature. He translated Hamlet into Uzbek. In 1938 he was shot.",
        works: ["Kecha va kunduz (roman)", "Bahor (she'rlar to'plami)", "Hamlet (tarjima)", "Yorqinoy (drama)"],
        color: '#1a1a2d',
    },
    {
        id: 'qodiriy', nameUz: "Abdulla Qodiriy (Julqunboy)", nameRu: 'Абдулла Кадыри (Джулкунбой)', nameEn: 'Abdulla Qodiriy (Julqunboy)',
        years: '1894–1938',
        titleUz: "Yozuvchi, romancier va jurnalist", titleRu: 'Писатель, романист и журналист', titleEn: 'Writer, novelist and journalist',
        bioUz: "Abdulla Qodiriy o'zbek klassik romanining asoschisi. \"O'tgan kunlar\" (1926) — birinchi o'zbek romani. \"Mushtum\" satirik jurnalini boshqardi. 1938-yilda qatl etildi.",
        bioRu: "Абдулла Кадыри — основатель узбекского классического романа. «Прошедшие дни» (1926) — первый узбекский роман. Расстрелян в 1938 году.",
        bioEn: "Abdulla Qodiriy is the founder of the Uzbek classical novel. \"Past Days\" (1926) is the first Uzbek novel. He was executed in 1938.",
        works: ["O'tgan kunlar (1926)", "Mehrobdan chayon (1929)", "Obid ketmon", "Mushtum jurnali"],
        color: '#2d1a00',
    },
]

export default function JadidlarPage() {
    const locale = useLocale()
    const [selected, setSelected] = useState<Jadid | null>(null)

    const getName = (j: Jadid) => locale === 'ru' ? j.nameRu : locale === 'en' ? j.nameEn : j.nameUz
    const getTitle = (j: Jadid) => locale === 'ru' ? j.titleRu : locale === 'en' ? j.titleEn : j.titleUz
    const getBio = (j: Jadid) => locale === 'ru' ? j.bioRu : locale === 'en' ? j.bioEn : j.bioUz

    const t = {
        label: locale === 'ru' ? 'Просветители' : locale === 'en' ? 'Enlighteners' : "Ma'rifatparvarlar",
        h1a: locale === 'ru' ? "Узбекские " : locale === 'en' ? 'Uzbek ' : "O'zbek ",
        h1b: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlari',
        desc: locale === 'ru' ? 'Выдающиеся узбекские просветители XIX–XX веков.'
            : locale === 'en' ? 'Outstanding Uzbek enlighteners of the 19th–20th centuries.'
                : "XIX–XX asr buyuk o'zbek jadidlari.",
        works: locale === 'ru' ? 'Основные произведения' : locale === 'en' ? 'Key works' : "Asosiy asarlar",
        readMore: locale === 'ru' ? 'Подробнее' : locale === 'en' ? 'More details' : 'Batafsil',
        close: locale === 'ru' ? 'Закрыть' : locale === 'en' ? 'Close' : 'Yopish',
        jadidismTitle: locale === 'ru' ? 'Что такое джадидизм?' : locale === 'en' ? 'What is Jadidism?' : 'Jadidchilik nima?',
        jadidismText: locale === 'ru'
            ? 'Джадидизм (от арабского «усули джадид» — новый метод) — реформаторское движение в мусульманском мире конца XIX — начала XX вв. В Средней Азии джадиды выступали за модернизацию системы образования, развитие национальной культуры и языка, равноправие женщин, демократические реформы.'
            : locale === 'en'
                ? "Jadidism (from Arabic 'usul al-jadid' — new method) was a reformist movement in the Muslim world. In Central Asia, Jadids advocated for modernization of education, development of national culture, women's equality, and democratic reforms."
                : "Jadidchilik (arabcha \"usuli jadid\" — yangi usul) — XIX asr oxiri – XX asr boshlarida musulmon dunyosida islohot harakati. Jadidlar ta'lim tizimini modernizatsiya qilish, milliy madaniyat va tilni rivojlantirish, ayollar huquqi uchun kurashdi.",
        centralFigure: locale === 'ru' ? 'Центральная фигура' : locale === 'en' ? 'Central figure' : 'Markaziy shaxs',
        museumNamed: locale === 'ru' ? 'Музей назван в его честь' : locale === 'en' ? 'Museum named after him' : 'Muzey uning nomida',
        colleagues: locale === 'ru' ? "Соратники Авлония" : locale === 'en' ? "Avloniy's Colleagues" : "Avloniy safdoshlari",
        others: locale === 'ru' ? 'Другие представители' : locale === 'en' ? 'Other representatives' : 'Boshqa namoyandalar',
        timeline: locale === 'ru' ? 'Хронология' : locale === 'en' ? 'Timeline' : 'Xronologiya',
        era: locale === 'ru' ? 'Эпоха Джадидизма' : locale === 'en' ? 'The Jadidism Era' : 'Jadidchilik davri',
    }

    const avloniy = JADIDLAR[0]
    const AvloniyIcon = JADID_ICONS['avloniy']

    return (
        <>
            <div className="page-header" style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #2d1a00 50%, #3d2a00 100%)' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label" style={{ background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.3)' }}>
                        <Icons.Pen /> {t.label}
                    </div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            {/* Jadidchilik nima */}
            <section style={{ background: '#0d1f3c', padding: '56px 0' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderLeft: '4px solid #C9A84C', borderRadius: '2px', padding: 'clamp(20px, 3vw, 32px) clamp(20px, 3vw, 36px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '4px', marginBottom: '12px', textTransform: 'uppercase' }}>
                            <Icons.BookOpen /> {t.jadidismTitle}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: '1.95' }}>{t.jadidismText}</p>
                    </div>
                </div>
            </section>

            {/* Avloniy featured */}
            <section style={{ background: 'var(--off-white)', padding: '72px 0' }}>
                <div className="container">
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px' }}>
                        <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                        {t.centralFigure}
                    </div>
                    <div className="grid-featured" style={{ background: '#fff', border: '1px solid rgba(27,58,107,0.08)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(27,58,107,0.1)' }}>
                        <div style={{ background: `linear-gradient(160deg, ${avloniy.color}, #254d8f)`, minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px' }}>
                            <div style={{ color: 'rgba(255,255,255,0.4)' }}><AvloniyIcon /></div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>{getName(avloniy)}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#C9A84C', letterSpacing: '2px' }}>{avloniy.years}</div>
                            <div style={{ background: '#C9A84C', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '2px' }}>
                                {t.museumNamed}
                            </div>
                        </div>
                        <div style={{ padding: 'clamp(24px, 3vw, 40px)' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>{getTitle(avloniy)}</div>
                            <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', marginBottom: '20px', color: 'var(--navy-dark)' }}>{getName(avloniy)}</h2>
                            <div style={{ width: '40px', height: '2px', background: 'var(--gold)', marginBottom: '20px' }} />
                            <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '24px' }}>{getBio(avloniy)}</p>
                            <div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>{t.works}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {avloniy.works.map((w, i) => (
                                        <span key={i} style={{ background: 'rgba(27,58,107,0.06)', border: '1px solid rgba(27,58,107,0.12)', borderRadius: '2px', padding: '5px 12px', fontSize: '13px', color: 'var(--navy-dark)', fontFamily: 'var(--font-mono)' }}>{w}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Boshqa jadidlar */}
            <section style={{ background: '#060f1e', padding: '72px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>
                            <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                            {t.others}
                            <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: 'clamp(26px, 3vw, 36px)' }}>{t.colleagues}</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {JADIDLAR.slice(1).map(jadid => {
                            const JadidIcon = JADID_ICONS[jadid.id]
                            return (
                                <div key={jadid.id} onClick={() => setSelected(jadid)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: 'clamp(20px, 3vw, 32px)', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden' }}
                                     onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                                     onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
                                >
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ width: '52px', height: '52px', flexShrink: 0, background: `linear-gradient(135deg, ${jadid.color}, rgba(201,168,76,0.2))`, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)' }}>
                                            <JadidIcon />
                                        </div>
                                        <div>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', marginBottom: '4px' }}>{getName(jadid)}</h3>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C' }}>{jadid.years}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{getTitle(jadid)}</div>
                                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', marginBottom: '16px' }}>{getBio(jadid).substring(0, 150)}...</p>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C', letterSpacing: '2px' }}>{t.readMore} →</div>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: '#C9A84C', opacity: 0.4 }} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section style={{ background: 'var(--off-white)', padding: '72px 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>
                            <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                            {t.timeline}
                        </div>
                        <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}><span style={{ color: 'var(--gold)' }}>{t.era}</span></h2>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div className="timeline-line" style={{ position: 'absolute', left: '87px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--gold), rgba(201,168,76,0.1))' }} />
                        {[
                            { year: '1880s', textUz: "Yangi usul maktablari O'rta Osiyoda paydo bo'la boshladi", textRu: 'Школы нового метода начали появляться в Средней Азии', textEn: 'New method schools began appearing in Central Asia' },
                            { year: '1904', textUz: "Behbudiy Samarqandda birinchi yangi usul maktabini ochdi", textRu: 'Бехбудий открыл первую школу нового метода в Самарканде', textEn: 'Behbudiy opened the first new-method school in Samarkand' },
                            { year: '1911', textUz: "\"Padarkush\" — birinchi o'zbek dramasi sahnalashtirildi", textRu: '«Падаркуш» — поставлена первая узбекская драма', textEn: '"Padarkush" — the first Uzbek drama was staged' },
                            { year: '1913', textUz: "Avloniyning \"Turkiy Guliston\" asari nashr etildi", textRu: 'Опубликован «Туркий Гулистон» Авлония', textEn: "Avloniy's \"Turkiy Guliston\" was published" },
                            { year: '1920s', textUz: "Ko'plab jadidlar sovet hukumati bilan hamkorlik qildi", textRu: 'Многие джадиды сотрудничали с советской властью', textEn: 'Many Jadids cooperated with the Soviet government' },
                            { year: '1937–38', textUz: "Stalin repressiyasida ko'plab jadidlar qatl etildi", textRu: 'В ходе сталинских репрессий многие джадиды были расстреляны', textEn: "Many Jadids were executed during Stalin's repressions" },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 'clamp(16px, 2vw, 32px)', marginBottom: '32px', alignItems: 'flex-start' }}>
                                <div className="timeline-year" style={{ minWidth: '72px', fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: '700', color: 'var(--gold)', textAlign: 'right', paddingTop: '14px' }}>{item.year}</div>
                                <div className="timeline-dot" style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, marginTop: '16px', border: '3px solid var(--off-white)', zIndex: 1 }} />
                                <div className="timeline-card" style={{ flex: 1, background: '#fff', borderRadius: '2px', padding: '18px 22px', border: '1px solid rgba(27,58,107,0.07)', boxShadow: '0 2px 12px rgba(27,58,107,0.06)' }}>
                                    <p style={{ fontSize: '15px', color: 'var(--navy-dark)', lineHeight: '1.7' }}>
                                        {locale === 'ru' ? item.textRu : locale === 'en' ? item.textEn : item.textUz}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selected && (
                <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(8px)' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '4px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
                        {(() => { const SelIcon = JADID_ICONS[selected.id]; return (
                            <div style={{ background: `linear-gradient(135deg, ${selected.color}, #254d8f)`, padding: 'clamp(24px, 3vw, 40px)', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}><SelIcon /></div>
                                <div style={{ minWidth: '200px' }}>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '2px', marginBottom: '8px' }}>{getTitle(selected)}</div>
                                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 26px)', color: '#fff', marginBottom: '8px' }}>{getName(selected)}</h2>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{selected.years}</div>
                                </div>
                            </div>
                        )})()}
                        <div style={{ padding: 'clamp(24px, 3vw, 36px) clamp(24px, 3vw, 40px)' }}>
                            <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '32px' }}>{getBio(selected)}</p>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>{t.works}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                                {selected.works.map((w, i) => (
                                    <span key={i} style={{ background: 'rgba(27,58,107,0.06)', border: '1px solid rgba(27,58,107,0.12)', borderRadius: '2px', padding: '6px 14px', fontSize: '13px', color: 'var(--navy-dark)', fontFamily: 'var(--font-mono)' }}>{w}</span>
                                ))}
                            </div>
                            <button onClick={() => setSelected(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--navy-dark)', color: '#fff', border: 'none', borderRadius: '2px', fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                                {t.close} <Icons.X />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
