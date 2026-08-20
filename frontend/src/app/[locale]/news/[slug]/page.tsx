'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

const Icons = {
    Calendar: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    ),
    User: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    Inbox: () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
        </svg>
    ),
}

function formatDate(dateStr: string, locale: string) {
    const date = new Date(dateStr)
    const months = {
        uz: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
        ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    }
    const m = months[locale as keyof typeof months] || months.uz
    if (locale === 'ru') return `${date.getDate()} ${m[date.getMonth()]}, ${date.getFullYear()}`
    if (locale === 'en') return `${m[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    return `${date.getDate()}-${m[date.getMonth()]}, ${date.getFullYear()}`
}

interface GalleryPhoto {
    url: string;
    caption?: string;
}

export default function NewsDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const locale = useLocale()
    const [news, setNews] = useState<NewsItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true); setNotFound(false)
            try {
                const data = await newsService.getBySlug(slug, locale)
                setNews(data)
            } catch { setNotFound(true) }
            finally { setLoading(false) }
        }
        if (slug) fetchNews()
    }, [slug, locale])

    // Keyboard navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null || !news?.galleryPhotosJson) return
            let photos: GalleryPhoto[] = []
            try {
                const parsed = JSON.parse(news.galleryPhotosJson)
                if (Array.isArray(parsed)) photos = parsed.map((p: any) => typeof p === 'string' ? { url: p } : p)
            } catch {}

            if (e.key === 'Escape') setLightboxIndex(null)
            if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
            if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [lightboxIndex, news])

    const t = {
        back: locale === 'ru' ? '← Назад к новостям' : locale === 'en' ? '← Back to news' : '← Yangiliklarga qaytish',
        all: locale === 'ru' ? '← Все материалы' : locale === 'en' ? '← All materials' : '← Barcha materiallar',
        notFound: locale === 'ru' ? 'Материал не найден' : locale === 'en' ? 'Article not found' : 'Material topilmadi',
        loading: locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...',
        galleryTitle: locale === 'ru' ? 'Фотогалерея' : locale === 'en' ? 'Photo Gallery Album' : 'Fotogalereya to\'plami',
        galleryDesc: locale === 'ru' ? 'Нажмите на фото для просмотра в полном размере' : locale === 'en' ? 'Click on any photo to view full size' : 'Rasmni to\'liq hajmda ko\'rish uchun ustiga bosing',
        announcementNotice: locale === 'ru' ? 'Официальное объявление' : locale === 'en' ? 'Official Announcement' : "Rasmiy E'lon / Xabarnoma",
    }

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' }}>
            {t.loading}
        </div>
    )

    if (notFound || !news) return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ color: 'var(--gray-400)', opacity: 0.5 }}><Icons.Inbox /></div>
            <p style={{ color: 'var(--gray-600)' }}>{t.notFound}</p>
            <Link href={`/${locale}/news`} className="btn-primary">{t.back}</Link>
        </div>
    )

    let galleryPhotos: GalleryPhoto[] = []
    if (news.galleryPhotosJson) {
        try {
            const parsed = JSON.parse(news.galleryPhotosJson)
            if (Array.isArray(parsed)) {
                galleryPhotos = parsed.map((p: any) => typeof p === 'string' ? { url: p, caption: '' } : { url: p.url || '', caption: p.caption || '' })
            }
        } catch {}
    }

    const getCategoryBadge = (cat: string) => {
        switch (cat) {
            case 'FOTOGALEREYA':
                return { label: locale === 'ru' ? 'Фотогалерея' : locale === 'en' ? 'Photo Gallery' : 'Fotogalereya', bg: 'rgba(59,130,246,0.2)', color: '#60a5fa', icon: '🖼️' }
            case 'ELON':
                return { label: locale === 'ru' ? 'Объявление' : locale === 'en' ? 'Announcement' : "E'lon", bg: 'rgba(234,88,12,0.2)', color: '#fb923c', icon: '📢' }
            case 'TADBIR':
                return { label: locale === 'ru' ? 'Мероприятие' : locale === 'en' ? 'Event' : 'Tadbir', bg: 'rgba(168,85,247,0.2)', color: '#c084fc', icon: '📅' }
            case 'YANGILIK':
            default:
                return { label: locale === 'ru' ? 'Новость' : locale === 'en' ? 'News' : 'Yangilik', bg: 'rgba(201,168,76,0.2)', color: '#C9A84C', icon: '📰' }
        }
    }

    const catBadge = getCategoryBadge(news.category)

    return (
        <>
            <div style={{
                background: news.imageUrl
                    ? `linear-gradient(to bottom, rgba(3,18,13,0.85), rgba(8,36,27,0.98)), url(${news.imageUrl}) center/cover`
                    : 'linear-gradient(135deg, #03120d, #08241b)',
                padding: '120px 0 60px',
                borderBottom: '1px solid rgba(201,168,76,0.2)'
            }}>
                <div className="container" style={{ maxWidth: '860px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <Link href={`/${locale}/news`} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', textDecoration: 'none' }}>
                            {t.back}
                        </Link>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: catBadge.bg, color: catBadge.color, fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', padding: '6px 14px', borderRadius: '8px', marginBottom: '20px', fontWeight: '700' }}>
                        <span>{catBadge.icon}</span>
                        <span>{catBadge.label}</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', lineHeight: '1.25', marginBottom: '20px' }}>
                        {news.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icons.Calendar /> {formatDate(news.createdAt, locale)}
                        </span>
                        {news.authorUsername && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Icons.User /> {news.authorUsername}
                            </span>
                        )}
                        {galleryPhotos.length > 0 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa' }}>
                                📷 {galleryPhotos.length} ta fotosurat
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <section style={{ background: 'var(--bg-main)', padding: '60px 0' }}>
                <div className="container" style={{ maxWidth: '860px' }}>
                    {/* Announcement Callout if category is ELON */}
                    {news.category === 'ELON' && (
                        <div style={{ background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.35)', borderLeft: '5px solid #ea580c', borderRadius: '8px', padding: '16px 20px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '24px' }}>📢</span>
                            <div>
                                <h4 style={{ fontSize: '15px', color: '#ea580c', fontWeight: '700', marginBottom: '2px', fontFamily: 'var(--font-display)' }}>
                                    {t.announcementNotice}
                                </h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                    Ushbu xabar Abdulla Avloniy nomidagi milliy-pedagogik mahorat instituti va Jadidlar merosi muzeyi rasmiy e'lonidir.
                                </p>
                            </div>
                        </div>
                    )}

                    {news.excerpt && (
                        <p style={{ fontSize: '19px', color: 'var(--text-heading)', lineHeight: '1.8', fontStyle: 'italic', borderLeft: '4px solid var(--gold)', paddingLeft: '24px', marginBottom: '36px' }}>
                            {news.excerpt}
                        </p>
                    )}

                    {/* Main News Content */}
                    <div className="news-content" dangerouslySetInnerHTML={{ __html: news.content }} />

                    {/* Fotogalereya Multi-Photo Gallery Grid */}
                    {galleryPhotos.length > 0 && (
                        <div style={{ marginTop: '50px', paddingTop: '36px', borderTop: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-heading)', marginBottom: '4px' }}>
                                        🖼️ {t.galleryTitle} ({galleryPhotos.length})
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.galleryDesc}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                                {galleryPhotos.map((photo, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setLightboxIndex(idx)}
                                        style={{
                                            position: 'relative',
                                            height: '180px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-card)',
                                            boxShadow: 'var(--shadow-sm)',
                                            transition: 'transform 0.25s, box-shadow 0.25s',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.02)'
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)'
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                        }}
                                    >
                                        <img src={photo.url} alt={photo.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            padding: '12px',
                                            opacity: photo.caption ? 1 : 0.8
                                        }}>
                                            <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'var(--font-mono)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                                                {photo.caption || `Foto #${idx + 1}`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <Link href={`/${locale}/news`} className="btn-outline">{t.all}</Link>
                    </div>
                </div>
            </section>

            {/* LIGHTBOX MODAL */}
            {lightboxIndex !== null && galleryPhotos[lightboxIndex] && (
                <div
                    onClick={() => setLightboxIndex(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: 'rgba(3, 10, 8, 0.95)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setLightboxIndex(null)}
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            fontSize: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10001
                        }}
                    >
                        ✕
                    </button>

                    {/* Prev Button */}
                    {galleryPhotos.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : galleryPhotos.length - 1))
                            }}
                            style={{
                                position: 'absolute',
                                left: '24px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: '#fff',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                fontSize: '20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10001
                            }}
                        >
                            ‹
                        </button>
                    )}

                    {/* Main Image in Lightbox */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <img
                            src={galleryPhotos[lightboxIndex].url}
                            alt=""
                            style={{
                                maxWidth: '100%',
                                maxHeight: '75vh',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        />
                        <div style={{ marginTop: '14px', textAlign: 'center' }}>
                            {galleryPhotos[lightboxIndex].caption && (
                                <p style={{ color: '#fff', fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
                                    {galleryPhotos[lightboxIndex].caption}
                                </p>
                            )}
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                {lightboxIndex + 1} / {galleryPhotos.length}
                            </span>
                        </div>
                    </div>

                    {/* Next Button */}
                    {galleryPhotos.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setLightboxIndex(prev => (prev !== null && prev < galleryPhotos.length - 1 ? prev + 1 : 0))
                            }}
                            style={{
                                position: 'absolute',
                                right: '24px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: '#fff',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                fontSize: '20px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10001
                            }}
                        >
                            ›
                        </button>
                    )}
                </div>
            )}

            <style>{`
                .news-content { font-size: 17px; color: var(--text-main); line-height: 1.9; }
                .news-content p { margin-bottom: 20px; }
                .news-content h1, .news-content h2, .news-content h3 { font-family: var(--font-display); color: var(--text-heading); margin: 32px 0 16px; }
                .news-content ul, .news-content ol { padding-left: 24px; margin-bottom: 20px; }
                .news-content li { margin-bottom: 8px; }
                .news-content img { max-width: 100%; border-radius: 6px; margin: 24px 0; }
                .news-content a { color: var(--gold); text-decoration: underline; }
                .news-content blockquote { border-left: 4px solid var(--gold); padding-left: 20px; font-style: italic; color: var(--text-heading); margin: 24px 0; }
                .news-content span[style*="background-color: rgb(255, 255, 255)"] { background-color: transparent !important; }
                .news-content span[style*="color: rgb(0, 0, 0)"] { color: inherit !important; }
            `}</style>
        </>
    )
}