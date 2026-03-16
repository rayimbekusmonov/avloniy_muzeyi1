'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { galleryService } from '@/lib/services'
import { GalleryItem } from '@/lib/api'

const Icons = {
    Image: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    ImageLg: () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    Video: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
        </svg>
    ),
    VideoLg: () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
        </svg>
    ),
    Music: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
    ),
    MusicLg: () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
    ),
    Play: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
    ),
    X: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
}

export default function GalleryPage() {
    const locale = useLocale()
    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [mediaType, setMediaType] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [selected, setSelected] = useState<GalleryItem | null>(null)

    const MEDIA_TYPES = [
        { value: '', label: locale === 'ru' ? 'Все' : locale === 'en' ? 'All' : 'Barchasi' },
        { value: 'PHOTO', Icon: Icons.Image, label: locale === 'ru' ? 'Фото' : locale === 'en' ? 'Photos' : 'Rasmlar' },
        { value: 'VIDEO', Icon: Icons.Video, label: locale === 'ru' ? 'Видео' : locale === 'en' ? 'Videos' : 'Videolar' },
        { value: 'AUDIO', Icon: Icons.Music, label: locale === 'ru' ? 'Аудио' : locale === 'en' ? 'Audio' : 'Audio' },
    ]

    const t = {
        label: locale === 'ru' ? 'Выставка' : locale === 'en' ? 'Exhibition' : "Ko'rgazma",
        h1a: locale === 'ru' ? 'Галерея ' : locale === 'en' ? 'Museum ' : 'Muzey ',
        h1b: locale === 'ru' ? 'музея' : locale === 'en' ? 'Gallery' : 'Galereyasi',
        desc: locale === 'ru' ? 'Коллекция фотографий, видео и аудиоматериалов' : locale === 'en' ? 'Collection of photos, videos and audio materials' : "Rasmlar, videolar va audio materiallar to'plami",
        loading: locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...',
        empty: locale === 'ru' ? 'В этом разделе пока нет материалов' : locale === 'en' ? 'No materials yet' : "Bu bo'limda hali materiallar yo'q",
        close: locale === 'ru' ? 'Закрыть' : locale === 'en' ? 'Close' : 'Yopish',
        prev: locale === 'ru' ? '← Назад' : locale === 'en' ? '← Prev' : '← Oldingi',
        next: locale === 'ru' ? 'Вперёд →' : locale === 'en' ? 'Next →' : 'Keyingi →',
    }

    useEffect(() => { fetchItems() }, [mediaType, page])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const data = await galleryService.getAll(page, 12, mediaType || undefined)
            setItems(data.content); setTotalPages(data.totalPages)
        } catch { console.error('Gallery load failed') }
        finally { setLoading(false) }
    }

    const getPlaceholderIcon = (type: string) => {
        if (type === 'VIDEO') return <Icons.VideoLg />
        if (type === 'AUDIO') return <Icons.MusicLg />
        return <Icons.ImageLg />
    }

    return (
        <>
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><Icons.Image /> {t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
                        {MEDIA_TYPES.map(mt => (
                            <button key={mt.value} onClick={() => { setMediaType(mt.value); setPage(0) }} style={{
                                padding: '8px 20px', borderRadius: '20px', border: '1px solid',
                                borderColor: mediaType === mt.value ? 'var(--gold)' : 'rgba(27,58,107,0.2)',
                                background: mediaType === mt.value ? 'var(--gold)' : '#fff',
                                color: mediaType === mt.value ? 'var(--navy-dark)' : 'var(--gray-600)',
                                fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer',
                                transition: 'all 0.2s', letterSpacing: '1px',
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}>
                                {mt.Icon && <mt.Icon />}
                                {mt.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>{t.loading}</div>
                    ) : items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-400)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', opacity: 0.4 }}><Icons.ImageLg /></div>
                            <p style={{ color: 'var(--gray-600)' }}>{t.empty}</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {items.map(item => (
                                    <div key={item.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(item)}>
                                        <div style={{ height: '220px', background: item.thumbnailUrl || item.fileUrl ? `url(${item.thumbnailUrl || item.fileUrl}) center/cover` : 'linear-gradient(135deg, var(--navy-dark), var(--navy))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            {!item.thumbnailUrl && !item.fileUrl && (
                                                <div style={{ color: 'rgba(255,255,255,0.3)' }}>{getPlaceholderIcon(item.mediaType)}</div>
                                            )}
                                            {item.mediaType === 'VIDEO' && (
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                                                    <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy)' }}>
                                                        <Icons.Play />
                                                    </div>
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '3px 8px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px' }}>
                                                {item.mediaType}
                                            </div>
                                        </div>
                                        <div style={{ padding: '16px 20px' }}>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--navy-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                                            {item.description && <p style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ padding: '10px 20px', border: '1px solid rgba(27,58,107,0.2)', borderRadius: '8px', background: '#fff', color: page === 0 ? 'var(--gray-400)' : 'var(--navy)', cursor: page === 0 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{t.prev}</button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button key={i} onClick={() => setPage(i)} style={{ padding: '10px 16px', border: '1px solid', borderColor: page === i ? 'var(--gold)' : 'rgba(27,58,107,0.2)', borderRadius: '8px', background: page === i ? 'var(--gold)' : '#fff', color: page === i ? 'var(--navy-dark)' : 'var(--navy)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{i + 1}</button>
                                    ))}
                                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} style={{ padding: '10px 20px', border: '1px solid rgba(27,58,107,0.2)', borderRadius: '8px', background: '#fff', color: page === totalPages - 1 ? 'var(--gray-400)' : 'var(--navy)', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{t.next}</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {selected && (
                <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'var(--navy-dark)', borderRadius: '16px', overflow: 'hidden', maxWidth: '900px', width: '100%', maxHeight: '90vh' }}>
                        {selected.mediaType === 'PHOTO' && <img src={selected.fileUrl} alt={selected.title} style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', background: '#000' }} />}
                        {selected.mediaType === 'VIDEO' && <video src={selected.fileUrl} controls style={{ width: '100%', maxHeight: '60vh' }} />}
                        {selected.mediaType === 'AUDIO' && (
                            <div style={{ padding: '40px', textAlign: 'center' }}>
                                <div style={{ color: 'rgba(201,168,76,0.6)', display: 'flex', justifyContent: 'center', marginBottom: '24px' }}><Icons.MusicLg /></div>
                                <audio src={selected.fileUrl} controls style={{ width: '100%' }} />
                            </div>
                        )}
                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', marginBottom: '8px' }}>{selected.title}</h3>
                            {selected.description && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>{selected.description}</p>}
                            <button onClick={() => setSelected(null)} style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                                {t.close} <Icons.X />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}