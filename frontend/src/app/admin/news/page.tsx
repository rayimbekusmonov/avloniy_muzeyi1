'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, removeToken } from '@/lib/api'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'
import FileUpload from '@/components/FileUpload'
import RichTextEditor from '@/components/RichTextEditor'

const CATEGORIES = [
    { value: 'KORGAZMA', label: "Ko'rgazma" },
    { value: 'TADBIR', label: 'Tadbir' },
    { value: 'YANGILIK', label: 'Yangilik' },
    { value: 'BAYRAM', label: 'Bayram' },
]

const emptyForm = {
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: 'YANGILIK',
    published: false,
    publishedAt: new Date().toISOString().slice(0, 16),
}

export default function AdminNewsPage() {
    const router = useRouter()
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<NewsItem | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin')
            return
        }
        fetchNews()
    }, [router])

    const fetchNews = async () => {
        setLoading(true)
        try {
            const data = await newsService.getAll(0, 50)
            setNews(data.content)
        } catch {
            setError('Yangiliklar yuklanmadi')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (item: NewsItem) => {
        setEditItem(item)
        setForm({
            title: item.title,
            content: item.content,
            excerpt: item.excerpt || '',
            imageUrl: item.imageUrl || '',
            category: item.category,
            published: item.published,
            publishedAt: item.publishedAt
                ? new Date(item.publishedAt).toISOString().slice(0, 16)
                : new Date().toISOString().slice(0, 16),
        })
        setShowForm(true)
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Yangilikni o'chirishni tasdiqlaysizmi?")) return
        try {
            await newsService.delete(id)
            setNews(prev => prev.filter(n => n.id !== id))
        } catch {
            setError("O'chirishda xato yuz berdi")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            if (editItem) {
                const updated = await newsService.update(editItem.id, form)
                setNews(prev => prev.map(n => n.id === editItem.id ? updated : n))
            } else {
                const created = await newsService.create(form)
                setNews(prev => [created, ...prev])
            }
            setShowForm(false)
            setEditItem(null)
            setForm(emptyForm)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Xato yuz berdi')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditItem(null)
        setForm(emptyForm)
        setError('')
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
            {/* Header */}
            <header style={{
                background: 'var(--navy-dark)',
                padding: '0 24px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/admin/dashboard" style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        letterSpacing: '1px',
                        textDecoration: 'none',
                    }}>← Dashboard</Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff' }}>
                        Yangiliklar
                    </span>
                </div>
                <button
                    onClick={() => { removeToken(); router.push('/admin') }}
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.7)',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        cursor: 'pointer',
                    }}
                >Chiqish</button>
            </header>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Top bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '26px', color: 'var(--navy-dark)' }}>Yangiliklar boshqaruvi</h1>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn-primary"
                            style={{ border: 'none', cursor: 'pointer' }}
                        >+ Yangi qo'shish</button>
                    )}
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(220,38,38,0.1)',
                        border: '1px solid rgba(220,38,38,0.3)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: '#dc2626',
                        marginBottom: '24px',
                        fontSize: '14px',
                    }}>{error}</div>
                )}

                {/* Form */}
                {showForm && (
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '32px',
                        marginBottom: '32px',
                        border: '1px solid rgba(27,58,107,0.1)',
                        boxShadow: 'var(--shadow-md)',
                    }}>
                        <h2 style={{ fontSize: '20px', marginBottom: '24px', color: 'var(--navy-dark)' }}>
                            {editItem ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

                                {/* Sarlavha */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Sarlavha *</label>
                                    <input
                                        value={form.title}
                                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                        required
                                        style={inputStyle}
                                        placeholder="Yangilik sarlavhasi"
                                    />
                                </div>

                                {/* Kategoriya */}
                                <div>
                                    <label style={labelStyle}>Kategoriya *</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        {CATEGORIES.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sana */}
                                <div>
                                    <label style={labelStyle}>Nashr sanasi</label>
                                    <input
                                        type="datetime-local"
                                        value={form.publishedAt}
                                        onChange={e => setForm(p => ({ ...p, publishedAt: e.target.value }))}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Rasm */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Rasm</label>
                                    <FileUpload
                                        folder="news"
                                        accept="image/*"
                                        label="Rasm yuklash"
                                        onUpload={(url) => setForm(p => ({ ...p, imageUrl: url }))}
                                    />
                                    {form.imageUrl && (
                                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <img src={form.imageUrl} alt="" style={{ width: '80px', height: '52px', objectFit: 'cover', borderRadius: '6px' }} />
                                            <span style={{ fontSize: '12px', color: 'var(--gray-600)', wordBreak: 'break-all' }}>{form.imageUrl}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Excerpt */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Qisqa matn (excerpt)</label>
                                    <input
                                        value={form.excerpt}
                                        onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                                        style={inputStyle}
                                        placeholder="Yangilik haqida qisqa ma'lumot"
                                    />
                                </div>

                                {/* Kontent - Rich Text Editor */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Kontent *</label>
                                    <RichTextEditor
                                        value={form.content}
                                        onChange={(val) => setForm(p => ({ ...p, content: val }))}
                                        placeholder="Yangilik matni..."
                                    />
                                </div>

                                {/* Nashr qilish */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="published"
                                        checked={form.published}
                                        onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="published" style={{ fontSize: '15px', color: 'var(--navy-dark)', cursor: 'pointer' }}>
                                        Nashr qilish
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={handleCancel} className="btn-outline" style={{ cursor: 'pointer' }}>
                                    Bekor qilish
                                </button>
                                <button type="submit" disabled={saving} className="btn-primary" style={{ border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* News list */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>
                        Yuklanmoqda...
                    </div>
                ) : news.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>
                        Hali yangiliklar yo'q
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {news.map(item => (
                            <div key={item.id} style={{
                                background: '#fff',
                                borderRadius: '12px',
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px',
                                border: '1px solid rgba(27,58,107,0.08)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                {/* Rasm */}
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt="" style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                )}

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                        <h3 style={{
                                            fontSize: '16px',
                                            color: 'var(--navy-dark)',
                                            fontFamily: 'var(--font-display)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>{item.title}</h3>
                                        <span style={{
                                            padding: '2px 10px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontFamily: 'var(--font-mono)',
                                            background: item.published ? 'rgba(34,197,94,0.12)' : 'rgba(156,163,175,0.15)',
                                            color: item.published ? '#16a34a' : '#6b7280',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {item.published ? 'Nashr' : 'Qoralama'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', fontFamily: 'var(--font-mono)' }}>
                                        {item.category} · {new Date(item.createdAt).toLocaleDateString('uz-UZ')}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(27,58,107,0.08)',
                                            border: '1px solid rgba(27,58,107,0.15)',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            color: 'var(--navy)',
                                            cursor: 'pointer',
                                        }}
                                    >Tahrirlash</button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(220,38,38,0.08)',
                                            border: '1px solid rgba(220,38,38,0.2)',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                        }}
                                    >O'chirish</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--gray-600)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(27,58,107,0.2)',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    color: 'var(--navy-dark)',
    outline: 'none',
    background: '#fff',
}
