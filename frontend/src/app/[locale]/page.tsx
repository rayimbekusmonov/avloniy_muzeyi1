'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { figureService } from '@/lib/services'
import { HistoricalFigure } from '@/lib/api'

// Modern Vector Icons (2026 Stroke Design System)
const ModernIcons = {
    Feather: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 13v5h5l9.24-9.24z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
        </svg>
    ),
    BookOpen: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
    ),
    MapPin: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
    ),
    Search: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
    ),
    ArrowUpRight: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
        </svg>
    ),
    Compass: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
    ),
    Quote: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        </svg>
    ),
    Sparkles: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
        </svg>
    )
}

const SLIDE_IMAGES = ['/slide1.png', '/slide2.png', '/slide3.png', '/slide4.png']

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
            <div style={{ position: 'absolute', inset: 0, background: '#03120d', zIndex: 0 }} />
            <div key={`curr-${current}`} style={{ position: 'absolute', inset: 0, zIndex: 1, transition: 'opacity 1.2s ease' }}>
                {/* High visibility image opacity: 0.75 */}
                <Image src={SLIDE_IMAGES[current]} alt="Jadidlar Portali Background" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: 0.75 }} />
            </div>
            {/* Royal Emerald gradient overlay allowing background slides to shine through brightly */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(3,18,13,0.45) 0%, rgba(3,18,13,0.75) 70%, #03120d 100%)' }} />
        </>
    )
}

export default function HomePage() {
    const locale = useLocale()
    const [jadids, setJadids] = useState<HistoricalFigure[]>([])
    const [search, setSearch] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('Toshkent')
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

    // Regional grouping for the Uzbekistan Map
    const mapRegions = useMemo(() => [
        {
            id: 'Toshkent',
            nameUz: 'Toshkent harakati',
            coords: { top: '35%', left: '82%' },
            figures: ['Abdulla Avloniy', 'Munavvarqori Abdurrashidxonov', 'Mashriq Yunusov (Elbek)'],
            desc: "Toshkent — Usuli savtiya maktablari, 'Shuhrat', 'Xurshid' va 'Najot' gazetalarining markazi."
        },
        {
            id: 'Samarqand',
            nameUz: 'Samarqand harakati',
            coords: { top: '56%', left: '63%' },
            figures: ['Mahmudxo\'ja Behbudiy', 'Siddiqiy Ajziy'],
            desc: "Samarqand — Turkiston jadidchilik sarvari Behbudiy, 'Padarkush' dramasi va 'Oyna' jurnali markazi."
        },
        {
            id: 'Buxoro',
            nameUz: 'Buxoro harakati',
            coords: { top: '58%', left: '46%' },
            figures: ['Abdurauf Fitrat', 'Fayzulla Xo\'jayev'],
            desc: "Buxoro — 'Tarbiyayi atfol' jamiyati, 'Munozara' asari va Fitrat g'oyaviy rahnamosligi."
        },
        {
            id: 'Farg\'ona',
            nameUz: 'Farg\'ona vodiysi',
            coords: { top: '48%', left: '88%' },
            figures: ['Abdulhamid Cho\'lpon', 'Ishoqxon Ibrat'],
            desc: "Farg'ona — Cho'lpon she'riyati va Ishoqxon Ibratning To'raqo'rg'ondagi bosmaxona matbaasi."
        }
    ], [])

    const activeMapRegion = useMemo(() => {
        return mapRegions.find(r => r.id === selectedRegion) || mapRegions[0]
    }, [mapRegions, selectedRegion])

    const quotes = useMemo(() => [
        {
            text: "Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir.",
            author: "Abdulla Avloniy",
            role: "Shoir, pedagog va matbuot asoschisi (Toshkent)"
        },
        {
            text: "Haq olinadur, berilmaydur! Dunyoda turmoq uchun dunyoviy fan va ilm lozimdir.",
            author: "Mahmudxo'ja Behbudiy",
            role: "Jadidchilik harakati sarvari va dramaturg (Samarqand)"
        },
        {
            text: "Bizni jaholat va nodonlik qorong'uligidan faqat ilm, ma'rifat va maktab qutqara oladi.",
            author: "Munavvarqori Abdurrashidxonov",
            role: "Toshkent jadidlarining yetakchisi"
        },
        {
            text: "Go'zal Turkiston, senga ne bo'ldi? Yonar bag'ringizda alanga qayda?",
            author: "Abdulhamid Cho'lpon",
            role: "Buyuk shoir va adib (Andijon / Farg'ona)"
        },
        {
            text: "Haqiqat egiladi, bukiladi, ammo sinmaydi! Millat ma'rifat bilan yashaydi.",
            author: "Abdurauf Fitrat",
            role: "Olim va dramaturg (Buxoro)"
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
        heroTitle1: locale === 'ru' ? 'Узбекские ' : locale === 'en' ? 'Uzbekistan ' : "O'zbekiston ",
        heroTitleGold: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlari',
        heroSubtitle: locale === 'ru'
            ? 'Жизнь, научное и литературное наследие, газеты и книги узбекских просветителей XIX–XX веков.'
            : locale === 'en'
                ? 'Life, scientific and literary heritage, newspapers, and books of Uzbek enlighteners of the 19th–20th centuries.'
                : "XIX asr oxiri — XX asr boshlarida milliy renessans, yangi usul maktablari, matbuot va adabiyotga poydevor qo'ygan ulug' ma'rifatparvarlar merosi.",
        btnAllJadids: locale === 'ru' ? 'Каталог джадидов →' : locale === 'en' ? 'Jadids Directory →' : 'Jadidlarni ko\'rish →',
        btnLibrary: locale === 'ru' ? 'Библиотека асарлари' : locale === 'en' ? 'Library Resources' : 'Jadidlar Kutubxonasi',
        searchPlaceholder: locale === 'ru' ? 'Поиск джадида (Авлоний, Бехбудий, Чулпан, Фитрат...)' : locale === 'en' ? 'Search Jadids (Avloniy, Behbudiy, Cholpon, Fitrat...)' : 'Jadid ma\'rifatparvarini qidirish (Avloniy, Behbudiy, Cho\'lpon, Fitrat...)',
        mapSectionTitle: locale === 'ru' ? 'Географическая карта джадидов' : locale === 'en' ? 'Geographical Map of Jadids' : 'O\'zbekiston Jadidlari Xaritasi',
        mapSectionDesc: locale === 'ru' ? 'Интерактивная карта распределения узбекских просветителей по регионам' : locale === 'en' ? 'Interactive map of Uzbek enlighteners by geographical region' : 'Ma\'rifatparvar jadidlarning viloyatlar va harakat markazlari bo\'yicha geografik xaritasi',
        viewProfile: locale === 'ru' ? 'Открыть профиль' : locale === 'en' ? 'View Profile' : 'Profilni ko\'rish',
    }

    return (
        <div style={{ background: '#03120d', color: '#e2e8f0', minHeight: '100vh' }}>
            
            {/* HERO SECTION WITH BRIGHT & SHARP BACKGROUND SLIDES */}
            <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: '110px', paddingBottom: '60px', overflow: 'hidden' }}>
                <HeroSlideshow />

                <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
                        
                        {/* Main Left Content */}
                        <div style={{ maxWidth: '680px' }}>
                            
                            {/* Logo & Badge Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                                <div style={{
                                    width: '58px', height: '58px', borderRadius: '50%',
                                    overflow: 'hidden', border: '2px solid #C9A84C',
                                    background: '#060d17', boxShadow: '0 0 24px rgba(201,168,76,0.45)',
                                    flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Image src="/logo.png" alt="O'zbekiston Jadidlari Logo" width={76} height={76} style={{ objectFit: 'cover', transform: 'scale(1.4)' }} />
                                </div>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 20px', background: 'rgba(201,168,76,0.18)',
                                    border: '1px solid rgba(201,168,76,0.4)', borderRadius: '30px',
                                    color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '13px',
                                    fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px'
                                }}>
                                    <ModernIcons.Sparkles /> {labels.badge}
                                </div>
                            </div>

                            {/* Main Title */}
                            <h1 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(40px, 6vw, 66px)',
                                fontWeight: '800', color: '#ffffff',
                                lineHeight: 1.1, marginBottom: '20px',
                                letterSpacing: '-0.5px'
                            }}>
                                {labels.heroTitle1}<span style={{
                                    background: 'linear-gradient(135deg, #FFF066 0%, #C9A84C 50%, #F5D77F 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                }}>{labels.heroTitleGold}</span>
                            </h1>

                            <p style={{
                                fontSize: '18.5px', lineHeight: '1.85',
                                color: 'rgba(255,255,255,0.92)',
                                marginBottom: '36px', fontFamily: 'var(--font-body)',
                                textShadow: '0 2px 10px rgba(0,0,0,0.7)'
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
                                        boxShadow: '0 10px 30px rgba(201,168,76,0.4)',
                                        transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    {labels.btnAllJadids}
                                </Link>

                                <Link
                                    href={`/${locale}/resources`}
                                    style={{
                                        padding: '16px 36px', background: 'rgba(255,255,255,0.08)',
                                        color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '8px', fontFamily: 'var(--font-display)',
                                        fontWeight: '600', fontSize: '16px', textDecoration: 'none',
                                        transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '10px'
                                    }}
                                >
                                    <ModernIcons.BookOpen /> {labels.btnLibrary}
                                </Link>
                            </div>

                            {/* Key Stats Counter */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
                                paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.15)'
                            }}>
                                {[
                                    { num: '7+', label: 'Jadid Yetakchilari' },
                                    { num: '100+', label: 'Elektron Asarlar' },
                                    { num: '50+', label: 'Nodir Hujjatlar' },
                                    { num: '4', label: 'Ma\'rifat Markazi' },
                                ].map((st, i) => (
                                    <div key={i}>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: '800', color: '#C9A84C' }}>{st.num}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>{st.label}</div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Right Quotes Glassmorphism Card */}
                        <div style={{
                            background: 'linear-gradient(145deg, rgba(14,34,56,0.9) 0%, rgba(22,50,82,0.9) 100%)',
                            border: '1px solid rgba(201,168,76,0.35)',
                            borderRadius: '16px', padding: '36px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(12px)', position: 'relative'
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '12px',
                                letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px'
                            }}>
                                <ModernIcons.Quote /> Jadid Ma'rifatparvarlari Hikmatlari
                            </div>

                            <p style={{
                                fontFamily: 'var(--font-display)', fontSize: '20px', fontStyle: 'italic',
                                color: '#ffffff', lineHeight: 1.8, marginBottom: '24px', minHeight: '110px'
                            }}>
                                &ldquo;{quotes[activeQuoteIdx].text}&rdquo;
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#C9A84C', fontFamily: 'var(--font-display)' }}>
                                        {quotes[activeQuoteIdx].author}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
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

            {/* NEW GEOGRAPHICAL MAP SECTION OF UZBEKISTAN JADIDS */}
            <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #050c18 0%, #0c1a2e 50%, #050c18 100%)', borderTop: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px auto' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '6px 16px', background: 'rgba(201,168,76,0.12)',
                            border: '1px solid rgba(201,168,76,0.3)', borderRadius: '20px',
                            color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '12px',
                            letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px'
                        }}>
                            <ModernIcons.Compass /> {labels.mapSectionTitle}
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', color: '#ffffff', fontWeight: '800', marginBottom: '12px' }}>
                            Jadidlarning Hududiy va Geografik Joylashuvi
                        </h2>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                            {labels.mapSectionDesc}
                        </p>
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '40px', alignItems: 'center'
                    }}>
                        
                        {/* Interactive Map Visual Container */}
                        <div style={{
                            position: 'relative',
                            background: 'radial-gradient(circle, rgba(14,34,56,0.9) 0%, rgba(6,13,23,0.95) 100%)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            borderRadius: '16px', padding: '24px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                            overflow: 'hidden', minHeight: '380px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {/* SVG Map of Uzbekistan */}
                            <div style={{ position: 'relative', width: '100%', maxWidth: '650px', height: 'auto' }}>
                                <img src="/uz.svg" alt="O'zbekiston Xaritasi" style={{ width: '100%', height: 'auto', filter: 'brightness(0.7) sepia(0.5) hue-rotate(180deg) saturate(2)' }} />

                                {/* Interactive Pulsing Hotspots on Map */}
                                {mapRegions.map(reg => (
                                    <button
                                        key={reg.id}
                                        onClick={() => setSelectedRegion(reg.id)}
                                        style={{
                                            position: 'absolute',
                                            top: reg.coords.top,
                                            left: reg.coords.left,
                                            transform: 'translate(-50%, -50%)',
                                            background: selectedRegion === reg.id ? '#C9A84C' : 'rgba(10,24,41,0.9)',
                                            color: selectedRegion === reg.id ? '#050c18' : '#C9A84C',
                                            border: '2px solid #C9A84C',
                                            borderRadius: '20px',
                                            padding: '6px 14px',
                                            fontSize: '12px',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            boxShadow: selectedRegion === reg.id ? '0 0 20px #C9A84C' : '0 4px 14px rgba(0,0,0,0.5)',
                                            transition: 'all 0.3s ease',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            zIndex: 20
                                        }}
                                    >
                                        <ModernIcons.MapPin /> {reg.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Region Information & Jadids List */}
                        <div style={{
                            background: 'rgba(14,34,56,0.85)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            borderRadius: '16px', padding: '36px',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.4)'
                        }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '13px',
                                fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px'
                            }}>
                                📍 {activeMapRegion.nameUz}
                            </div>

                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#fff', fontWeight: '800', marginBottom: '12px' }}>
                                {activeMapRegion.id} Jadidchilik Harakati
                            </h3>

                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: '24px' }}>
                                {activeMapRegion.desc}
                            </p>

                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                                Ushbu harakat vakillari:
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {filteredJadids.length === 0 ? (
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
                                        {activeMapRegion.id} hududidagi jadidlar yuklanmoqda...
                                    </div>
                                ) : (
                                    filteredJadids.map(jadid => (
                                        <Link
                                            key={jadid.id}
                                            href={`/${locale}/jadidlar/${jadid.id}`}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '14px 18px', background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                                                textDecoration: 'none', color: '#fff', transition: 'all 0.25s ease'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = 'rgba(201,168,76,0.12)'
                                                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                {jadid.imageUrl ? (
                                                    <img src={jadid.imageUrl} alt={jadid.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #C9A84C' }} />
                                                ) : (
                                                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C' }}>
                                                        <ModernIcons.Feather />
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '16px', color: '#fff' }}>
                                                        {jadid.name}
                                                    </div>
                                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C' }}>
                                                        {jadid.years}
                                                    </div>
                                                </div>
                                            </div>
                                            <ModernIcons.ArrowUpRight />
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* JADIDS CATALOG EXPLORER SECTION */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 40px auto' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                            Katalog
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', color: '#fff', fontWeight: '800', marginBottom: '12px' }}>
                            Barcha Jadid Ma&apos;rifatparvarlari
                        </h2>
                    </div>

                    {/* Interactive Search Bar */}
                    <div style={{
                        background: 'rgba(15,28,45,0.85)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: '14px', padding: '24px',
                        marginBottom: '44px',
                        display: 'flex', flexDirection: 'column', gap: '20px'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#C9A84C' }}>
                                <ModernIcons.Search />
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
                                                <ModernIcons.Feather />
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
                                    <ModernIcons.ArrowUpRight />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
