'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { figureService } from '@/lib/services'
import { HistoricalFigure } from '@/lib/api'

const Icons = {
    Pen: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
    ),
    Person: () => (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    ),
    Download: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    ),
    X: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
}

export default function JadidlarPage() {
    const locale = useLocale()
    const [figures, setFigures] = useState<HistoricalFigure[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<HistoricalFigure | null>(null)

    useEffect(() => {
        figureService.getAll(locale)
            .then(data => setFigures(data))
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [locale])

    const featured = figures.find(f => f.featured)
    const others = figures.filter(f => !f.featured)

    const t = {
        label: locale === 'ru' ? 'Просветители' : locale === 'en' ? 'Enlighteners' : "Ma'rifatparvarlar",
        h1a: locale === 'ru' ? 'Узбекские ' : locale === 'en' ? 'Uzbek ' : "O'zbek ",
        h1b: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlari',
        desc: locale === 'ru' ? 'Выдающиеся узбекские просветители XIX–XX веков.' : locale === 'en' ? 'Outstanding Uzbek enlighteners of the 19th–20th centuries.' : "XIX–XX asr buyuk o'zbek jadidlari.",
        works: locale === 'ru' ? 'Основные произведения' : locale === 'en' ? 'Key works' : "Asosiy asarlar",
        readMore: locale === 'ru' ? 'Подробнее' : locale === 'en' ? 'More details' : 'Batafsil',
        close: locale === 'ru' ? 'Закрыть' : locale === 'en' ? 'Close' : 'Yopish',
        download: locale === 'ru' ? 'Скачать PDF' : locale === 'en' ? 'Download PDF' : 'PDF yuklab olish',
        central: locale === 'ru' ? 'Центральная фигура' : locale === 'en' ? 'Central figure' : 'Markaziy shaxs',
        others: locale === 'ru' ? 'Другие представители' : locale === 'en' ? 'Other representatives' : 'Boshqa namoyandalar',
        loading: locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...',
        empty: locale === 'ru' ? 'Пока нет данных' : locale === 'en' ? 'No data yet' : "Hali ma'lumot yo'q",
    }

    const worksToArray = (works: string) => {
        if (!works) return []
        return works.split(',').map(w => w.trim()).filter(w => w.length > 0)
    }

    if (loading) return (
        <>
            <div className="page-header" style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #2d1a00 50%, #3d2a00 100%)' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><Icons.Pen /> {t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                </div>
            </div>
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>{t.loading}</div>
        </>
    )

    return (
        <>
            <div className="page-header" style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #2d1a00 50%, #3d2a00 100%)' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label" style={{ background: 'rgba(201,168,76,0.15)', borderColor: 'rgba(201,168,76,0.3)' }}>
                        <Icons.Pen /> {t.label}
                    </div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            {figures.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>{t.empty}</div>
            ) : (
                <>
                    {/* Featured shaxs */}
                    {featured && (
                        <section style={{ background: 'var(--off-white)', padding: '72px 0' }}>
                            <div className="container">
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                                    {t.central}
                                </div>
                                <div className="grid-featured" style={{ background: '#fff', border: '1px solid rgba(27,58,107,0.08)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(27,58,107,0.1)' }}>
                                    <div style={{ background: 'linear-gradient(160deg, #1B3A6B, #254d8f)', minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px' }}>
                                        {featured.imageUrl ? (
                                            <img src={featured.imageUrl} alt={featured.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(201,168,76,0.4)' }} />
                                        ) : (
                                            <div style={{ color: 'rgba(255,255,255,0.4)' }}><Icons.Person /></div>
                                        )}
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#fff', textAlign: 'center' }}>{featured.name}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#C9A84C' }}>{featured.years}</div>
                                    </div>
                                    <div style={{ padding: 'clamp(24px, 3vw, 40px)' }}>
                                        {featured.title && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>{featured.title}</div>}
                                        <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', marginBottom: '20px', color: 'var(--navy-dark)' }}>{featured.name}</h2>
                                        <div style={{ width: '40px', height: '2px', background: 'var(--gold)', marginBottom: '20px' }} />
                                        <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '24px' }}>{featured.bio}</p>
                                        {worksToArray(featured.works).length > 0 && (
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>{t.works}</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {worksToArray(featured.works).map((w, i) => (
                                                        <span key={i} style={{ background: 'rgba(27,58,107,0.06)', border: '1px solid rgba(27,58,107,0.12)', borderRadius: '2px', padding: '5px 12px', fontSize: '13px', color: 'var(--navy-dark)', fontFamily: 'var(--font-mono)' }}>{w}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {featured.pdfUrl && (
                                            <a href={featured.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: '20px', display: 'inline-flex', textDecoration: 'none' }}>
                                                <Icons.Download /> {t.download}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Boshqa jadidlar */}
                    {others.length > 0 && (
                        <section style={{ background: '#060f1e', padding: '72px 0' }}>
                            <div className="container">
                                <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>
                                        {t.others}
                                    </div>
                                    <h2 style={{ color: '#fff', fontSize: 'clamp(26px, 3vw, 36px)' }}>{t.h1a}<span style={{ color: '#C9A84C' }}>{t.h1b}</span></h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                    {others.map(jadid => (
                                        <div key={jadid.id} onClick={() => setSelected(jadid)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: 'clamp(20px, 3vw, 32px)', cursor: 'pointer', transition: 'all 0.3s' }}
                                             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                                             onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
                                        >
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                <div style={{ width: '52px', height: '52px', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #1B3A6B, rgba(201,168,76,0.2))' }}>
                                                    {jadid.imageUrl ? (
                                                        <img src={jadid.imageUrl} alt={jadid.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '20px' }}>?</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', marginBottom: '4px' }}>{jadid.name}</h3>
                                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C' }}>{jadid.years}</div>
                                                </div>
                                            </div>
                                            {jadid.title && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{jadid.title}</div>}
                                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', marginBottom: '16px' }}>
                                                {jadid.bio && jadid.bio.length > 150 ? jadid.bio.substring(0, 150) + '...' : jadid.bio}
                                            </p>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C', letterSpacing: '2px' }}>{t.readMore} →</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* Modal */}
            {selected && (
                <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(8px)' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '4px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ background: 'linear-gradient(135deg, #1B3A6B, #254d8f)', padding: 'clamp(24px, 3vw, 40px)', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                            {selected.imageUrl ? (
                                <img src={selected.imageUrl} alt={selected.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.4)', flexShrink: 0 }} />
                            ) : (
                                <div style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}><Icons.Person /></div>
                            )}
                            <div style={{ minWidth: '200px' }}>
                                {selected.title && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '2px', marginBottom: '8px' }}>{selected.title}</div>}
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 26px)', color: '#fff', marginBottom: '8px' }}>{selected.name}</h2>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{selected.years}</div>
                            </div>
                        </div>
                        <div style={{ padding: 'clamp(24px, 3vw, 36px) clamp(24px, 3vw, 40px)' }}>
                            <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '32px' }}>{selected.bio}</p>
                            {worksToArray(selected.works).length > 0 && (
                                <>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '14px' }}>{t.works}</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                                        {worksToArray(selected.works).map((w, i) => (
                                            <span key={i} style={{ background: 'rgba(27,58,107,0.06)', border: '1px solid rgba(27,58,107,0.12)', borderRadius: '2px', padding: '6px 14px', fontSize: '13px', color: 'var(--navy-dark)', fontFamily: 'var(--font-mono)' }}>{w}</span>
                                        ))}
                                    </div>
                                </>
                            )}
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {selected.pdfUrl && (
                                    <a href={selected.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                                        <Icons.Download /> {t.download}
                                    </a>
                                )}
                                <button onClick={() => setSelected(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--navy-dark)', color: '#fff', border: 'none', borderRadius: '2px', fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                                    {t.close} <Icons.X />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
