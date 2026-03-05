'use client'
import { useState, useEffect } from 'react'
import { galleryService } from '@/lib/services'
import { GalleryItem } from '@/lib/api'

const MEDIA_TYPES = [
    { value: '', label: 'Barchasi' },
    { value: 'PHOTO', label: '🖼️ Rasmlar' },
    { value: 'VIDEO', label: '🎥 Videolar' },
    { value: 'AUDIO', label: '🎵 Audio' },
]

export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [mediaType, setMediaType] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [selected, setSelected] = useState<GalleryItem | null>(null)

    useEffect(() => {
        fetchItems()
    }, [mediaType, page])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const data = await galleryService.getAll(page, 12, mediaType || undefined)
            setItems(data.content)
            setTotalPages(data.totalPages)
        } catch {
            console.error('Galereya yuklanmadi')
        } finally {
            setLoading(false)
        }
    }

    const handleTypeChange = (type: string) => {
        setMediaType(type)
        setPage(0)
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><span>🖼️</span> Ko'rgazma</div>
                    <h1>Muzey <span>Galereyasi</span></h1>
                    <p>Rasmlar, videolar va audio materiallar to'plami</p>
                </div>
            </div>

            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">

                    {/* Filter */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
                        {MEDIA_TYPES.map(t => (
                            <button
                                key={t.value}
                                onClick={() => handleTypeChange(t.value)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    border: '1px solid',
                                    borderColor: mediaType === t.value ? 'var(--gold)' : 'rgba(27,58,107,0.2)',
                                    background: mediaType === t.value ? 'var(--gold)' : '#fff',
                                    color: mediaType === t.value ? 'var(--navy-dark)' : 'var(--gray-600)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    letterSpacing: '1px',
                                }}
                            >{t.label}</button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>
                            Yuklanmoqda...
                        </div>
                    ) : items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</div>
                            <p>Bu bo'limda hali materiallar yo'q</p>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '20px',
                            }}>
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className="card"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelected(item)}
                                    >
                                        <div style={{
                                            height: '220px',
                                            background: item.thumbnailUrl || item.fileUrl
                                                ? `url(${item.thumbnailUrl || item.fileUrl}) center/cover`
                                                : 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}>
                                            {!item.thumbnailUrl && !item.fileUrl && (
                                                <div style={{ fontSize: '40px' }}>
                                                    {item.mediaType === 'VIDEO' ? '🎥' : item.mediaType === 'AUDIO' ? '🎵' : '🖼️'}
                                                </div>
                                            )}
                                            {item.mediaType === 'VIDEO' && (
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: 'rgba(0,0,0,0.3)',
                                                }}>
                                                    <div style={{
                                                        width: '52px',
                                                        height: '52px',
                                                        background: 'rgba(255,255,255,0.9)',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '20px',
                                                    }}>▶</div>
                                                </div>
                                            )}
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: 'rgba(0,0,0,0.5)',
                                                color: '#fff',
                                                padding: '3px 8px',
                                                borderRadius: '10px',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '10px',
                                                letterSpacing: '1px',
                                            }}>{item.mediaType}</div>
                                        </div>
                                        <div style={{ padding: '16px 20px' }}>
                                            <h3 style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '16px',
                                                color: 'var(--navy-dark)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>{item.title}</h3>
                                            {item.description && (
                                                <p style={{
                                                    fontSize: '13px',
                                                    color: 'var(--gray-600)',
                                                    marginTop: '6px',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}>{item.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                                    <button
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                        disabled={page === 0}
                                        style={{
                                            padding: '10px 20px',
                                            border: '1px solid rgba(27,58,107,0.2)',
                                            borderRadius: '8px',
                                            background: '#fff',
                                            color: page === 0 ? 'var(--gray-400)' : 'var(--navy)',
                                            cursor: page === 0 ? 'not-allowed' : 'pointer',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '13px',
                                        }}
                                    >← Oldingi</button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i)}
                                            style={{
                                                padding: '10px 16px',
                                                border: '1px solid',
                                                borderColor: page === i ? 'var(--gold)' : 'rgba(27,58,107,0.2)',
                                                borderRadius: '8px',
                                                background: page === i ? 'var(--gold)' : '#fff',
                                                color: page === i ? 'var(--navy-dark)' : 'var(--navy)',
                                                cursor: 'pointer',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '13px',
                                            }}
                                        >{i + 1}</button>
                                    ))}
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                        disabled={page === totalPages - 1}
                                        style={{
                                            padding: '10px 20px',
                                            border: '1px solid rgba(27,58,107,0.2)',
                                            borderRadius: '8px',
                                            background: '#fff',
                                            color: page === totalPages - 1 ? 'var(--gray-400)' : 'var(--navy)',
                                            cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '13px',
                                        }}
                                    >Keyingi →</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {selected && (
                <div
                    onClick={() => setSelected(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.9)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'var(--navy-dark)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            maxWidth: '900px',
                            width: '100%',
                            maxHeight: '90vh',
                        }}
                    >
                        {selected.mediaType === 'PHOTO' && (
                            <img
                                src={selected.fileUrl}
                                alt={selected.title}
                                style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', background: '#000' }}
                            />
                        )}
                        {selected.mediaType === 'VIDEO' && (
                            <video
                                src={selected.fileUrl}
                                controls
                                style={{ width: '100%', maxHeight: '60vh' }}
                            />
                        )}
                        {selected.mediaType === 'AUDIO' && (
                            <div style={{ padding: '40px', textAlign: 'center' }}>
                                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎵</div>
                                <audio src={selected.fileUrl} controls style={{ width: '100%' }} />
                            </div>
                        )}
                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', marginBottom: '8px' }}>
                                {selected.title}
                            </h3>
                            {selected.description && (
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>{selected.description}</p>
                            )}
                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    marginTop: '16px',
                                    padding: '10px 24px',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '13px',
                                }}
                            >Yopish ✕</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}