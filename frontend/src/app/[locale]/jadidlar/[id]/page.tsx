'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { figureService } from '@/lib/services'
import { HistoricalFigure } from '@/lib/api'

// Modernized Vector SVG Icons
const Icons = {
    ArrowLeft: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
        </svg>
    ),
    Book: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
    ),
    Clock: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
    ),
    Image: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    Quote: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
        </svg>
    ),
    Download: () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    ),
    MapPin: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
    ),
    User: () => (
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    )
}

export default function JadidDetailPage() {
    const params = useParams()
    const locale = useLocale()
    const figureId = Number(params?.id)

    const [figure, setFigure] = useState<HistoricalFigure | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'bio' | 'works' | 'gallery' | 'quotes'>('bio')

    useEffect(() => {
        if (!figureId) return
        setLoading(true)
        figureService.getById(figureId, locale)
            .then(data => setFigure(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [figureId, locale])

    const labels = {
        back: locale === 'ru' ? 'Ко всем джадидам' : locale === 'en' ? 'Back to all Jadids' : 'Barcha jadidlarga qaytish',
        bioTab: locale === 'ru' ? 'Биография и Путь' : locale === 'en' ? 'Biography & Timeline' : 'Tarjimai hol va Vaqt shajarasi',
        worksTab: locale === 'ru' ? 'Труды и Книги' : locale === 'en' ? 'Works & Books' : 'Ilmiy va Adabiy meros',
        galleryTab: locale === 'ru' ? 'Фотоархив' : locale === 'en' ? 'Photo Archive' : 'Foto va Hujjatlar arxivi',
        quotesTab: locale === 'ru' ? 'Цитаты и Мысли' : locale === 'en' ? 'Quotes & Philosophy' : 'Hikmatli so\'zlar',
        years: locale === 'ru' ? 'Годы жизни' : locale === 'en' ? 'Life span' : 'Yashagan yillari',
        region: locale === 'ru' ? 'Регион' : locale === 'en' ? 'Region' : 'Harakat markazi',
        download: locale === 'ru' ? 'Скачать PDF' : locale === 'en' ? 'Download PDF' : 'PDF yuklab olish',
        noWorks: locale === 'ru' ? 'Труды загружаются...' : locale === 'en' ? 'Works loading...' : 'Asarlar ro\'yxati tayyorlanmoqda...',
        notFound: locale === 'ru' ? 'Джадид не найден' : locale === 'en' ? 'Jadid not found' : 'Jadid ma\'lumoti topilmadi',
        loading: locale === 'ru' ? 'Загрузка профиля...' : locale === 'en' ? 'Loading profile...' : 'Jadid sahifasi yuklanmoqda...',
    }

    if (loading) {
        return (
            <div style={{ minHeight: '70vh', background: '#0a1829', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontFamily: 'var(--font-mono)' }}>
                {labels.loading}
            </div>
        )
    }

    if (!figure) {
        return (
            <div style={{ minHeight: '70vh', background: '#0a1829', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <h2>{labels.notFound}</h2>
                <Link href={`/${locale}/jadidlar`} style={{ marginTop: '20px', color: '#C9A84C', textDecoration: 'none' }}>
                    ← {labels.back}
                </Link>
            </div>
        )
    }

    return (
        <div style={{ background: '#060d17', color: '#e2e8f0', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
            
            {/* Navigation back button */}
            <div className="container" style={{ marginBottom: '24px' }}>
                <Link href={`/${locale}/jadidlar`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'rgba(201,168,76,0.9)', textDecoration: 'none',
                    fontFamily: 'var(--font-mono)', fontSize: '13px',
                    padding: '8px 16px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px',
                    transition: 'all 0.2s ease'
                }}>
                    <Icons.ArrowLeft /> {labels.back}
                </Link>
            </div>

            {/* Profile Hero Header */}
            <div className="container" style={{ marginBottom: '40px' }}>
                <div style={{
                    background: 'linear-gradient(145deg, #0e2238 0%, #163252 100%)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    borderRadius: '16px',
                    padding: '40px',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(200px, 260px) 1fr',
                    gap: '40px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Background glow decoration */}
                    <div style={{
                        position: 'absolute', top: '-100px', right: '-100px',
                        width: '300px', height: '300px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }} />

                    {/* Portrait Image */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '220px', height: '260px',
                            margin: '0 auto',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '3px solid rgba(201,168,76,0.4)',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                            background: '#0a1829',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {figure.imageUrl ? (
                                <img src={figure.imageUrl} alt={figure.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ color: 'rgba(255,255,255,0.3)' }}><Icons.User /></div>
                            )}
                        </div>
                        {figure.years && (
                            <div style={{
                                marginTop: '16px',
                                display: 'inline-block',
                                padding: '6px 16px',
                                background: 'rgba(201,168,76,0.15)',
                                border: '1px solid rgba(201,168,76,0.3)',
                                borderRadius: '20px',
                                color: '#C9A84C',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}>
                                ⏳ {figure.years}
                            </div>
                        )}
                    </div>

                    {/* Info Side */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {figure.region && (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                color: '#C9A84C', fontFamily: 'var(--font-mono)',
                                fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                                marginBottom: '12px'
                            }}>
                                <Icons.MapPin /> {figure.region} Jadidchilik Harakati
                            </div>
                        )}
                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '38px', fontWeight: '700',
                            color: '#ffffff', lineHeight: 1.15,
                            marginBottom: '12px'
                        }}>
                            {figure.name}
                        </h1>

                        {figure.title && (
                            <div style={{
                                fontSize: '16px', color: 'rgba(201,168,76,0.9)',
                                fontFamily: 'var(--font-body)', fontWeight: '500',
                                marginBottom: '20px'
                            }}>
                                {figure.title}
                            </div>
                        )}

                        {figure.quote && (
                            <div style={{
                                background: 'rgba(10,24,41,0.6)',
                                borderLeft: '4px solid #C9A84C',
                                padding: '16px 20px',
                                borderRadius: '0 8px 8px 0',
                                fontStyle: 'italic',
                                fontSize: '15px',
                                color: 'rgba(255,255,255,0.9)',
                                marginBottom: '24px',
                                lineHeight: 1.7
                            }}>
                                &ldquo;{figure.quote}&rdquo;
                            </div>
                        )}

                        <p style={{
                            fontSize: '15px', lineHeight: '1.85',
                            color: 'rgba(255,255,255,0.75)',
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                            {figure.bio}
                        </p>
                    </div>
                </div>
            </div>

            {/* Structure Tabs */}
            <div className="container" style={{ marginBottom: '32px' }}>
                <div style={{
                    display: 'flex', gap: '8px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    paddingBottom: '12px',
                    overflowX: 'auto'
                }}>
                    {[
                        { id: 'bio', label: labels.bioTab, icon: <Icons.Clock /> },
                        { id: 'works', label: labels.worksTab, icon: <Icons.Book /> },
                        { id: 'gallery', label: labels.galleryTab, icon: <Icons.Image /> },
                        { id: 'quotes', label: labels.quotesTab, icon: <Icons.Quote /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 24px',
                                background: activeTab === tab.id ? 'rgba(201,168,76,0.15)' : 'transparent',
                                border: '1px solid',
                                borderColor: activeTab === tab.id ? 'rgba(201,168,76,0.4)' : 'transparent',
                                borderRadius: '8px',
                                color: activeTab === tab.id ? '#C9A84C' : 'rgba(255,255,255,0.6)',
                                fontFamily: 'var(--font-display)',
                                fontWeight: activeTab === tab.id ? '600' : '400',
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content Container */}
            <div className="container">
                
                {/* 1. Biography & Timeline */}
                {activeTab === 'bio' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
                        
                        {/* Biography text */}
                        <div style={{
                            background: 'rgba(15,28,45,0.7)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px', padding: '36px'
                        }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                📖 {labels.bioTab}
                            </h3>
                            <div style={{ fontSize: '16px', lineHeight: '1.9', color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-line' }}>
                                {figure.bio}
                            </div>
                        </div>

                        {/* Timeline */}
                        {figure.timeline && figure.timeline.length > 0 && (
                            <div style={{
                                background: 'rgba(15,28,45,0.7)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px', padding: '36px'
                            }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', marginBottom: '28px' }}>
                                    ⏳ Hayot yo'li va bosqichlari
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                                    {figure.timeline.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                            <div style={{
                                                padding: '6px 14px', background: 'rgba(201,168,76,0.15)',
                                                border: '1px solid rgba(201,168,76,0.3)', borderRadius: '6px',
                                                color: '#C9A84C', fontFamily: 'var(--font-mono)', fontWeight: '700',
                                                fontSize: '14px', minWidth: '70px', textAlign: 'center'
                                            }}>
                                                {item.year}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: '17px', color: '#fff', fontWeight: '600', marginBottom: '4px' }}>
                                                    {item.title}
                                                </h4>
                                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Literary & Scientific Heritage (Works) */}
                {activeTab === 'works' && (
                    <div style={{
                        background: 'rgba(15,28,45,0.7)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px', padding: '36px'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            📚 {labels.worksTab}
                        </h3>

                        {(!figure.figureWorks || figure.figureWorks.length === 0) ? (
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>{labels.noWorks}</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                {figure.figureWorks.map(work => (
                                    <div key={work.id} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '10px',
                                        padding: '24px',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '24px' }}>📗</span>
                                                {work.year && (
                                                    <span style={{
                                                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                                                        color: '#C9A84C', background: 'rgba(201,168,76,0.1)',
                                                        padding: '3px 8px', borderRadius: '4px'
                                                    }}>
                                                        {work.year}-yil
                                                    </span>
                                                )}
                                            </div>
                                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', marginBottom: '8px' }}>
                                                {work.title}
                                            </h4>
                                        </div>

                                        <div style={{ marginTop: '20px' }}>
                                            <a
                                                href={work.pdfUrl || figure.pdfUrl || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                    padding: '10px 18px', background: '#C9A84C',
                                                    color: '#060d17', borderRadius: '6px',
                                                    fontFamily: 'var(--font-mono)', fontSize: '13px',
                                                    fontWeight: '700', textDecoration: 'none',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <Icons.Download /> {labels.download}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Photo & Document Archive */}
                {activeTab === 'gallery' && (
                    <div style={{
                        background: 'rgba(15,28,45,0.7)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px', padding: '36px'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🖼️ {labels.galleryTab}
                        </h3>

                        {(!figure.galleryPhotos || figure.galleryPhotos.length === 0) ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(201,168,76,0.3)', borderRadius: '10px', padding: '30px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>{figure.name} surati va qo'lyazmalari</p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {figure.galleryPhotos.map((photo, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '10px', overflow: 'hidden'
                                    }}>
                                        <div style={{ height: '200px', background: '#0a1829', overflow: 'hidden' }}>
                                            <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ padding: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
                                            {photo.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. Quotes & Philosophy */}
                {activeTab === 'quotes' && (
                    <div style={{
                        background: 'rgba(15,28,45,0.7)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px', padding: '36px'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            💬 {labels.quotesTab}
                        </h3>

                        <div style={{
                            background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(10,24,41,0.4) 100%)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            borderRadius: '12px', padding: '32px', position: 'relative'
                        }}>
                            <div style={{ fontSize: '48px', color: 'rgba(201,168,76,0.4)', position: 'absolute', top: '16px', left: '20px', fontFamily: 'serif' }}>&ldquo;</div>
                            <p style={{
                                fontFamily: 'var(--font-display)', fontSize: '20px', fontStyle: 'italic',
                                color: '#ffffff', lineHeight: '1.8', paddingLeft: '24px', position: 'relative', zIndex: 1
                            }}>
                                {figure.quote || "Har bir millat o'z tilida va o'z ma'rifati bilan yashaydi."}
                            </p>
                            <div style={{ textAlign: 'right', marginTop: '16px', color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: '600' }}>
                                — {figure.name}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
