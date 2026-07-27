'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { newsService, figureService } from '@/lib/services'
import { NewsItem, HistoricalFigure } from '@/lib/api'

// SVG Icons
const Icons = {
    Pen: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
    ),
    Book: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    Gallery: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    Newspaper: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
    MapPin: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
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
            <div style={{ position: 'absolute', inset: 0, background: '#060d17', zIndex: 0 }} />
            <div key={`curr-${current}`} style={{ position: 'absolute', inset: 0, zIndex: 1, transition: 'opacity 1.5s ease' }}>
                <Image src={SLIDE_IMAGES[current]} alt="Hero Slide" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: 0.45 }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(6,13,23,0.6) 0%, rgba(6,13,23,0.85) 70%, #060d17 100%)' }} />
        </>
    )
}

export default function HomePage() {
    const locale = useLocale()
    const [jadids, setJadids] = useState<HistoricalFigure[]>([])
    const [latestNews, setLatestNews] = useState<NewsItem[]>([])
    const [search, setSearch] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('Barchasi')

    useEffect(() => {
        figureService.getAll(locale).then(data => setJadids(data)).catch(() => {})
        newsService.getAll(0, 3, undefined, locale).then(res => setLatestNews(res.content || [])).catch(() => {})
    }, [locale])

    const filteredJadids = useMemo(() => {
        return jadids.filter(j => {
            const matchesSearch = search === '' || j.name.toLowerCase().includes(search.toLowerCase()) || (j.bio && j.bio.toLowerCase().includes(search.toLowerCase()))
            const matchesRegion = selectedRegion === 'Barchasi' || (j.region && j.region.includes(selectedRegion))
            return matchesSearch && matchesRegion
        })
    }, [jadids, search, selectedRegion])

    const labels = {
        badge: locale === 'ru' ? 'Единый портал джадидов Узбекистана' : locale === 'en' ? 'Unified Portal of Uzbek Jadids' : "O'zbekiston Jadidlari Yagona Portali",
        heroTitle: locale === 'ru' ? 'Просветители ' : locale === 'en' ? 'Enlighteners of ' : "O'zbekiston ",
        heroTitleGold: locale === 'ru' ? 'Узбекистана' : locale === 'en' ? 'Uzbekistan' : 'Jadidlari',
        heroDesc: locale === 'ru'
            ? 'Жизнь, научное и литературное наследие, редкие рукописи, газеты и книги просветителей Узбекистана.'
            : locale === 'en'
                ? 'Life, scientific and literary heritage, rare manuscripts, newspapers, and books of Uzbek enlighteners.'
                : "O'zbekiston jadidlarining hayoti, ilmiy-adabiy merosi, nodir qo'lyazmalari va bosma asarlarini jamlagan ma'rifat portali.",
        btnExplore: locale === 'ru' ? 'Все джадиды →' : locale === 'en' ? 'All Jadids →' : 'Jadidlarni ko\'rish →',
        btnLibrary: locale === 'ru' ? 'Библиотека' : locale === 'en' ? 'Library' : 'Kutubxona',
        searchPlaceholder: locale === 'ru' ? 'Поиск джадида (Авлоний, Бехбудий, Чулпан...)' : locale === 'en' ? 'Search Jadid (Avloniy, Behbudiy, Cholpon...)' : 'Jadid ma\'rifatparvarini qidirish (Avloniy, Behbudiy, Cho\'lpon...)',
        exploreTitle: locale === 'ru' ? 'Каталог просветителей' : locale === 'en' ? 'Enlighteners Directory' : 'Ma\'rifatparvarlar Katalogi',
        exploreSubtitle: locale === 'ru' ? 'Выберите просветителя для просмотра полного профиля' : locale === 'en' ? 'Select an enlightener to view their complete profile' : 'Jadid haqida to\'liq ma\'lumot va asarlarni ko\'rish uchun tanlang',
        viewProfile: locale === 'ru' ? 'Открыть профиль' : locale === 'en' ? 'View Profile' : 'Profilni ko\'rish',
    }

    return (
        <div style={{ background: '#060d17', color: '#e2e8f0', minHeight: '100vh' }}>
            
            {/* HERO SECTION */}
            <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', paddingTop: '100px', overflow: 'hidden' }}>
                <HeroSlideshow />

                <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                    <div style={{ maxWidth: '800px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '8px 18px', background: 'rgba(201,168,76,0.15)',
                            border: '1px solid rgba(201,168,76,0.3)', borderRadius: '30px',
                            color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '13px',
                            fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px',
                            marginBottom: '24px'
                        }}>
                            ✨ {labels.badge}
                        </div>

                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(36px, 6vw, 60px)',
                            fontWeight: '800', color: '#ffffff',
                            lineHeight: 1.1, marginBottom: '20px'
                        }}>
                            {labels.heroTitle}<span style={{ color: '#C9A84C' }}>{labels.heroTitleGold}</span>
                        </h1>

                        <p style={{
                            fontSize: '18px', lineHeight: '1.8',
                            color: 'rgba(255,255,255,0.82)',
                            maxWidth: '640px', marginBottom: '36px'
                        }}>
                            {labels.heroDesc}
                        </p>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <Link
                                href={`/${locale}/jadidlar`}
                                style={{
                                    padding: '14px 32px', background: '#C9A84C', color: '#060d17',
                                    borderRadius: '8px', fontFamily: 'var(--font-display)',
                                    fontWeight: '700', fontSize: '16px', textDecoration: 'none',
                                    boxShadow: '0 8px 24px rgba(201,168,76,0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {labels.btnExplore}
                            </Link>

                            <Link
                                href={`/${locale}/resources`}
                                style={{
                                    padding: '14px 32px', background: 'rgba(255,255,255,0.06)',
                                    color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px', fontFamily: 'var(--font-display)',
                                    fontWeight: '600', fontSize: '16px', textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {labels.btnLibrary}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK EXPLORER SECTION ON HOMEPAGE */}
            <section style={{ padding: '60px 0', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px auto' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                            {labels.exploreTitle}
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: '#fff', fontWeight: '700', marginBottom: '12px' }}>
                            O&apos;zbekiston Jadidlari bilan tanishing
                        </h2>
                        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.65)' }}>
                            {labels.exploreSubtitle}
                        </p>
                    </div>

                    {/* Search & Region Filters */}
                    <div style={{
                        background: 'rgba(15,28,45,0.8)',
                        border: '1px solid rgba(201,168,76,0.25)',
                        borderRadius: '12px', padding: '20px',
                        marginBottom: '40px',
                        display: 'flex', flexDirection: 'column', gap: '16px'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#C9A84C' }}>
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={labels.searchPlaceholder}
                                style={{
                                    width: '100%',
                                    padding: '14px 20px 14px 48px',
                                    background: 'rgba(6,13,23,0.8)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff', fontSize: '15px', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                                Region:
                            </span>
                            {['Barchasi', 'Toshkent', 'Samarqand', 'Buxoro', 'Farg\'ona'].map(reg => (
                                <button
                                    key={reg}
                                    onClick={() => setSelectedRegion(reg)}
                                    style={{
                                        padding: '6px 16px',
                                        background: selectedRegion === reg ? '#C9A84C' : 'rgba(255,255,255,0.05)',
                                        color: selectedRegion === reg ? '#060d17' : 'rgba(255,255,255,0.8)',
                                        border: '1px solid',
                                        borderColor: selectedRegion === reg ? '#C9A84C' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '6px',
                                        fontSize: '13px', fontFamily: 'var(--font-mono)',
                                        cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                >
                                    {reg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                        {filteredJadids.map(jadid => (
                            <Link
                                key={jadid.id}
                                href={`/${locale}/jadidlar/${jadid.id}`}
                                style={{
                                    background: 'rgba(15,28,45,0.7)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '12px', padding: '24px',
                                    textDecoration: 'none', color: 'inherit',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(22,42,68,0.9)'
                                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                                    e.currentTarget.style.transform = 'translateY(-4px)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(15,28,45,0.7)'
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        {jadid.imageUrl ? (
                                            <img src={jadid.imageUrl} alt={jadid.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.4)' }} />
                                        ) : (
                                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C' }}>
                                                <Icons.Pen />
                                            </div>
                                        )}
                                        {jadid.region && (
                                            <span style={{
                                                fontFamily: 'var(--font-mono)', fontSize: '11px',
                                                color: '#C9A84C', background: 'rgba(201,168,76,0.12)',
                                                padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.2)'
                                            }}>
                                                📍 {jadid.region}
                                            </span>
                                        )}
                                    </div>

                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#ffffff', fontWeight: '700', marginBottom: '4px' }}>
                                        {jadid.name}
                                    </h3>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', marginBottom: '12px' }}>
                                        {jadid.years}
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {jadid.bio}
                                    </p>
                                </div>

                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)',
                                    fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', fontWeight: '600'
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
