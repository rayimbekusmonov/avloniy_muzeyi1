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
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    ),
    FileText: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
    ),
    X: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
    Book: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
}

// Asarlar ro'yxati komponenti
function WorksList({ works, locale }: {
    works: HistoricalFigure['figureWorks'],
    locale: string
}) {
    if (!works || works.length === 0) return null

    const label = locale === 'ru' ? 'Электронные произведения'
        : locale === 'en' ? 'Electronic works'
            : 'Elektron asarlar'

    const downloadLabel = locale === 'ru' ? 'Скачать'
        : locale === 'en' ? 'Download'
            : 'Yuklab olish'

    const yearSuffix = locale === 'uz' ? '-yil' : locale === 'ru' ? ' г.' : ''

    return (
        <div>
            <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                color: 'var(--gold)', letterSpacing: '3px',
                textTransform: 'uppercase', marginBottom: '14px',
                display: 'flex', alignItems: 'center', gap: '8px'
            }}>
                <Book16 />
                {label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {works.map(work => (
                    <a
                        key={work.id}
                        href={work.pdfUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '14px 18px',
                            background: 'rgba(27,58,107,0.03)',
                            border: '1px solid rgba(27,58,107,0.1)',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            cursor: work.pdfUrl ? 'pointer' : 'default',
                        }}
                        onMouseEnter={e => {
                            if (work.pdfUrl) {
                                e.currentTarget.style.background = 'rgba(201,168,76,0.08)'
                                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'
                                e.currentTarget.style.transform = 'translateX(4px)'
                            }
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(27,58,107,0.03)'
                            e.currentTarget.style.borderColor = 'rgba(27,58,107,0.1)'
                            e.currentTarget.style.transform = 'translateX(0)'
                        }}
                    >
                        {/* Icon */}
                        <div style={{
                            width: '40px', height: '40px', flexShrink: 0,
                            background: 'rgba(201,168,76,0.12)',
                            border: '1px solid rgba(201,168,76,0.2)',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--gold)',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                        </div>

                        {/* Ma'lumot */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '15px', fontWeight: '600',
                                color: 'var(--navy-dark)',
                                fontFamily: 'var(--font-display)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                                {work.title}
                            </div>
                            {work.year && (
                                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
                                    {work.year}{yearSuffix}
                                </div>
                            )}
                        </div>

                        {/* Yuklab olish tugmasi */}
                        {work.pdfUrl && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 14px',
                                background: 'var(--gold)',
                                color: 'var(--navy-dark)',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: '600',
                                flexShrink: 0,
                                letterSpacing: '0.5px',
                            }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                {downloadLabel}
                            </div>
                        )}
                    </a>
                ))}
            </div>
        </div>
    )
}

// Kichik book icon
function Book16() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    )
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
        readMore: locale === 'ru' ? 'Подробнее' : locale === 'en' ? 'More details' : 'Batafsil',
        close: locale === 'ru' ? 'Закрыть' : locale === 'en' ? 'Close' : 'Yopish',
        central: locale === 'ru' ? 'Центральная фигура' : locale === 'en' ? 'Central figure' : 'Markaziy shaxs',
        others: locale === 'ru' ? 'Другие представители' : locale === 'en' ? 'Other representatives' : 'Boshqa namoyandalar',
        loading: locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...',
        empty: locale === 'ru' ? 'Пока нет данных' : locale === 'en' ? 'No data yet' : "Hali ma'lumot yo'q",
    }

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' }}>
            {t.loading}
        </div>
    )

    return (
        <>
            {/* Header */}
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
                    {/* Markaziy shaxs */}
                    {featured && (
                        <section style={{ background: 'var(--off-white)', padding: '72px 0' }}>
                            <div className="container">
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                                    {t.central}
                                </div>
                                <div className="grid-featured" style={{ background: '#fff', border: '1px solid rgba(27,58,107,0.08)', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(27,58,107,0.1)' }}>
                                    {/* Chap panel */}
                                    <div style={{ background: 'linear-gradient(160deg, #1B3A6B, #254d8f)', minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px' }}>
                                        {featured.imageUrl ? (
                                            <img src={featured.imageUrl} alt={featured.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(201,168,76,0.4)' }} />
                                        ) : (
                                            <div style={{ color: 'rgba(255,255,255,0.4)' }}><Icons.Person /></div>
                                        )}
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', textAlign: 'center' }}>{featured.name}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#C9A84C' }}>{featured.years}</div>
                                    </div>

                                    {/* O'ng panel */}
                                    <div style={{ padding: '40px' }}>
                                        {featured.title && (
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                                {featured.title}
                                            </div>
                                        )}
                                        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: 'var(--navy-dark)' }}>{featured.name}</h2>
                                        <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '32px' }}>
                                            {featured.bio}
                                        </p>

                                        {/* Elektron asarlar */}
                                        <WorksList works={featured.figureWorks} locale={locale} />
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
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>{t.others}</div>
                                    <h2 style={{ color: '#fff', fontSize: '36px' }}>{t.h1a}<span style={{ color: '#C9A84C' }}>{t.h1b}</span></h2>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                    {others.map(jadid => (
                                        <div key={jadid.id} onClick={() => setSelected(jadid)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '2px', padding: '32px', cursor: 'pointer', transition: 'all 0.3s' }}
                                             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)' }}
                                             onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                                        >
                                            {jadid.imageUrl && (
                                                <img src={jadid.imageUrl} alt={jadid.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '2px solid rgba(201,168,76,0.3)' }} />
                                            )}
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: '#fff', marginBottom: '4px' }}>{jadid.name}</h3>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C', marginBottom: '12px' }}>{jadid.years}</div>
                                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', marginBottom: '16px' }}>
                                                {jadid.bio && jadid.bio.length > 120 ? jadid.bio.substring(0, 120) + '...' : jadid.bio}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C' }}>{t.readMore} →</div>
                                                {jadid.figureWorks && jadid.figureWorks.length > 0 && (
                                                    <span style={{ fontSize: '11px', color: 'rgba(201,168,76,0.7)', fontFamily: 'var(--font-mono)' }}>
                                                        📄 {jadid.figureWorks.length}
                                                    </span>
                                                )}
                                            </div>
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
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '4px', maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
                        {/* Modal header */}
                        <div style={{ background: 'linear-gradient(135deg, #1B3A6B, #254d8f)', padding: '40px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            {selected.imageUrl && (
                                <img src={selected.imageUrl} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(201,168,76,0.4)', flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: '#fff', marginBottom: '4px' }}>{selected.name}</h2>
                                {selected.title && (
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(201,168,76,0.8)', letterSpacing: '1px', marginBottom: '4px' }}>{selected.title}</div>
                                )}
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{selected.years}</div>
                            </div>
                            <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icons.X />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div style={{ padding: '40px' }}>
                            <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '32px' }}>
                                {selected.bio}
                            </p>

                            {/* Elektron asarlar */}
                            <WorksList works={selected.figureWorks} locale={locale} />

                            <button onClick={() => setSelected(null)} style={{ marginTop: '28px', width: '100%', padding: '14px', background: 'var(--navy-dark)', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '15px' }}>
                                {t.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}