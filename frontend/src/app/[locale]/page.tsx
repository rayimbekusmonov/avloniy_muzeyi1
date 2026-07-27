'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { newsService, figureService } from '@/lib/services'
import { NewsItem, HistoricalFigure } from '@/lib/api'

// SVG Icons
const Icons = {
    Pen: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
    ),
    Book: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    Gallery: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    Newspaper: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/>
        </svg>
    ),
    Search: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    ),
    ArrowRight: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
    ),
    Quote: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        </svg>
    ),
    User: () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    )
}

const SLIDE_IMAGES = ['/slide1.jpg', '/slide2.jpg', '/slide3.jpg', '/slide4.jpg']

function HeroSlideshow() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(c => (c + 1) % SLIDE_IMAGES.length)
        }, 6000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div style={{ position: 'absolute', inset: 0, background: '#050c18', zIndex: 0 }} />
            <div key={`curr-${current}`} style={{ position: 'absolute', inset: 0, zIndex: 1, transition: 'opacity 1.5s ease' }}>
                <Image src={SLIDE_IMAGES[current]} alt="Jadidlar Portali" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: 0.4 }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(5,12,24,0.65) 0%, rgba(5,12,24,0.88) 70%, #050c18 100%)' }} />
        </>
    )
}

export default function HomePage() {
    const locale = useLocale()
    const [jadids, setJadids] = useState<HistoricalFigure[]>([])
    const [search, setSearch] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('Barchasi')
    const [activeQuoteIdx, setActiveQuoteIdx] = useState(0)

    useEffect(() => {
        figureService.getAll(locale).then(data => setJadids(data)).catch(() => {})
    }, [locale])

    const filteredJadids = useMemo(() => {
        return jadids.filter(j => {
            const matchesSearch = search === '' ||
                j.name.toLowerCase().includes(search.toLowerCase()) ||
                (j.title && j.title.toLowerCase().includes(search.toLowerCase())) ||
                (j.bio && j.bio.toLowerCase().includes(search.toLowerCase()))
            const matchesRegion = selectedRegion === 'Barchasi' || (j.region && j.region.includes(selectedRegion))
            return matchesSearch && matchesRegion
        })
    }, [jadids, search, selectedRegion])

    const quotes = useMemo(() => [
        {
            text: "Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir.",
            author: "Abdulla Avloniy",
            role: "Shoir, pedagog va matbuot asoschisi"
        },
        {
            text: "Haq olinadur, berilmaydur! Dunyoda turmoq uchun dunyoviy fan va ilm lozimdir.",
            author: "Mahmudxo'ja Behbudiy",
            role: "Jadidchilik harakati sarvari va dramaturg"
        },
        {
            text: "Bizni jaholat va nodonlik qorong'uligidan faqat ilm, ma'rifat va maktab qutqara oladi.",
            author: "Munavvarqori Abdurrashidxonov",
            role: "Toshkent jadidlarining yetakchisi"
        },
        {
            text: "Go'zal Turkiston, senga ne bo'ldi? Yonar bag'ringizda alanga qayda?",
            author: "Abdulhamid Cho'lpon",
            role: "Buyuk shoir va adib"
        },
        {
            text: "Haqiqat egiladi, bukiladi, ammo sinmaydi! Millat ma'rifat bilan yashaydi.",
            author: "Abdurauf Fitrat",
            role: "Olim va dramaturg"
        }
    ], [])

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveQuoteIdx(prev => (prev + 1) % quotes.length)
        }, 8000)
        return () => clearInterval(timer)
    }, [quotes.length])

    const labels = {
        badge: locale === 'ru' ? 'Единый портал джадидизма Узбекистана' : locale === 'en' ? 'Unified Portal of Uzbek Jadidism' : "O'zbekiston Jadidlari Portali",
        heroTitle1: locale === 'ru' ? 'Узбекиские ' : locale === 'en' ? 'Uzbekistan ' : "O'zbekiston ",
        heroTitleGold: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlari',
        heroSubtitle: locale === 'ru'
            ? 'Жизнь, научное и литературное наследие, газеты и книги узбекских просветителей XIX–XX веков.'
            : locale === 'en'
                ? 'Life, scientific and literary heritage, newspapers, and books of Uzbek enlighteners of the 19th–20th centuries.'
                : "XIX asr oxiri — XX asr boshlarida milliy renessans, yangi usul maktablari, matbuot va adabiyotga poydevor qo'ygan ulug' ma'rifatparvarlar merosi.",
        btnAllJadids: locale === 'ru' ? 'Каталог джадидов →' : locale === 'en' ? 'Jadids Directory →' : 'Jadidlarni ko\'rish →',
        btnLibrary: locale === 'ru' ? 'Библиотека асарлари' : locale === 'en' ? 'Library Resources' : 'Jadidlar Kutubxonasi',
        searchPlaceholder: locale === 'ru' ? 'Поиск джадида (Авлоний, Бехбудий, Чулпан, Фитрат...)' : locale === 'en' ? 'Search Jadids (Avloniy, Behbudiy, Cholpon, Fitrat...)' : 'Jadid ma\'rifatparvarini qidirish (Avloniy, Behbudiy, Cho\'lpon, Fitrat...)',
        exploreTitle: locale === 'ru' ? 'Просветители Узбекистана' : locale === 'en' ? 'Enlighteners of Uzbekistan' : 'Ma\'rifatparvarlar Portali',
        exploreSubtitle: locale === 'ru' ? 'Выберите просветителя для просмотра биографии, книг и архивов' : locale === 'en' ? 'Select an enlightener to view biography, books, and archives' : 'Jadid haqida to\'liq biografiya, elektron asarlar va foto arxivasini ko\'rish uchun tanlang',
        viewProfile: locale === 'ru' ? 'Открыть профиль' : locale === 'en' ? 'View Profile' : 'Profilni ko\'rish',
        pillarsTitle: locale === 'ru' ? 'Основы движения джадидов' : locale === 'en' ? 'Pillars of the Jadid Movement' : 'Jadidchilik Harakati Ustunlari',
    }

    return (
        <div style={{ background: '#050c18', color: '#e2e8f0', minHeight: '100vh' }}>
            
            {/* HERO SECTION */}
            <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', paddingTop: '110px', paddingBottom: '60px', overflow: 'hidden' }}>
                <HeroSlideshow />

                <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
                        
                        {/* Main Left Content */}
                        <div style={{ maxWidth: '680px' }}>
                            
                            {/* Logo & Badge Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    overflow: 'hidden', border: '2px solid #C9A84C',
                                    background: '#fff', boxShadow: '0 0 20px rgba(201,168,76,0.3)',
                                    flexShrink: 0
                                }}>
                                    <Image src="/logo.png" alt="O'zbekiston Jadidlari Logo" width={56} height={56} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
                                </div>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 18px', background: 'rgba(201,168,76,0.12)',
                                    border: '1px solid rgba(201,168,76,0.3)', borderRadius: '30px',
                                    color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '13px',
                                    fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px'
                                }}>
                                    ✨ {labels.badge}
                                </div>
                            </div>

                            {/* Main Title */}
                            <h1 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(38px, 5.5vw, 64px)',
                                fontWeight: '800', color: '#ffffff',
                                lineHeight: 1.12, marginBottom: '20px',
                                letterSpacing: '-0.5px'
                            }}>
                                {labels.heroTitle1}<span style={{
                                    background: 'linear-gradient(135deg, #FFDF00 0%, #C9A84C 50%, #E6C265 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                }}>{labels.heroTitleGold}</span>
                            </h1>

                            <p style={{
                                fontSize: '18px', lineHeight: '1.85',
                                color: 'rgba(255,255,255,0.85)',
                                marginBottom: '36px', fontFamily: 'var(--font-body)'
                            }}>
                                {labels.heroSubtitle}
                            </p>

                            {/* CTA Action Buttons */}
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                                <Link
                                    href={`/${locale}/jadidlar`}
                                    style={{
                                        padding: '16px 36px', background: 'linear-gradient(135deg, #C9A84C 0%, #a88832 100%)',
                                        color: '#050c18', borderRadius: '8px', fontFamily: 'var(--font-display)',
                                        fontWeight: '700', fontSize: '16px', textDecoration: 'none',
                                        boxShadow: '0 10px 30px rgba(201,168,76,0.35)',
                                        transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    {labels.btnAllJadids}
                                </Link>

                                <Link
                                    href={`/${locale}/resources`}
                                    style={{
                                        padding: '16px 36px', background: 'rgba(255,255,255,0.06)',
                                        color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px', fontFamily: 'var(--font-display)',
                                        fontWeight: '600', fontSize: '16px', textDecoration: 'none',
                                        transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    <Icons.Book /> {labels.btnLibrary}
                                </Link>
                            </div>

                            {/* Key Stats Counter */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
                                paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {[
                                    { num: '7+', label: 'Jadid Yetakchilari' },
                                    { num: '100+', label: 'Elektron Asarlar' },
                                    { num: '50+', label: 'Nodir Hujjatlar' },
                                    { num: '4', label: 'Ma\'rifat Markazi' },
                                ].map((st, i) => (
                                    <div key={i}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '800', color: '#C9A84C' }}>{st.num}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{st.label}</div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Right Quote Highlights Card */}
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(14,34,56,0.85) 0%, rgba(22,50,82,0.85) 100%)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            borderRadius: '16px', padding: '36px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)', position: 'relative'
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '12px',
                                letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px'
                            }}>
                                <Icons.Quote /> Jadid Ma'rifatparvarlari Hikmatlari
                            </div>

                            <p style={{
                                fontFamily: 'var(--font-display)', fontSize: '19px', fontStyle: 'italic',
                                color: '#ffffff', lineHeight: 1.8, marginBottom: '24px', minHeight: '110px'
                            }}>
                                &ldquo;{quotes[activeQuoteIdx].text}&rdquo;
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#C9A84C', fontFamily: 'var(--font-display)' }}>
                                        {quotes[activeQuoteIdx].author}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                                        {quotes[activeQuoteIdx].role}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {quotes.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveQuoteIdx(idx)}
                                            style={{
                                                width: idx === activeQuoteIdx ? '24px' : '8px',
                                                height: '8px', borderRadius: '4px',
                                                background: idx === activeQuoteIdx ? '#C9A84C' : 'rgba(255,255,255,0.25)',
                                                border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* MOVEMENT PILLARS SECTION */}
            <section style={{ padding: '60px 0', background: 'rgba(10,24,41,0.6)', borderTop: '1px solid rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>
                            {labels.pillarsTitle}
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', fontWeight: '700' }}>
                            O&apos;zbekiston Jadidchilik Harakati Yo&apos;nalishlari
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                        {[
                            { icon: '🏫', title: "Usuli Savtiya Maktablari", desc: "Zamonaviy ta'lim, dunyoviy fanlar va yangi darsliklar yaratish yo'nalishi." },
                            { icon: '📰', title: "Ma'rifiy Matbuot", desc: "'Oyna', 'Shuhrat', 'Xurshid', 'Samarqand' gazeta va jurnallari asosida milliy uyg'onish." },
                            { icon: '🎭', title: "Jadid Teatri & Adabiyoti", desc: "'Padarkush', 'Turkiy Guliston', 'Kecha va kunduz' kabi ma'rifatparvar asarlar." },
                            { icon: '📚', title: "Ilmiy & Filologik Meros", desc: "Turkiy tillar, adabiyotshunoslik va milliy ma'naviyat poydevori." },
                        ].map((pil, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(15,28,45,0.7)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px', padding: '28px',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{pil.icon}</div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', marginBottom: '8px', fontWeight: '600' }}>
                                    {pil.title}
                                </h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                                    {pil.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* JADIDS CATALOG EXPLORER SECTION */}
            <section style={{ padding: '70px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 40px auto' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                            {labels.exploreTitle}
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', color: '#fff', fontWeight: '700', marginBottom: '12px' }}>
                            O&apos;zbekiston Jadidlari bilan tanishing
                        </h2>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                            {labels.exploreSubtitle}
                        </p>
                    </div>

                    {/* Interactive Search & Region Filters */}
                    <div style={{
                        background: 'rgba(15,28,45,0.85)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: '14px', padding: '24px',
                        marginBottom: '44px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        display: 'flex', flexDirection: 'column', gap: '20px'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#C9A84C' }}>
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={labels.searchPlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '16px 20px 16px 52px',
                                    background: 'rgba(5,12,24,0.9)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '10px',
                                    color: '#fff', fontSize: '15px', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                                Harakat markazi:
                            </span>
                            {['Barchasi', 'Toshkent', 'Samarqand', 'Buxoro', 'Farg\'ona'].map(reg => (
                                <button
                                    key={reg}
                                    onClick={() => setSelectedRegion(reg)}
                                    style={{
                                        padding: '8px 20px',
                                        background: selectedRegion === reg ? '#C9A84C' : 'rgba(255,255,255,0.05)',
                                        color: selectedRegion === reg ? '#050c18' : 'rgba(255,255,255,0.8)',
                                        border: '1px solid',
                                        borderColor: selectedRegion === reg ? '#C9A84C' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '6px',
                                        fontSize: '13px', fontFamily: 'var(--font-mono)',
                                        fontWeight: selectedRegion === reg ? '700' : '400',
                                        cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                >
                                    {reg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
                        {filteredJadids.map(jadid => (
                            <Link
                                key={jadid.id}
                                href={`/${locale}/jadidlar/${jadid.id}`}
                                style={{
                                    background: 'rgba(15,28,45,0.75)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '14px', padding: '28px',
                                    textDecoration: 'none', color: 'inherit',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(22,44,72,0.95)'
                                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
                                    e.currentTarget.style.transform = 'translateY(-6px)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(15,28,45,0.75)'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        {jadid.imageUrl ? (
                                            <img src={jadid.imageUrl} alt={jadid.name} style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.4)', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }} />
                                        ) : (
                                            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C' }}>
                                                <Icons.User />
                                            </div>
                                        )}
                                        {jadid.region && (
                                            <span style={{
                                                fontFamily: 'var(--font-mono)', fontSize: '11px',
                                                color: '#C9A84C', background: 'rgba(201,168,76,0.12)',
                                                padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.25)',
                                                fontWeight: '600'
                                            }}>
                                                📍 {jadid.region}
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#ffffff', fontWeight: '700', marginBottom: '6px' }}>
                                        {jadid.name}
                                    </h3>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#C9A84C', marginBottom: '14px', fontWeight: '600' }}>
                                        ⏳ {jadid.years}
                                    </div>
                                    <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {jadid.bio}
                                    </p>
                                </div>

                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)',
                                    fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#C9A84C', fontWeight: '700'
                                }}>
                                    <span>{labels.viewProfile}</span>
                                    <Icons.ArrowRight />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
