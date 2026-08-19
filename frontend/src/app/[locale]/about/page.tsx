'use client'
import Image from 'next/image'
import { useLocale } from 'next-intl'

const Icons = {
    Movement: () => (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    Book: () => (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    Star: () => (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    ),
    Torch: () => (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
    ),
    Clock: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
    ),
    MapPin: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
    ),
    Globe: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
    ),
    Pen: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
    ),
}

export default function AboutPage() {
    const locale = useLocale()

    const timeline = locale === 'ru' ? [
        { year: '1880', title: "Зарождение идей", desc: "В Центральной Азии начали распространяться идеи исламского реформизма и просвещения, пришедшие из Крыма и Османской империи." },
        { year: '1893', title: "Новометодные школы", desc: "Исмаил Гаспринский разработал новый метод обучения — «усул-и-джадид». Первые такие школы появились в Туркестане." },
        { year: '1900', title: "Расцвет движения", desc: "Джадидские школы распространились по всему Туркестану, Бухаре и Хиве. Издавались газеты, журналы, ставились театральные пьесы." },
        { year: '1905', title: "Политизация", desc: "После русской революции 1905 года джадиды перешли от культурного просветительства к политическим требованиям реформ." },
        { year: '1917', title: "Автономия", desc: "Джадиды создали Туркестанскую автономию в Коканде — первое демократическое государство в Центральной Азии." },
        { year: '1920e', title: "Наследие", desc: "Несмотря на репрессии советского режима, идеи джадидов о просвещении, языке и нации легли в основу современной узбекской идентичности." },
    ] : locale === 'en' ? [
        { year: '1880', title: "Birth of Ideas", desc: "Ideas of Islamic reformism and enlightenment began spreading in Central Asia, inspired by thinkers from Crimea and the Ottoman Empire." },
        { year: '1893', title: "New-Method Schools", desc: "Ismail Gasprinsky developed a new teaching method — 'usul-i-jadid'. The first such schools appeared in Turkestan." },
        { year: '1900', title: "Movement Flourishes", desc: "Jadid schools spread across Turkestan, Bukhara and Khiva. Newspapers, journals were published and theatrical plays were staged." },
        { year: '1905', title: "Politicization", desc: "After the 1905 Russian revolution, Jadids moved from cultural enlightenment to political demands for reform." },
        { year: '1917', title: "Autonomy", desc: "Jadids established the Turkestan Autonomy in Kokand — the first democratic state in Central Asia." },
        { year: '1920s', title: "Legacy", desc: "Despite Soviet repression, Jadid ideas about enlightenment, language and nation became the foundation of modern Uzbek identity." },
    ] : [
        { year: '1880', title: "G'oyalarning tug'ilishi", desc: "Qrim va Usmonli imperiyasidan ilhomlanib, Markaziy Osiyoda islomiy islohotchilik va ma'rifatchilik g'oyalari tarqala boshladi." },
        { year: '1893', title: "Yangi usul maktablari", desc: "Ismoil Gasprinsky 'usul-i-jadid' nomli yangi o'qitish usulini ishlab chiqdi. Birinchi bunday maktablar Turkistonda paydo bo'ldi." },
        { year: '1900', title: "Harakat gullab-yashnashi", desc: "Jadid maktablari butun Turkiston, Buxoro va Xivaga tarqaldi. Gazetalar, jurnallar chiqarildi va teatr pyesalari sahnalashtirildi." },
        { year: '1905', title: "Siyosiylashuv", desc: "1905-yilgi rus inqilobidan so'ng jadidlar madaniy ma'rifatchilikdan islohotga bo'lgan siyosiy talablarga o'tdi." },
        { year: '1917', title: "Muxtoriyat", desc: "Jadidlar Qo'qonda Turkiston muxtoriyatini tuzdi — Markaziy Osiyodagi birinchi demokratik davlat." },
        { year: '1920', title: "Meros", desc: "Sovet repressiyalariga qaramay, jadidlarning ma'rifat, til va millat haqidagi g'oyalari zamonaviy o'zbek identitetining asosiga aylandi." },
    ]

    const goals = locale === 'ru' ? [
        { Icon: Icons.Book, label: 'Просвещение', value: 'Распространение грамотности и современного образования среди народа' },
        { Icon: Icons.Globe, label: 'Язык', value: 'Реформа и унификация тюркских языков, создание единой литературной нормы' },
        { Icon: Icons.Pen, label: 'Пресса', value: 'Издание газет и журналов для пробуждения национального самосознания' },
        { Icon: Icons.MapPin, label: 'Реформы', value: 'Модернизация религиозных и государственных институтов' },
    ] : locale === 'en' ? [
        { Icon: Icons.Book, label: 'Education', value: 'Spreading literacy and modern education among the people' },
        { Icon: Icons.Globe, label: 'Language', value: 'Reform and unification of Turkic languages, creating a unified literary standard' },
        { Icon: Icons.Pen, label: 'Press', value: 'Publishing newspapers and journals to awaken national consciousness' },
        { Icon: Icons.MapPin, label: 'Reforms', value: 'Modernization of religious and state institutions' },
    ] : [
        { Icon: Icons.Book, label: "Ta'lim", value: "Xalq orasida savodxonlik va zamonaviy ma'lumotni tarqatish" },
        { Icon: Icons.Globe, label: 'Til', value: "Turkiy tillarni isloh qilish va birlashtirish, yagona adabiy me'yor yaratish" },
        { Icon: Icons.Pen, label: 'Matbuot', value: "Milliy ongni uyg'otish uchun gazeta va jurnallar nashr etish" },
        { Icon: Icons.MapPin, label: 'Islohotlar', value: "Diniy va davlat institutlarini modernizatsiya qilish" },
    ]

    const t = {
        label:         locale === 'ru' ? 'История движения' : locale === 'en' ? 'Movement History' : 'Harakat Tarixi',
        h1a:           locale === 'ru' ? 'Джадиды — '       : locale === 'en' ? 'Jadids — '        : 'Jadidlar — ',
        h1b:           locale === 'ru' ? 'Просветители Востока' : locale === 'en' ? 'Enlighteners of the East' : "Sharq Ma'rifatparvarlari",
        desc:          locale === 'ru'
            ? 'История великого просветительского движения Центральной Азии конца XIX — начала XX века, его идеи, деятели и наследие.'
            : locale === 'en'
            ? 'The history of the great enlightenment movement of Central Asia in the late 19th – early 20th century, its ideas, figures and legacy.'
            : "XIX asr oxiri — XX asr boshlarida Markaziy Osiyo buyuk ma'rifat harakatining tarixi, g'oyalari, arboblari va merosi.",

        whatLabel:     locale === 'ru' ? 'Что такое джадидизм?' : locale === 'en' ? 'What is Jadidism?' : 'Jadidizm nima?',
        whatH2a:       locale === 'ru' ? 'Движение '        : locale === 'en' ? 'The '             : 'Jadid ',
        whatH2b:       locale === 'ru' ? 'Просвещения'      : locale === 'en' ? 'Jadid Movement'   : 'Harakati',
        whatDesc1:     locale === 'ru'
            ? 'Джадидизм (от арабского «джадид» — «новый») — реформаторское и просветительское движение, возникшее в конце XIX века среди тюркоязычных мусульман России и Средней Азии.'
            : locale === 'en'
            ? 'Jadidism (from Arabic "jadid" — "new") was a reformist and enlightenment movement that emerged in the late 19th century among Turkic-speaking Muslims of Russia and Central Asia.'
            : "Jadidizm (arabcha \"jadid\" — \"yangi\"dan) — XIX asr oxirida Rossiya va O'rta Osiyoning turkiy tilli musulmonlari orasida paydo bo'lgan islohotchilik va ma'rifatchilik harakati.",
        whatDesc2:     locale === 'ru'
            ? 'Джадиды выступали за реформу системы образования, развитие национальных языков, свободу прессы и политические преобразования. Они сыграли ключевую роль в формировании современной центральноазиатской идентичности.'
            : locale === 'en'
            ? 'Jadids advocated for the reform of the education system, development of national languages, freedom of the press and political transformation. They played a key role in shaping modern Central Asian identity.'
            : "Jadidlar ta'lim tizimini isloh qilish, milliy tillarni rivojlantirish, matbuot erkinligi va siyosiy o'zgarishlarni himoya qildi. Ular zamonaviy Markaziy Osiyo identitetini shakllantirishda muhim rol o'ynadi.",

        timelineLabel: locale === 'ru' ? 'Хронология'      : locale === 'en' ? 'Timeline'        : 'Xronologiya',
        timelineH2a:   locale === 'ru' ? 'История '         : locale === 'en' ? 'History of '      : 'Harakat ',
        timelineH2b:   locale === 'ru' ? 'Движения'         : locale === 'en' ? 'the Movement'     : 'Tarixi',
    }

    return (
        <>
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label">{t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            {/* What is Jadidism */}
            <section className="section" style={{ background: 'var(--bg-main)' }}>
                <div className="container">
                    <div className="grid-2-col">
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>{t.whatLabel}</div>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--text-heading)', marginBottom: '24px' }}>
                                {t.whatH2a}<span style={{ color: 'var(--gold)' }}>{t.whatH2b}</span>
                            </h2>
                            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px' }}>
                                {t.whatDesc1}
                            </p>
                            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                                {t.whatDesc2}
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            {goals.map((g, i) => (
                                <div key={i} style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {g.Icon && <g.Icon />}
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-heading)' }}>{g.label}</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{g.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>{t.timelineLabel}</div>
                        <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--text-heading)' }}>{t.timelineH2a}<span style={{ color: 'var(--gold)' }}>{t.timelineH2b}</span></h2>
                    </div>
                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {timeline.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: 'var(--gold)', color: '#061d15',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700',
                                        flexShrink: 0, zIndex: 1,
                                    }}>
                                        {item.year.slice(0, 4)}
                                    </div>
                                    {i < timeline.length - 1 && (
                                        <div style={{ width: '2px', flex: 1, background: 'var(--border-color)', margin: '8px 0' }} />
                                    )}
                                </div>
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '12px',
                                    padding: '20px 24px',
                                    border: '1px solid var(--border-color)',
                                    marginBottom: '24px',
                                    flex: 1,
                                }}>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', marginBottom: '4px' }}>{item.year}</div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-heading)', marginBottom: '8px' }}>{item.title}</h3>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
