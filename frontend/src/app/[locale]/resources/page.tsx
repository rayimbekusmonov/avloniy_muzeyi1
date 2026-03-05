'use client'
import { useState, useEffect } from 'react'
import { resourceService } from '@/lib/services'
import { ResourceItem } from '@/lib/api'

const RESOURCE_TYPES = [
    { value: '', label: 'Barchasi' },
    { value: 'EBOOK', label: '📖 E-kitoblar' },
    { value: 'ARTICLE', label: '📄 Maqolalar' },
    { value: 'RESEARCH', label: '🔬 Ilmiy ishlar' },
]

export default function ResourcesPage() {
    const [items, setItems] = useState<ResourceItem[]>([])
    const [loading, setLoading] = useState(true)
    const [resourceType, setResourceType] = useState('')
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        fetchItems()
    }, [resourceType, search, page])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const data = await resourceService.getAll(page, 12, resourceType || undefined, search || undefined)
            setItems(data.content)
            setTotalPages(data.totalPages)
        } catch {
            console.error('Manbalar yuklanmadi')
        } finally {
            setLoading(false)
        }
    }

    const handleTypeChange = (type: string) => {
        setResourceType(type)
        setPage(0)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setSearch(searchInput)
        setPage(0)
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><span>📚</span> Kutubxona</div>
                    <h1>Ilmiy <span>Manbalar</span></h1>
                    <p>E-kitoblar, maqolalar va ilmiy ishlar to'plami</p>
                </div>
            </div>

            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">

                    {/* Filter + Search */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {RESOURCE_TYPES.map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => handleTypeChange(t.value)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        border: '1px solid',
                                        borderColor: resourceType === t.value ? 'var(--gold)' : 'rgba(27,58,107,0.2)',
                                        background: resourceType === t.value ? 'var(--gold)' : '#fff',
                                        color: resourceType === t.value ? 'var(--navy-dark)' : 'var(--gray-600)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        letterSpacing: '1px',
                                    }}
                                >{t.label}</button>
                            ))}
                        </div>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                            <input
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Qidirish..."
                                style={{
                                    padding: '8px 20px',
                                    border: '1px solid rgba(27,58,107,0.2)',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontFamily: 'var(--font-body)',
                                    outline: 'none',
                                    minWidth: '220px',
                                    background: '#fff',
                                }}
                            />
                            <button type="submit" className="btn-primary" style={{ border: 'none', cursor: 'pointer', padding: '8px 20px' }}>
                                Qidirish
                            </button>
                        </form>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>
                            Yuklanmoqda...
                        </div>
                    ) : items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                            <p>Hech narsa topilmadi</p>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '24px',
                            }}>
                                {items.map(item => (
                                    <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                                        {/* Cover */}
                                        <div style={{
                                            height: '200px',
                                            background: item.coverUrl
                                                ? `url(${item.coverUrl}) center/cover`
                                                : 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}>
                                            {!item.coverUrl && (
                                                <div style={{ fontSize: '52px' }}>
                                                    {item.resourceType === 'EBOOK' ? '📖' : item.resourceType === 'ARTICLE' ? '📄' : '🔬'}
                                                </div>
                                            )}
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: 'rgba(201,168,76,0.9)',
                                                color: 'var(--navy-dark)',
                                                padding: '3px 10px',
                                                borderRadius: '10px',
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '10px',
                                                fontWeight: '600',
                                                letterSpacing: '1px',
                                            }}>{item.resourceType}</div>
                                        </div>

                                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '17px',
                                                color: 'var(--navy-dark)',
                                                marginBottom: '6px',
                                                lineHeight: '1.3',
                                            }}>{item.title}</h3>
                                            <div style={{
                                                fontFamily: 'var(--font-mono)',
                                                fontSize: '11px',
                                                color: 'var(--gold)',
                                                marginBottom: '8px',
                                                letterSpacing: '1px',
                                            }}>{item.author}</div>
                                            {item.description && (
                                                <p style={{
                                                    fontSize: '13px',
                                                    color: 'var(--gray-600)',
                                                    lineHeight: '1.7',
                                                    marginBottom: '12px',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                }}>{item.description}</p>
                                            )}
                                            <div style={{
                                                display: 'flex',
                                                gap: '12px',
                                                fontSize: '12px',
                                                color: 'var(--gray-400)',
                                                fontFamily: 'var(--font-mono)',
                                                marginBottom: '16px',
                                            }}>
                                                {item.publishedYear && <span>📅 {item.publishedYear}</span>}
                                                {item.pageCount && <span>📄 {item.pageCount} bet</span>}
                                            </div>
                                            <a
                                                href={item.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-primary"
                                                style={{
                                                    marginTop: 'auto',
                                                    textAlign: 'center',
                                                    fontSize: '14px',
                                                    padding: '10px',
                                                }}
                                            >
                                                Yuklab olish ↓
                                            </a>
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
        </>
    )
}