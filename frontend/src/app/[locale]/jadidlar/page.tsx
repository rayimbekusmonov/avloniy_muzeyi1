'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { figureService } from '@/lib/services'
import { HistoricalFigure } from '@/lib/api'

// Modernized Vector SVG Icons
const Icons = {
    Feather: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 13v5h5l9.24-9.24z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
        </svg>
    ),
    Search: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
    ),
    Person: () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    MapPin: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
    ),
    Book: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
    ),
    ArrowRight: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
        </svg>
    )
}

export default function JadidlarPage() {
    const locale = useLocale()
    const [figures, setFigures] = useState<HistoricalFigure[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRegion, setSelectedRegion] = useState<string>('Barchasi')
    const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi')

    useEffect(() => {
        setLoading(true)
        figureService.getAll(locale)
            .then(data => setFigures(data))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [locale])

    const regions = ['Barchasi', 'Toshkent', 'Samarqand', 'Buxoro', 'Farg\'ona']
    const categories = ['Barchasi', 'Ta\'lim & Matbuot', 'Matbuot & Teatr', 'Adabiyot & She\'riyat', 'Adabiyot & Fan']

    const getBirthYear = (years: string): number => {
        const match = years && years.match(/(\d{4})/)
        return match ? parseInt(match[1], 10) : 9999
    }

    const filteredFigures = useMemo(() => {
        return figures
            .filter(figure => {
                const matchesSearch = searchQuery === '' || 
                    figure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (figure.title && figure.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (figure.bio && figure.bio.toLowerCase().includes(searchQuery.toLowerCase()))
                
                const matchesRegion = selectedRegion === 'Barchasi' || (figure.region && figure.region.includes(selectedRegion))
                const matchesCategory = selectedCategory === 'Barchasi' || (figure.category && figure.category.includes(selectedCategory))

                return matchesSearch && matchesRegion && matchesCategory
            })
            .sort((a, b) => getBirthYear(a.years) - getBirthYear(b.years))
    }, [figures, searchQuery, selectedRegion, selectedCategory])

    const t = {
        label: locale === 'ru' ? 'Просветители Узбекистана' : locale === 'en' ? 'Enlighteners of Uzbekistan' : "O'zbekiston Ma'rifatparvarlari",
        h1a: locale === 'ru' ? 'Узбекские ' : locale === 'en' ? 'Uzbek ' : "O'zbekiston ",
        h1b: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlari',
        desc: locale === 'ru' 
            ? 'Единый реестр великих узбекских просветителей, создававших новометодные школы, прессу и литературу.' 
            : locale === 'en' 
                ? 'Comprehensive directory of Uzbek enlighteners who founded new-method schools, press, and literature.' 
                : "Yangi usul maktablari, milliy matbuot, teatr va adabiyotga poydevor qo'ygan buyuk ma'rifatparvarlar portali.",
        searchPlaceholder: locale === 'ru' ? 'Поиск джадида по имени или трудам...' : locale === 'en' ? 'Search Jadids by name or works...' : 'Jadid ma\'rifatparvarini qidirish...',
        filterRegion: locale === 'ru' ? 'Регион:' : locale === 'en' ? 'Region:' : 'Harakat markazi:',
        explore: locale === 'ru' ? 'Открыть профиль' : locale === 'en' ? 'Explore Profile' : 'Profilni ko\'rish',
        loading: locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...',
        empty: locale === 'ru' ? 'Ничего не найдено' : locale === 'en' ? 'No figures found' : "Mos keladigan jadid ma'lumoti topilmadi",
    }

    if (loading) return (
        <div style={{ minHeight: '60vh', background: '#060d17', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontFamily: 'var(--font-mono)' }}>
            {t.loading}
        </div>
    )


    return (
        <div style={{ background: 'var(--bg-main)', color: 'var(--text-main)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
            
            {/* Page Header */}
            <div className="page-header" style={{ padding: '60px 0 50px 0' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 16px', background: 'rgba(201,168,76,0.15)',
                        border: '1px solid rgba(201,168,76,0.3)', borderRadius: '20px',
                        color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '12px',
                        letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px'
                    }}>
                        <Icons.Feather /> {t.label}
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', color: '#ffffff', fontWeight: '700', marginBottom: '12px' }}>
                        {t.h1a}<span style={{ color: '#C9A84C' }}>{t.h1b}</span>
                    </h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', maxWidth: '650px', lineHeight: 1.7 }}>
                        {t.desc}
                    </p>

                    {/* Search Bar */}
                    <div style={{ marginTop: '32px', maxWidth: '600px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#C9A84C' }}>
                            <Icons.Search />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            style={{
                                width: '100%',
                                padding: '16px 20px 16px 48px',
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px',
                                color: 'var(--text-main)',
                                fontSize: '15px',
                                outline: 'none',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Region Filters Bar */}
            <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '16px 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {t.filterRegion}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {regions.map(region => (
                            <button
                                key={region}
                                onClick={() => setSelectedRegion(region)}
                                style={{
                                    padding: '6px 16px',
                                    background: selectedRegion === region ? '#C9A84C' : 'var(--bg-card)',
                                    color: selectedRegion === region ? '#060d17' : 'var(--text-main)',
                                    border: '1px solid',
                                    borderColor: selectedRegion === region ? '#C9A84C' : 'var(--border-color)',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: selectedRegion === region ? '700' : '400',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>
            </div>



            {/* Main Grid View of All Jadids */}
            <section style={{ padding: '40px 0' }}>
                <div className="container">
                    {filteredFigures.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {t.empty}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {filteredFigures.map(jadid => (
                                <Link
                                    key={jadid.id}
                                    href={`/${locale}/jadidlar/${jadid.id}`}
                                    style={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '10px',
                                        padding: '28px',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                        transition: 'all 0.3s ease',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#C9A84C'
                                        e.currentTarget.style.transform = 'translateY(-4px)'
                                        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--border-color)'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                    }}
                                >
                                    <div>
                                        {/* Avatar & Region */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            {jadid.imageUrl ? (
                                                <img src={jadid.imageUrl} alt={jadid.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.4)' }} />
                                            ) : (
                                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C' }}>
                                                    <Icons.Feather />
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

                                        {/* Name & Years */}
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text-heading)', fontWeight: '700', marginBottom: '4px' }}>
                                            {jadid.name}
                                        </h3>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', marginBottom: '12px' }}>
                                            {jadid.years}
                                        </div>

                                        {/* Bio Snippet */}
                                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {jadid.bio}
                                        </p>
                                    </div>

                                    {/* Action link */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        paddingTop: '16px', borderTop: '1px solid var(--border-subtle)',
                                        fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#C9A84C', fontWeight: '600'
                                    }}>
                                        <span>{t.explore}</span>
                                        <Icons.ArrowRight />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}