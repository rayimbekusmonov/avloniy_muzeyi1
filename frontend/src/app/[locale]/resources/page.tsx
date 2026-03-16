'use client'
import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { resourceService } from '@/lib/services'
import { ResourceItem } from '@/lib/api'

const Icons = {
    Book: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    BookLg: () => (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    FileText: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
    ),
    FileTextLg: () => (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
    ),
    Microscope: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
        </svg>
    ),
    MicroscopeLg: () => (
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/>
        </svg>
    ),
    Download: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    ),
    Search: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
    ),
    Inbox: () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
        </svg>
    ),
    Calendar: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    ),
    Pages: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
    ),
}

export default function ResourcesPage() {
    const locale = useLocale()
    const [items, setItems] = useState<ResourceItem[]>([])
    const [loading, setLoading] = useState(true)
    const [resourceType, setResourceType] = useState('')
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const RESOURCE_TYPES = [
        { value: '', label: locale === 'ru' ? 'Все' : locale === 'en' ? 'All' : 'Barchasi' },
        { value: 'EBOOK',    Icon: Icons.Book,       label: locale === 'ru' ? 'Э-книги'      : locale === 'en' ? 'E-books'  : 'E-kitoblar' },
        { value: 'ARTICLE',  Icon: Icons.FileText,   label: locale === 'ru' ? 'Статьи'       : locale === 'en' ? 'Articles' : 'Maqolalar' },
        { value: 'RESEARCH', Icon: Icons.Microscope, label: locale === 'ru' ? 'Исследования' : locale === 'en' ? 'Research' : 'Ilmiy ishlar' },
    ]

    const t = {
        label: locale === 'ru' ? 'Библиотека' : locale === 'en' ? 'Library' : 'Kutubxona',
        h1a: locale === 'ru' ? 'Научные ' : locale === 'en' ? 'Academic ' : 'Ilmiy ',
        h1b: locale === 'ru' ? 'Ресурсы' : locale === 'en' ? 'Resources' : 'Manbalar',
        desc: locale === 'ru' ? 'Коллекция электронных книг, статей и научных работ' : locale === 'en' ? 'Collection of e-books, articles and research works' : "E-kitoblar, maqolalar va ilmiy ishlar to'plami",
        search: locale === 'ru' ? 'Поиск...' : locale === 'en' ? 'Search...' : 'Qidirish...',
        searchBtn: locale === 'ru' ? 'Найти' : locale === 'en' ? 'Search' : 'Qidirish',
        loading: locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...',
        empty: locale === 'ru' ? 'Ничего не найдено' : locale === 'en' ? 'Nothing found' : 'Hech narsa topilmadi',
        download: locale === 'ru' ? 'Скачать' : locale === 'en' ? 'Download' : 'Yuklab olish',
        pages: locale === 'ru' ? 'стр.' : locale === 'en' ? 'p.' : 'bet',
        prev: locale === 'ru' ? '← Назад' : locale === 'en' ? '← Prev' : '← Oldingi',
        next: locale === 'ru' ? 'Вперёд →' : locale === 'en' ? 'Next →' : 'Keyingi →',
    }

    useEffect(() => { fetchItems() }, [resourceType, search, page])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const data = await resourceService.getAll(page, 12, resourceType || undefined, search || undefined)
            setItems(data.content); setTotalPages(data.totalPages)
        } catch { console.error('Resources load failed') }
        finally { setLoading(false) }
    }

    const getPlaceholderIcon = (type: string) => {
        if (type === 'ARTICLE') return <Icons.FileTextLg />
        if (type === 'RESEARCH') return <Icons.MicroscopeLg />
        return <Icons.BookLg />
    }

    return (
        <>
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><Icons.Book /> {t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {RESOURCE_TYPES.map(rt => (
                                <button key={rt.value} onClick={() => { setResourceType(rt.value); setPage(0) }} style={{
                                    padding: '8px 20px', borderRadius: '20px', border: '1px solid',
                                    borderColor: resourceType === rt.value ? 'var(--gold)' : 'rgba(27,58,107,0.2)',
                                    background: resourceType === rt.value ? 'var(--gold)' : '#fff',
                                    color: resourceType === rt.value ? 'var(--navy-dark)' : 'var(--gray-600)',
                                    fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer',
                                    transition: 'all 0.2s', letterSpacing: '1px',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                }}>
                                    {rt.Icon && <rt.Icon />}
                                    {rt.label}
                                </button>
                            ))}
                        </div>
                        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(0) }} style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder={t.search} style={{ padding: '8px 20px', border: '1px solid rgba(27,58,107,0.2)', borderRadius: '20px', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', minWidth: '220px', background: '#fff' }} />
                            <button type="submit" className="btn-primary" style={{ border: 'none', cursor: 'pointer', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Icons.Search /> {t.searchBtn}
                            </button>
                        </form>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>{t.loading}</div>
                    ) : items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-400)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', opacity: 0.4 }}><Icons.Inbox /></div>
                            <p style={{ color: 'var(--gray-600)' }}>{t.empty}</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {items.map(item => (
                                    <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ height: '200px', background: item.coverUrl ? `url(${item.coverUrl}) center/cover` : 'linear-gradient(135deg, var(--navy-dark), var(--navy))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            {!item.coverUrl && <div style={{ color: 'rgba(255,255,255,0.3)' }}>{getPlaceholderIcon(item.resourceType)}</div>}
                                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(201,168,76,0.9)', color: 'var(--navy-dark)', padding: '3px 10px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px' }}>{item.resourceType}</div>
                                        </div>
                                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--navy-dark)', marginBottom: '6px', lineHeight: '1.3' }}>{item.title}</h3>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', marginBottom: '8px', letterSpacing: '1px' }}>{item.author}</div>
                                            {item.description && <p style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.7', marginBottom: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>{item.description}</p>}
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--gray-400)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
                                                {item.publishedYear && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Calendar /> {item.publishedYear}</span>}
                                                {item.pageCount && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Pages /> {item.pageCount} {t.pages}</span>}
                                            </div>
                                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: 'auto', textAlign: 'center', fontSize: '14px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <Icons.Download /> {t.download}
                                            </a>
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
        </>
    )
}