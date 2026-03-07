'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

interface Jadid {
    id: string
    nameUz: string
    nameRu: string
    nameEn: string
    years: string
    titleUz: string
    titleRu: string
    titleEn: string
    bioUz: string
    bioRu: string
    bioEn: string
    works: string[]
    icon: string
    color: string
    featured?: boolean
}

const JADIDLAR: Jadid[] = [
    {
        id: 'avloniy',
        nameUz: 'Abdulla Avloniy',
        nameRu: 'Абдулла Авлоний',
        nameEn: 'Abdulla Avloniy',
        years: '1878–1934',
        titleUz: "Shoir, dramaturg, pedagog va ma'rifatparvar",
        titleRu: 'Поэт, драматург, педагог и просветитель',
        titleEn: 'Poet, playwright, pedagogue and enlightener',
        bioUz: "Abdulla Avloniy Toshkentda tug'ilib, o'zbek ma'rifatchilik harakatining yetakchi namoyandalaridan biriga aylandi. U Toshkentda yangi usul maktablari ochdi, o'quv qo'llanmalar yozdi. \"Turkiy Guliston yoxud axloq\" asari milliy pedagogika tarixidagi muhim manbadir. \"Shuhrat\" va \"Osiyo\" gazetalarini tahrirladi. Dramaturgiyada ham kuchli iz qoldirdi.",
        bioRu: 'Абдулла Авлоний родился в Ташкенте и стал одним из ведущих представителей узбекского просветительского движения. Он открывал в Ташкенте школы нового метода, писал учебные пособия. «Туркий Гулистон ёхуд ахлоқ» — важный источник в истории национальной педагогики. Редактировал газеты «Шухрат» и «Осиё». Оставил значительный след и в драматургии.',
        bioEn: 'Abdulla Avloniy was born in Tashkent and became one of the leading figures of the Uzbek enlightenment movement. He opened new-method schools in Tashkent and wrote educational manuals. "Turkiy Guliston yokhud Akhlok" is an important source in the history of national pedagogy. He edited the newspapers "Shuhrat" and "Osiyo" and also made a significant contribution to dramaturgy.',
        works: ['Turkiy Guliston yoxud axloq (1913)', 'Adib (1907)', 'Baxtsiz kuyov (pyesa)', 'Shuhrat gazetasi'],
        icon: '✒️',
        color: '#1B3A6B',
        featured: true,
    },
    {
        id: 'behbudiy',
        nameUz: "Mahmudxo'ja Behbudiy",
        nameRu: 'Махмудходжа Бехбудий',
        nameEn: "Mahmudkhoja Behbudiy",
        years: '1875–1919',
        titleUz: "Yozuvchi, dramaturg va jadidchilik harakatining asoschisi",
        titleRu: 'Писатель, драматург и основатель движения джадидизма',
        titleEn: 'Writer, playwright and founder of the Jadidism movement',
        bioUz: "Mahmudxo'ja Behbudiy Samarqandda tug'ilib, o'zbek jadidchiligi harakatining eng yirik vakillaridan biri bo'ldi. Birinchi o'zbek dramasi — \"Padarkush\" asarining muallifi. Samarqandda \"Oyina\" jurnalini va \"Samarqand\" gazetasini nashr qildi. Musulmon dunyosida ta'lim islohotlari uchun faol kurashdi. 1919-yilda Buxoro amiri buyrug'i bilan qatl etildi.",
        bioRu: 'Махмудходжа Бехбудий родился в Самарканде и стал одним из крупнейших представителей узбекского джадидизма. Автор первой узбекской драмы — «Падаркуш». Издавал журнал «Ойина» и газету «Самарканд» в Самарканде. Активно боролся за реформы образования в мусульманском мире. В 1919 году был казнён по приказу бухарского эмира.',
        bioEn: "Mahmudkhoja Behbudiy was born in Samarkand and became one of the greatest representatives of Uzbek Jadidism. Author of the first Uzbek drama — \"Padarkush\". He published the journal \"Oyina\" and the newspaper \"Samarkand\" in Samarkand. He actively fought for educational reforms in the Muslim world. In 1919 he was executed on the orders of the Bukhara emir.",
        works: ['Padarkush (1911)', 'Oyina jurnali', 'Samarqand gazetasi', 'Muxtasar tarixi islom'],
        icon: '📜',
        color: '#2d4a1a',
    },
    {
        id: 'fitrat',
        nameUz: 'Abdurauf Fitrat',
        nameRu: 'Абдурауф Фитрат',
        nameEn: 'Abdurauf Fitrat',
        years: '1886–1938',
        titleUz: "Yozuvchi, dramaturg, olim va siyosatchi",
        titleRu: 'Писатель, драматург, учёный и политик',
        titleEn: 'Writer, playwright, scholar and politician',
        bioUz: "Abdurauf Fitrat Buxoroda tug'ildi. Istanbulda ta'lim olib, pan-turkizm va jadidchilik g'oyalarini o'rganib qaytdi. \"Hind sayyohi\" va \"Qiyomat\" kabi asarlari bilan mashhur. Buxoro Xalq Respublikasida tashqi ishlar vaziri bo'ldi. 1938-yilda Stalin repressiyasi jarayonida otib tashlandi.",
        bioRu: 'Абдурауф Фитрат родился в Бухаре. Получил образование в Стамбуле, вернулся с идеями пантюркизма и джадидизма. Известен такими произведениями, как «Индийский путешественник» и «Страшный суд». Стал министром иностранных дел Бухарской Народной Республики. В 1938 году расстрелян в ходе сталинских репрессий.',
        bioEn: 'Abdurauf Fitrat was born in Bukhara. He studied in Istanbul, returning with ideas of pan-Turkism and Jadidism. Famous for works such as "Indian Traveler" and "Judgment Day". He became Minister of Foreign Affairs of the Bukhara People\'s Republic. In 1938 he was shot during Stalin\'s repressions.',
        works: ['Hind sayyohi (1912)', 'Qiyomat (1923)', 'Bedil', 'Abu Muslim (drama)'],
        icon: '🖊️',
        color: '#2d1a3a',
    },
    {
        id: 'hamza',
        nameUz: 'Hamza Hakimzoda Niyoziy',
        nameRu: 'Хамза Хакимзаде Ниязи',
        nameEn: 'Hamza Hakimzoda Niyozi',
        years: '1889–1929',
        titleUz: "Shoir, dramaturg, kompozitor va ma'rifatparvar",
        titleRu: 'Поэт, драматург, композитор и просветитель',
        titleEn: 'Poet, playwright, composer and enlightener',
        bioUz: "Hamza Hakimzoda Niyoziy Qo'qonda tug'ildi. O'zbek sovet adabiyotining asoschisi hisoblanadi. Yangi usul maktablari ochdi, ayollar ozodligi uchun kurashdi. \"Yer yuzida yangi kun\" va ko'plab boshqa asarlar muallifi. 1929-yilda Shohimardon (Farg'ona viloyati) da diniy fanatiklar tomonidan toshbo'ron qilib o'ldirildi.",
        bioRu: "Хамза Хакимзаде Ниязи родился в Коканде. Считается основателем узбекской советской литературы. Открывал школы нового метода, боролся за освобождение женщин. Автор «Нового дня на земле» и многих других произведений. В 1929 году был забит камнями религиозными фанатиками в Шахимардане (Ферганская область).",
        bioEn: "Hamza Hakimzoda Niyozi was born in Kokand. He is considered the founder of Uzbek Soviet literature. He opened new-method schools and fought for women's liberation. Author of \"New Day on Earth\" and many other works. In 1929 he was stoned to death by religious fanatics in Shahimardan (Fergana region).",
        works: ["Yer yuzida yangi kun", "Zaharli hayot yoxud ishq qurbonlari", "Maysaraning ishi", "Ko'p qo'ychi"],
        icon: '🎭',
        color: '#1a2d00',
    },
    {
        id: 'cholpon',
        nameUz: 'Abdulhamid Sulaymon Cholpon',
        nameRu: 'Абдулхамид Сулайман Чулпан',
        nameEn: 'Abdulhamid Sulaymon Cholpon',
        years: '1897–1938',
        titleUz: "Shoir, yozuvchi va tarjimon",
        titleRu: 'Поэт, писатель и переводчик',
        titleEn: 'Poet, writer and translator',
        bioUz: "Cholpon (taxallus) Andijondan. O'zbek modernistik she'riyatining asoschilaridan biri. \"Kecha va kunduz\" romani o'zbek adabiyotining durdonasi. Hamletni, Shekspir asarlarini o'zbek tiliga tarjima qildi. Uning she'rlari ozodlik, muhabbat va vatanparvarlik mavzularini qamrab oldi. 1938-yilda Stalin repressiyasida otib tashlandi.",
        bioRu: "Чулпан (псевдоним) из Андижана. Один из основателей узбекского модернистского стиха. Роман «Ночь и день» — жемчужина узбекской литературы. Переводил Гамлета, произведения Шекспира на узбекский язык. Его стихи охватывали темы свободы, любви и патриотизма. В 1938 году расстрелян в ходе сталинских репрессий.",
        bioEn: "Cholpon (pseudonym) from Andijan. One of the founders of Uzbek modernist poetry. The novel \"Night and Day\" is a pearl of Uzbek literature. He translated Hamlet and Shakespeare's works into Uzbek. His poems covered themes of freedom, love and patriotism. In 1938 he was shot during Stalin's repressions.",
        works: ["Kecha va kunduz (roman)", "Bahor (she'rlar to'plami)", "Hamlet (tarjima)", "Yorqinoy (drama)"],
        icon: '📝',
        color: '#1a1a2d',
    },
    {
        id: 'qodiriy',
        nameUz: "Abdulla Qodiriy (Julqunboy)",
        nameRu: 'Абдулла Кадыри (Джулкунбой)',
        nameEn: "Abdulla Qodiriy (Julqunboy)",
        years: '1894–1938',
        titleUz: "Yozuvchi, romancier va jurnalist",
        titleRu: 'Писатель, романист и журналист',
        titleEn: 'Writer, novelist and journalist',
        bioUz: "Abdulla Qodiriy o'zbek klassik romanining asoschisi. \"O'tgan kunlar\" (1926) — birinchi o'zbek romani bo'lib, milliy adabiyotning oltin fondi. \"Mehrobdan chayon\" ikkinchi mashhur romani. \"Mushtum\" satirik jurnalini boshqardi. Qo'qon xonligi davridagi hayotni realistik tasvirladi. 1938-yilda qatl etildi.",
        bioRu: "Абдулла Кадыри — основатель узбекского классического романа. «Прошедшие дни» (1926) — первый узбекский роман, золотой фонд национальной литературы. «Скорпион из алтаря» — второй известный роман. Руководил сатирическим журналом «Муштум». Реалистически изображал жизнь в период Кокандского ханства. Расстрелян в 1938 году.",
        bioEn: "Abdulla Qodiriy is the founder of the Uzbek classical novel. \"Past Days\" (1926) is the first Uzbek novel and a golden fund of national literature. \"Scorpion from the Altar\" is his second famous novel. He ran the satirical journal \"Mushtum\". He realistically depicted life during the Kokand Khanate period. He was executed in 1938.",
        works: ["O'tgan kunlar (1926)", "Mehrobdan chayon (1929)", "Obid ketmon", "Mushtum jurnali"],
        icon: '📚',
        color: '#2d1a00',
    },
]

export default function JadidlarPage() {
    const locale = useLocale()
    const [selected, setSelected] = useState<Jadid | null>(null)
    const [filter, setFilter] = useState('all')

    const getName = (j: Jadid) => locale === 'ru' ? j.nameRu : locale === 'en' ? j.nameEn : j.nameUz
    const getTitle = (j: Jadid) => locale === 'ru' ? j.titleRu : locale === 'en' ? j.titleEn : j.titleUz
    const getBio = (j: Jadid) => locale === 'ru' ? j.bioRu : locale === 'en' ? j.bioEn : j.bioUz

    const t = {
        label: locale === 'ru' ? 'Просветители' : locale === 'en' ? 'Enlighteners' : "Ma'rifatparvarlar",
        h1a: locale === 'ru' ? "Узбекские " : locale === 'en' ? 'Uzbek ' : "O'zbek ",
        h1b: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlari',
        desc: locale === 'ru'
            ? 'Выдающиеся узбекские просветители XIX–XX веков, внёсшие неоценимый вклад в развитие образования, литературы и национального самосознания.'
            : locale === 'en'
                ? 'Outstanding Uzbek enlighteners of the 19th–20th centuries who made an invaluable contribution to the development of education, literature and national consciousness.'
                : "XIX–XX asr buyuk o'zbek jadidlari — ta'lim, adabiyot va milliy ong rivojiga munosib hissa qo'shgan zotlar.",
        works: locale === 'ru' ? 'Основные произведения' : locale === 'en' ? 'Key works' : "Asosiy asarlar",
        readMore: locale === 'ru' ? 'Подробнее' : locale === 'en' ? 'More details' : 'Batafsil',
        close: locale === 'ru' ? 'Закрыть' : locale === 'en' ? 'Close' : 'Yopish',
        jadidismTitle: locale === 'ru' ? 'Что такое джадидизм?' : locale === 'en' ? 'What is Jadidism?' : 'Jadidchilik nima?',
        jadidismText: locale === 'ru'
            ? 'Джадидизм (от арабского «усули джадид» — новый метод) — реформаторское движение в мусульманском мире конца XIX — начала XX вв. В Средней Азии джадиды выступали за модернизацию системы образования, развитие национальной культуры и языка, равноправие женщин, демократические реформы.'
            : locale === 'en'
                ? "Jadidism (from Arabic 'usul al-jadid' — new method) was a reformist movement in the Muslim world at the end of the 19th and early 20th centuries. In Central Asia, Jadids advocated for modernization of the education system, development of national culture and language, women's equality, and democratic reforms."
                : "Jadidchilik (arabcha \"usuli jadid\" — yangi usul) — XIX asr oxiri – XX asr boshlarida musulmon dunyosida islohot harakati. O'rta Osiyoda jadidlar ta'lim tizimini modernizatsiya qilish, milliy madaniyat va tilni rivojlantirish, ayollar huquqi, demokratik islohotlar uchun kurashdi.",
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header" style={{
                background: 'linear-gradient(135deg, #1a0e00 0%, #2d1a00 50%, #3d2a00 100%)',
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label" style={{ background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.3)' }}>
                        <span>✒️</span> {t.label}
                    </div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            {/* What is Jadidism */}
            <section style={{ background: '#0d1f3c', padding: '56px 0' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{
                        background: 'rgba(201,168,76,0.06)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        borderLeft: '4px solid #C9A84C',
                        borderRadius: '2px',
                        padding: '32px 36px',
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: '#C9A84C', letterSpacing: '4px', marginBottom: '12px',
                            textTransform: 'uppercase',
                        }}>📖 {t.jadidismTitle}</div>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: '1.95' }}>
                            {t.jadidismText}
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured - Avloniy */}
            <section style={{ background: 'var(--off-white)', padding: '72px 0' }}>
                <div className="container">
                    <div style={{
                        display: 'inline-flex', gap: '8px', alignItems: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                        color: 'var(--gold)', letterSpacing: '4px',
                        textTransform: 'uppercase', marginBottom: '40px',
                    }}>
                        <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                        {locale === 'ru' ? 'Центральная фигура' : locale === 'en' ? 'Central figure' : 'Markaziy shaxs'}
                    </div>

                    {/* Avloniy featured */}
                    {(() => {
                        const a = JADIDLAR[0]
                        return (
                            <div style={{
                                display: 'grid', gridTemplateColumns: '300px 1fr',
                                gap: '60px', alignItems: 'start',
                                background: '#fff',
                                border: '1px solid rgba(27,58,107,0.08)',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: '0 8px 40px rgba(27,58,107,0.1)',
                            }}>
                                <div style={{
                                    background: `linear-gradient(160deg, ${a.color}, #254d8f)`,
                                    minHeight: '360px',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    gap: '16px', padding: '40px',
                                }}>
                                    <div style={{ fontSize: '80px', opacity: 0.5 }}>{a.icon}</div>
                                    <div style={{
                                        fontFamily: 'var(--font-display)', fontSize: '22px',
                                        color: '#fff', textAlign: 'center', lineHeight: 1.3,
                                    }}>{getName(a)}</div>
                                    <div style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '13px',
                                        color: '#C9A84C', letterSpacing: '2px',
                                    }}>{a.years}</div>
                                    <div style={{
                                        background: '#C9A84C', color: '#fff',
                                        fontFamily: 'var(--font-mono)', fontSize: '9px',
                                        letterSpacing: '2px', textTransform: 'uppercase',
                                        padding: '4px 12px', borderRadius: '2px',
                                    }}>
                                        {locale === 'ru' ? 'Музей назван в его честь' : locale === 'en' ? 'Museum named after him' : 'Muzey uning nomida'}
                                    </div>
                                </div>
                                <div style={{ padding: '40px 40px 40px 0' }}>
                                    <div style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                                        color: 'var(--gold)', letterSpacing: '2px',
                                        textTransform: 'uppercase', marginBottom: '10px',
                                    }}>{getTitle(a)}</div>
                                    <h2 style={{ fontSize: '28px', marginBottom: '20px', color: 'var(--navy-dark)' }}>
                                        {getName(a)}
                                    </h2>
                                    <div style={{ width: '40px', height: '2px', background: 'var(--gold)', marginBottom: '20px' }} />
                                    <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '24px' }}>
                                        {getBio(a)}
                                    </p>
                                    <div>
                                        <div style={{
                                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                                            color: 'var(--gold)', letterSpacing: '3px',
                                            textTransform: 'uppercase', marginBottom: '12px',
                                        }}>{t.works}</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {a.works.map((w, i) => (
                                                <span key={i} style={{
                                                    background: 'rgba(27,58,107,0.06)',
                                                    border: '1px solid rgba(27,58,107,0.12)',
                                                    borderRadius: '2px', padding: '5px 12px',
                                                    fontSize: '13px', color: 'var(--navy-dark)',
                                                    fontFamily: 'var(--font-mono)',
                                                }}>{w}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            </section>

            {/* Other Jadids Grid */}
            <section style={{ background: '#060f1e', padding: '72px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <div style={{
                            display: 'inline-flex', gap: '10px', alignItems: 'center',
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: '#C9A84C', letterSpacing: '4px',
                            textTransform: 'uppercase', marginBottom: '16px',
                        }}>
                            <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                            {locale === 'ru' ? 'Другие представители' : locale === 'en' ? 'Other representatives' : 'Boshqa namoyandalar'}
                            <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: 'clamp(26px, 3vw, 36px)' }}>
                            {locale === 'ru' ? "Соратники Авлония" : locale === 'en' ? "Avloniy's Colleagues" : "Avloniy safdoshlari"}
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                        {JADIDLAR.slice(1).map(jadid => (
                            <div
                                key={jadid.id}
                                onClick={() => setSelected(jadid)}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: '2px',
                                    padding: '32px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    position: 'relative', overflow: 'hidden',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(201,168,76,0.07)'
                                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '52px', height: '52px', flexShrink: 0,
                                        background: `linear-gradient(135deg, ${jadid.color}, rgba(201,168,76,0.2))`,
                                        borderRadius: '2px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '24px',
                                    }}>{jadid.icon}</div>
                                    <div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', marginBottom: '4px' }}>
                                            {getName(jadid)}
                                        </h3>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C' }}>
                                            {jadid.years}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {getTitle(jadid)}
                                </div>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', marginBottom: '16px' }}>
                                    {getBio(jadid).substring(0, 150)}...
                                </p>
                                <div style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                                    color: '#C9A84C', letterSpacing: '2px',
                                }}>
                                    {t.readMore} →
                                </div>
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0,
                                    width: '40px', height: '2px', background: '#C9A84C', opacity: 0.4,
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section style={{ background: 'var(--off-white)', padding: '72px 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                        <div style={{
                            display: 'inline-flex', gap: '10px', alignItems: 'center',
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: 'var(--gold)', letterSpacing: '4px',
                            textTransform: 'uppercase', marginBottom: '16px',
                        }}>
                            <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                            {locale === 'ru' ? 'Хронология' : locale === 'en' ? 'Timeline' : 'Xronologiya'}
                        </div>
                        <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)' }}>
                            {locale === 'ru' ? 'Эпоха ' : locale === 'en' ? 'The ' : ''}
                            <span style={{ color: 'var(--gold)' }}>
                                {locale === 'ru' ? 'Джадидизма' : locale === 'en' ? 'Jadidism Era' : 'Jadidchilik davri'}
                            </span>
                        </h2>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute', left: '87px', top: 0, bottom: 0,
                            width: '2px', background: 'linear-gradient(to bottom, var(--gold), rgba(201,168,76,0.1))',
                        }} />
                        {[
                            {
                                year: '1880s',
                                textUz: "Yangi usul maktablari O'rta Osiyoda paydo bo'la boshladi",
                                textRu: 'Школы нового метода начали появляться в Средней Азии',
                                textEn: 'New method schools began appearing in Central Asia',
                            },
                            {
                                year: '1904',
                                textUz: "Behbudiy Samarqandda birinchi yangi usul maktabini ochdi",
                                textRu: 'Бехбудий открыл первую школу нового метода в Самарканде',
                                textEn: 'Behbudiy opened the first new-method school in Samarkand',
                            },
                            {
                                year: '1911',
                                textUz: "\"Padarkush\" — birinchi o'zbek dramasi sahnalashtirildi",
                                textRu: '«Падаркуш» — поставлена первая узбекская драма',
                                textEn: '"Padarkush" — the first Uzbek drama was staged',
                            },
                            {
                                year: '1913',
                                textUz: "Avloniyning \"Turkiy Guliston\" asari nashr etildi",
                                textRu: 'Опубликован «Туркий Гулистон» Авлония',
                                textEn: "Avloniy's \"Turkiy Guliston\" was published",
                            },
                            {
                                year: '1920s',
                                textUz: "Ko'plab jadidlar sovet hukumati bilan hamkorlik qildi",
                                textRu: 'Многие джадиды сотрудничали с советской властью',
                                textEn: 'Many Jadids cooperated with the Soviet government',
                            },
                            {
                                year: '1937–38',
                                textUz: "Stalin repressiyasida ko'plab jadidlar qatl etildi",
                                textRu: 'В ходе сталинских репрессий многие джадиды были расстреляны',
                                textEn: "Many Jadids were executed during Stalin's repressions",
                            },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '32px', marginBottom: '32px', alignItems: 'flex-start' }}>
                                <div style={{
                                    minWidth: '72px', fontFamily: 'var(--font-display)', fontSize: '15px',
                                    fontWeight: '700', color: 'var(--gold)', textAlign: 'right', paddingTop: '14px',
                                }}>{item.year}</div>
                                <div style={{
                                    width: '14px', height: '14px', borderRadius: '50%',
                                    background: 'var(--gold)', flexShrink: 0, marginTop: '16px',
                                    border: '3px solid var(--off-white)', zIndex: 1,
                                }} />
                                <div style={{
                                    flex: 1, background: '#fff', borderRadius: '2px',
                                    padding: '18px 22px',
                                    border: '1px solid rgba(27,58,107,0.07)',
                                    boxShadow: '0 2px 12px rgba(27,58,107,0.06)',
                                }}>
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
                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '24px', backdropFilter: 'blur(8px)',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#fff', borderRadius: '4px',
                            maxWidth: '700px', width: '100%', maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                    >
                        <div style={{
                            background: `linear-gradient(135deg, ${selected.color}, #254d8f)`,
                            padding: '40px',
                            display: 'flex', gap: '24px', alignItems: 'center',
                        }}>
                            <div style={{ fontSize: '52px' }}>{selected.icon}</div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '2px', marginBottom: '8px' }}>
                                    {getTitle(selected)}
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#fff', marginBottom: '8px' }}>
                                    {getName(selected)}
                                </h2>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                                    {selected.years}
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '36px 40px' }}>
                            <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '32px' }}>
                                {getBio(selected)}
                            </p>

                            <div>
                                <div style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                                    color: 'var(--gold)', letterSpacing: '3px',
                                    textTransform: 'uppercase', marginBottom: '14px',
                                }}>{t.works}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                                    {selected.works.map((w, i) => (
                                        <span key={i} style={{
                                            background: 'rgba(27,58,107,0.06)',
                                            border: '1px solid rgba(27,58,107,0.12)',
                                            borderRadius: '2px', padding: '6px 14px',
                                            fontSize: '13px', color: 'var(--navy-dark)',
                                            fontFamily: 'var(--font-mono)',
                                        }}>{w}</span>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    padding: '12px 28px',
                                    background: 'var(--navy-dark)', color: '#fff',
                                    border: 'none', borderRadius: '2px',
                                    fontFamily: 'var(--font-display)', fontWeight: '600',
                                    fontSize: '14px', cursor: 'pointer',
                                    letterSpacing: '1px',
                                }}
                            >{t.close} ✕</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}