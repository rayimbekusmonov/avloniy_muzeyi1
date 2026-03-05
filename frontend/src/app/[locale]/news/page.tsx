'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

const CATEGORIES = [
    { value: '', label: 'Barchasi' },
    { value: 'KORGAZMA', label: "Ko'rgazma" },
    { value: 'TADBIR', label: 'Tadbir' },
    { value: 'YANGILIK', label: 'Yangilik' },
    { value: 'BAYRAM', label: 'Bayram' },
]

function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
    return `${date.getDate()}-${months[date.getMonth()]}, ${date.getFullYear()}`
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        fetchNews()
    }, [category, page])

    const fetchNews = async () => {
        setLoading(true)
        try {
            const data = await newsService.getAll(page, 9, category || undefined)
            setNews(data.content)
            setTotalPages(data.totalPages)
        } catch {
            console.error('Yangiliklar yuklanmadi')
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryChange = (cat: string) => {
        setCategory(cat)
        setPage(0)
    }

    const featured = news[0]
    const rest = news.slice(1)

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><span>📰</span> So'nggi voqealar</div>
                    <h1>Muzey <span>Yangiliklari</span></h1>
                    <p>Abdulla Avloniy muzeyi tadbirlari, ko'rgazmalari va yangiliklari</p>
                </div>
            </div>

            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">

                    {/* Category Filter */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => handleCategoryChange(cat.value)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    border: '1px solid',
                                    borderColor: category === cat.value ? 'var(--gold)' : 'rgba(27,58,107,0.2)',
                                    background: category === cat.value ? 'var(--gold)' : '#fff',
                                    color: category === cat.value ? 'var(--navy-dark)' : 'var(--gray-600)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    letterSpacing: '1px',
                                }}
                            >{cat.label}</button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>
                            Yuklanmoqda...
                        </div>
                    ) : news.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                            <p>Bu kategoriyada yangiliklar yo'q</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured */}
                            {featured && page === 0 && (
                                <Link href={`/frontend/src/app/%5Blocale%5D/news/${featured.slug}`} style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        marginBottom: '32px',
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            minHeight: '280px',
                                            background: featured.imageUrl
                                                ? `url(${featured.imageUrl}) center/cover`
                                                : 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'rgba(255,255,255,0.3)',
                                            fontSize: '48px',
                                        }}>
                                            {!featured.imageUrl && '📸'}
                                        </div>
                                        <div style={{ padding: '40px' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                background: 'rgba(201,168,76,0.12)',
                                                color: 'var(--gold)',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '10px',
                                                letterSpacing: '2px',
                                                padding: '4px 12px',
                                                borderRadius: '10px',
                                                marginBottom: '16px',
                                            }}>{featured.category}</div>
                                            <h2 style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: 'clamp(20px, 2.5vw, 28px)',
                                                color: 'var(--navy-dark)',
                                                lineHeight: '1.3',
                                                marginBottom: '12px',
                                            }}>{featured.title}</h2>
                                            {featured.excerpt && (
                                                <p style={{ color: 'var(--gray-600)', lineHeight: '1.8', marginBottom: '20px', fontSize: '15px' }}>
                                                    {featured.excerpt}
                                                </p>
                                            )}
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gray-400)' }}>
                                                {formatDate(featured.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                {(page === 0 ? rest : news).map(item => (
                                    <Link key={item.id} href={`/frontend/src/app/%5Blocale%5D/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                        <div className="card">
                                            <div style={{
                                                height: '200px',
                                                background: item.imageUrl
                                                    ? `url(${item.imageUrl}) center/cover`
                                                    : 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'rgba(255,255,255,0.3)',
                                                fontSize: '36px',
                                            }}>
                                                {!item.imageUrl && '📸'}
                                            </div>
                                            <div style={{ padding: '24px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <span style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        fontSize: '10px',
                                                        color: 'var(--gold)',
                                                        letterSpacing: '2px',
                                                    }}>{item.category}</span>
                                                    <span style={{
                                                        fontFamily: 'var(--font-mono)',
                                                        fontSize: '10px',
                                                        color: 'var(--gray-400)',
                                                    }}>{formatDate(item.createdAt)}</span>
                                                </div>
                                                <h3 style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontSize: '18px',
                                                    color: 'var(--navy-dark)',
                                                    marginBottom: '10px',
                                                    lineHeight: '1.4',
                                                }}>{item.title}</h3>
                                                {item.excerpt && (
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: 'var(--gray-600)',
                                                        lineHeight: '1.7',
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}>{item.excerpt}</p>
                                                )}
                                                <div style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)' }}>
                                                    Batafsil →
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
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
        </>
    )
}