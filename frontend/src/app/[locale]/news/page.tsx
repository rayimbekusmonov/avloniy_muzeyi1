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

const LANGS = [
    { key: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { key: 'ru', label: 'Русский', flag: '🇷🇺' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
]

const emptyForm = {
    titleUz: '', contentUz: '', excerptUz: '',
    titleRu: '', contentRu: '', excerptRu: '',
    titleEn: '', contentEn: '', excerptEn: '',
    imageUrl: '',
    category: 'YANGILIK',
    published: false,
}

export default function AdminNewsPage() {
    const router = useRouter()
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<NewsItem | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isAuthenticated()) { router.push('/admin'); return }
        fetchNews()
    }, [router])

    const fetchNews = async () => {
        setLoading(true)
        try {
            const data = await newsService.getAll(0, 50)
            setNews(data.content)
        } catch { setError('Yangiliklar yuklanmadi') }
        finally { setLoading(false) }
    }

    const handleEdit = (item: NewsItem) => {
        setEditItem(item)
        setForm({
            titleUz: (item as any).titleUz || item.title || '',
            contentUz: (item as any).contentUz || item.content || '',
            excerptUz: (item as any).excerptUz || item.excerpt || '',
            titleRu: (item as any).titleRu || '',
            contentRu: (item as any).contentRu || '',
            excerptRu: (item as any).excerptRu || '',
            titleEn: (item as any).titleEn || '',
            contentEn: (item as any).contentEn || '',
            excerptEn: (item as any).excerptEn || '',
            imageUrl: item.imageUrl || '',
            category: item.category || 'YANGILIK',
            published: item.published || false,
        })
        setActiveLang('uz')
        setShowForm(true)
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Yangilikni o'chirishni tasdiqlaysizmi?")) return
        try {
            await newsService.delete(id)
            setNews(prev => prev.filter(n => n.id !== id))
        } catch { setError("O'chirishda xato yuz berdi") }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.titleUz.trim()) { setError("O'zbekcha sarlavha kiritilishi shart"); return }
        if (!form.contentUz.trim()) { setError("O'zbekcha kontent kiritilishi shart"); return }
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
        } finally { setSaving(false) }
    }

    const handleCancel = () => {
        setShowForm(false); setEditItem(null); setForm(emptyForm); setError('')
    }

    // Til maydoni o'zgartirish
    const setLangField = (field: string, value: string) => {
        const key = `${field}${activeLang.charAt(0).toUpperCase() + activeLang.slice(1)}`
        setForm(p => ({ ...p, [key]: value }))
    }
    const getLangField = (field: string) => {
        const key = `${field}${activeLang.charAt(0).toUpperCase() + activeLang.slice(1)}`
        return (form as any)[key] || ''
    }

    // Til dolzarbligi
    const getLangStatus = (lang: string) => {
        const title = (form as any)[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`]
        const content = (form as any)[`content${lang.charAt(0).toUpperCase() + lang.slice(1)}`]
        if (title && content) return 'done'
        if (title || content) return 'partial'
        return 'empty'
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
            {/* Header */}
            <header style={{
                background: 'var(--navy-dark)', padding: '0 24px', height: '64px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontSize: '12px', textDecoration: 'none' }}>
                        ← Dashboard
                    </Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff' }}>Yangiliklar</span>
                </div>
                <button onClick={() => { removeToken(); router.push('/admin') }} style={{
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: '6px',
                    fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer',
                }}>Chiqish</button>
            </header>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Top bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '26px', color: 'var(--navy-dark)' }}>Yangiliklar boshqaruvi</h1>
                    {!showForm && (
                        <button onClick={() => { setShowForm(true); setActiveLang('uz') }} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>
                            + Yangi qo'shish
                        </button>
                    )}
                </div>

                {error && (
                    <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#dc2626', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                {/* FORM */}
                {showForm && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', marginBottom: '32px', border: '1px solid rgba(27,58,107,0.1)', boxShadow: '0 4px 20px rgba(27,58,107,0.08)' }}>
                        <h2 style={{ fontSize: '20px', color: 'var(--navy-dark)', marginBottom: '28px' }}>
                            {editItem ? 'Yangilikni tahrirlash' : 'Yangi yangilik qo\'shish'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {/* Umumiy maydonlar */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={labelStyle}>Kategoriya</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                    >
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Rasm</label>
                                    <FileUpload
                                        folder="news"
                                        accept="image/*"
                                        label="Rasm yuklash"
                                        onUpload={(url) => setForm(p => ({ ...p, imageUrl: url }))}
                                    />
                                    {form.imageUrl && (
                                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <img src={form.imageUrl} alt="" style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Til tablari */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ ...labelStyle, marginBottom: '12px' }}>Til bo'yicha kontent</label>

                                {/* Tab buttons */}
                                <div style={{ display: 'flex', gap: '0', marginBottom: '0', borderBottom: '2px solid rgba(27,58,107,0.1)' }}>
                                    {LANGS.map(lang => {
                                        const status = getLangStatus(lang.key)
                                        return (
                                            <button
                                                key={lang.key}
                                                type="button"
                                                onClick={() => setActiveLang(lang.key as any)}
                                                style={{
                                                    padding: '10px 24px',
                                                    border: 'none',
                                                    borderBottom: activeLang === lang.key ? '2px solid var(--navy)' : '2px solid transparent',
                                                    marginBottom: '-2px',
                                                    background: 'none',
                                                    cursor: 'pointer',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '13px',
                                                    color: activeLang === lang.key ? 'var(--navy-dark)' : 'var(--gray-400)',
                                                    fontWeight: activeLang === lang.key ? '600' : '400',
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <span>{lang.flag}</span>
                                                <span>{lang.label}</span>
                                                {/* Status indicator */}
                                                <span style={{
                                                    width: '7px', height: '7px', borderRadius: '50%',
                                                    background: status === 'done' ? '#16a34a' : status === 'partial' ? '#f59e0b' : 'rgba(27,58,107,0.2)',
                                                }} />
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Tab content */}
                                <div style={{ background: 'rgba(27,58,107,0.02)', border: '1px solid rgba(27,58,107,0.08)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '20px' }}>
                                    {activeLang === 'uz' && (
                                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#dc2626', fontFamily: 'var(--font-mono)' }}>
                                            * O'zbek tili majburiy
                                        </div>
                                    )}

                                    {/* Sarlavha */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>
                                            Sarlavha {activeLang === 'uz' ? '*' : '(ixtiyoriy)'}
                                        </label>
                                        <input
                                            value={getLangField('title')}
                                            onChange={e => setLangField('title', e.target.value)}
                                            style={inputStyle}
                                            placeholder={
                                                activeLang === 'uz' ? 'Yangilik sarlavhasi...' :
                                                    activeLang === 'ru' ? 'Заголовок новости...' :
                                                        'News title...'
                                            }
                                        />
                                    </div>

                                    {/* Qisqa matn */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Qisqa matn (excerpt)</label>
                                        <input
                                            value={getLangField('excerpt')}
                                            onChange={e => setLangField('excerpt', e.target.value)}
                                            style={inputStyle}
                                            placeholder={
                                                activeLang === 'uz' ? "Qisqa ma'lumot..." :
                                                    activeLang === 'ru' ? 'Краткое описание...' :
                                                        'Brief description...'
                                            }
                                        />
                                    </div>

                                    {/* Kontent */}
                                    <div>
                                        <label style={labelStyle}>
                                            Kontent {activeLang === 'uz' ? '*' : '(ixtiyoriy)'}
                                        </label>
                                        <RichTextEditor
                                            key={activeLang}
                                            value={getLangField('content')}
                                            onChange={(val) => setLangField('content', val)}
                                            placeholder={
                                                activeLang === 'uz' ? 'Yangilik matni...' :
                                                    activeLang === 'ru' ? 'Текст новости...' :
                                                        'News text...'
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Nashr */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={form.published}
                                    onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--navy)' }}
                                />
                                <label htmlFor="published" style={{ fontSize: '15px', color: 'var(--navy-dark)', cursor: 'pointer' }}>
                                    Nashr qilish
                                </label>
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

                {/* NEWS LIST */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>Yuklanmoqda...</div>
                ) : news.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>Hali yangiliklar yo'q</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {news.map(item => (
                            <div key={item.id} style={{
                                background: '#fff', borderRadius: '12px', padding: '20px 24px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                gap: '16px', border: '1px solid rgba(27,58,107,0.08)',
                            }}>
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt="" style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '16px', color: 'var(--navy-dark)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.title}
                                        </h3>
                                        <span style={{
                                            padding: '2px 10px', borderRadius: '20px', fontSize: '11px',
                                            fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                                            background: item.published ? 'rgba(34,197,94,0.12)' : 'rgba(156,163,175,0.15)',
                                            color: item.published ? '#16a34a' : '#6b7280',
                                        }}>
                                            {item.published ? 'Nashr' : 'Qoralama'}
                                        </span>
                                        {/* Til indikatorlari */}
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {LANGS.map(lang => {
                                                const hasTitle = (item as any)[`title${lang.key.charAt(0).toUpperCase() + lang.key.slice(1)}`]
                                                return (
                                                    <span key={lang.key} title={lang.label} style={{
                                                        fontSize: '14px', opacity: hasTitle ? 1 : 0.25,
                                                    }}>{lang.flag}</span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', fontFamily: 'var(--font-mono)' }}>
                                        {item.category} · {new Date(item.createdAt).toLocaleDateString('uz-UZ')}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button onClick={() => handleEdit(item)} style={{
                                        padding: '8px 16px', background: 'rgba(27,58,107,0.08)',
                                        border: '1px solid rgba(27,58,107,0.15)', borderRadius: '6px',
                                        fontSize: '13px', color: 'var(--navy)', cursor: 'pointer',
                                    }}>Tahrirlash</button>
                                    <button onClick={() => handleDelete(item.id)} style={{
                                        padding: '8px 16px', background: 'rgba(220,38,38,0.08)',
                                        border: '1px solid rgba(220,38,38,0.2)', borderRadius: '6px',
                                        fontSize: '13px', color: '#dc2626', cursor: 'pointer',
                                    }}>O'chirish</button>
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
    display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)',
    color: 'var(--gray-600)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid rgba(27,58,107,0.2)',
    borderRadius: '8px', fontSize: '15px', fontFamily: 'var(--font-body)',
    color: 'var(--navy-dark)', outline: 'none', background: '#fff',
}