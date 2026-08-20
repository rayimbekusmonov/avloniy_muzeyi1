'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { isAuthenticated, removeToken } from '@/lib/api'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'
import { translateBatch } from '@/lib/translate'
import FileUpload from '@/components/FileUpload'
import RichTextEditor from '@/components/RichTextEditor'

const CATEGORIES = [
    { value: 'YANGILIK', label: 'Yangilik', icon: '📰' },
    { value: 'TADBIR', label: 'Tadbir', icon: '📅' },
    { value: 'FOTOGALEREYA', label: 'Fotogalereya', icon: '🖼️' },
    { value: 'ELON', label: "E'lonlar", icon: '📢' },
]

const LANGS = [
    { key: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { key: 'ru', label: 'Русский', flag: '🇷🇺' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
]

interface GalleryPhotoItem {
    url: string;
    caption?: string;
}

const emptyForm = {
    titleUz: '', contentUz: '', excerptUz: '',
    titleRu: '', contentRu: '', excerptRu: '',
    titleEn: '', contentEn: '', excerptEn: '',
    imageUrl: '',
    galleryPhotos: [] as GalleryPhotoItem[],
    category: 'YANGILIK',
    published: false,
    createdAt: new Date().toISOString().slice(0, 16),
}

export default function AdminNewsPage() {
    const router = useRouter()
    const locale = useLocale()
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<NewsItem | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [filterCategory, setFilterCategory] = useState('')
    const [newPhotoUrl, setNewPhotoUrl] = useState('')
    const [newPhotoCaption, setNewPhotoCaption] = useState('')
    const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')
    const [saving, setSaving] = useState(false)
    const [translating, setTranslating] = useState(false)
    const [translateSuccess, setTranslateSuccess] = useState('')
    const [error, setError] = useState('')

    const handleAutoTranslate = async () => {
        if (!form.titleUz.trim() && !form.contentUz.trim()) {
            setError("Avtomatik tarjima qilish uchun kamida O'zbekcha sarlavha yoki matn kiritilishi kerak")
            return
        }
        setTranslating(true)
        setError('')
        setTranslateSuccess('')

        try {
            const res = await translateBatch({
                title: form.titleUz,
                content: form.contentUz,
            }, ['ru', 'en'])

            setForm(prev => ({
                ...prev,
                titleRu: res.ru.title || prev.titleRu,
                titleEn: res.en.title || prev.titleEn,
                contentRu: res.ru.content || prev.contentRu,
                contentEn: res.en.content || prev.contentEn,
            }))

            setTranslateSuccess("Matnlar Rus hamda Ingliz tillariga muvaffaqiyatli tarjima qilindi! Iltimos, tillar bo'yicha ko'zdan kechirib chiqing.")
            setTimeout(() => setTranslateSuccess(''), 7000)
        } catch (err: any) {
            setError("Tarjima qilishda xatolik yuz berdi: " + (err?.message || 'Qayta urinib ko\'ring'))
        } finally {
            setTranslating(false)
        }
    }

    const fetchNews = useCallback(async () => {
        setLoading(true)
        try {
            const data = await newsService.getAllForAdmin(0, 100)
            setNews(data.content)
        } catch {
            setError('Yangiliklar yuklanmadi')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin`)
            return
        }
        fetchNews()
    }, [fetchNews, router, locale])

    const handleEdit = (item: NewsItem) => {
        setEditItem(item)
        const dateVal = item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
        
        let parsedPhotos: GalleryPhotoItem[] = []
        if (item.galleryPhotosJson) {
            try {
                const p = JSON.parse(item.galleryPhotosJson)
                if (Array.isArray(p)) {
                    parsedPhotos = p.map((x: any) => typeof x === 'string' ? { url: x, caption: '' } : { url: x.url || '', caption: x.caption || '' })
                }
            } catch {}
        }

        setForm({
            titleUz: item.titleUz || item.title || '',
            contentUz: item.contentUz || item.content || '',
            excerptUz: '',
            titleRu: item.titleRu || '',
            contentRu: item.contentRu || '',
            excerptRu: '',
            titleEn: item.titleEn || '',
            contentEn: item.contentEn || '',
            excerptEn: '',
            imageUrl: item.imageUrl || '',
            galleryPhotos: parsedPhotos,
            category: item.category || 'YANGILIK',
            published: item.published || false,
            createdAt: dateVal,
        })
        setActiveLang('uz')
        setShowForm(true)
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("O'chirishni tasdiqlaysizmi?")) return
        try {
            await newsService.delete(id)
            setNews(prev => prev.filter(n => n.id !== id))
        } catch {
            setError("O'chirishda xato yuz berdi")
        }
    }

    const handleAddGalleryPhoto = (url: string, caption = '') => {
        if (!url.trim()) return
        setForm(p => ({
            ...p,
            imageUrl: p.imageUrl || url, // If no main cover image, set first photo as cover
            galleryPhotos: [...p.galleryPhotos, { url: url.trim(), caption: caption.trim() }]
        }))
        setNewPhotoUrl('')
        setNewPhotoCaption('')
    }

    const handleRemoveGalleryPhoto = (index: number) => {
        setForm(p => ({
            ...p,
            galleryPhotos: p.galleryPhotos.filter((_, idx) => idx !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.titleUz.trim()) { setError("O'zbekcha sarlavha kiritilishi shart"); return }
        if (!form.contentUz.trim()) { setError("O'zbekcha kontent kiritilishi shart"); return }
        setSaving(true)
        setError('')
        try {
            // Auto fallback for cover photo if Fotogalereya has photos
            let finalImageUrl = form.imageUrl
            if (!finalImageUrl && form.galleryPhotos.length > 0) {
                finalImageUrl = form.galleryPhotos[0].url
            }

            const payload = {
                ...form,
                imageUrl: finalImageUrl,
                galleryPhotosJson: form.galleryPhotos.length > 0 ? JSON.stringify(form.galleryPhotos) : undefined,
                excerptUz: form.contentUz.replace(/<[^>]*>?/gm, '').slice(0, 160),
                excerptRu: form.contentRu ? form.contentRu.replace(/<[^>]*>?/gm, '').slice(0, 160) : '',
                excerptEn: form.contentEn ? form.contentEn.replace(/<[^>]*>?/gm, '').slice(0, 160) : '',
                createdAt: form.createdAt ? new Date(form.createdAt).toISOString() : undefined,
            }
            if (editItem) {
                const updated = await newsService.update(editItem.id, payload)
                setNews(prev => prev.map(n => n.id === editItem.id ? updated : n))
            } else {
                const created = await newsService.create(payload)
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
        setShowForm(false); setEditItem(null); setForm(emptyForm); setError('')
    }

    const setLangField = (field: string, value: string) => {
        const key = `${field}${activeLang.charAt(0).toUpperCase() + activeLang.slice(1)}`
        setForm(p => ({ ...p, [key]: value }))
    }
    const getLangField = (field: string) => {
        const key = `${field}${activeLang.charAt(0).toUpperCase() + activeLang.slice(1)}`
        return (form as Record<string, unknown>)[key] as string || ''
    }

    const getLangStatus = (lang: string) => {
        const title = (form as Record<string, unknown>)[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`] as string
        const content = (form as Record<string, unknown>)[`content${lang.charAt(0).toUpperCase() + lang.slice(1)}`] as string
        if (title && content) return 'done'
        if (title || content) return 'partial'
        return 'empty'
    }

    const getCategoryBadge = (cat: string) => {
        switch (cat) {
            case 'FOTOGALEREYA':
                return { label: '🖼️ Fotogalereya', bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' }
            case 'ELON':
                return { label: "📢 E'lon", bg: 'rgba(234,88,12,0.15)', color: '#ea580c' }
            case 'TADBIR':
                return { label: '📅 Tadbir', bg: 'rgba(168,85,247,0.15)', color: '#a855f7' }
            case 'YANGILIK':
            default:
                return { label: '📰 Yangilik', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' }
        }
    }

    const filteredNews = filterCategory ? news.filter(n => n.category === filterCategory) : news

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ background: 'var(--bg-header)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href={`/${locale}/admin/dashboard`} style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)', fontSize: '12px', textDecoration: 'none' }}>← Dashboard</Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff' }}>Yangiliklar, Tadbirlar, Galereya & E'lonlar</span>
                </div>
                <button onClick={() => { removeToken(); router.push(`/${locale}/admin`) }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>Chiqish</button>
            </header>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', color: 'var(--text-heading)', marginBottom: '4px' }}>Yangiliklar & Bo'limlar boshqaruvi</h1>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Yangilik, Tadbir, Fotogalereya va E'lonlar bo'limlari kontentini boshqaring</p>
                    </div>
                    {!showForm && (
                        <button onClick={() => { setShowForm(true); setEditItem(null); setForm(emptyForm); setActiveLang('uz') }} className="btn-primary" style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>+ Yangi qo'shish</span>
                        </button>
                    )}
                </div>

                {/* Category Filter Tabs */}
                {!showForm && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setFilterCategory('')}
                            style={{
                                padding: '8px 16px', borderRadius: '20px', border: '1px solid',
                                borderColor: filterCategory === '' ? 'var(--gold)' : 'var(--border-color)',
                                background: filterCategory === '' ? 'var(--gold)' : 'var(--bg-card)',
                                color: filterCategory === '' ? '#061d15' : 'var(--text-main)',
                                fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer', fontWeight: '600'
                            }}
                        >
                            Barchasi ({news.length})
                        </button>
                        {CATEGORIES.map(c => {
                            const count = news.filter(n => n.category === c.value).length
                            return (
                                <button
                                    key={c.value}
                                    onClick={() => setFilterCategory(c.value)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '20px', border: '1px solid',
                                        borderColor: filterCategory === c.value ? 'var(--gold)' : 'var(--border-color)',
                                        background: filterCategory === c.value ? 'var(--gold)' : 'var(--bg-card)',
                                        color: filterCategory === c.value ? '#061d15' : 'var(--text-main)',
                                        fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer', fontWeight: '600',
                                        display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                >
                                    <span>{c.icon}</span>
                                    <span>{c.label} ({count})</span>
                                </button>
                            )
                        })}
                    </div>
                )}

                {error && (
                    <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#dc2626', marginBottom: '24px', fontSize: '14px' }}>{error}</div>
                )}

                {showForm && (
                    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '32px', marginBottom: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                        <h2 style={{ fontSize: '20px', color: 'var(--text-heading)', marginBottom: '28px' }}>
                            {editItem ? 'Postni tahrirlash' : "Yangi post / maqola qo'shish"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid-2-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Bo'lim / Kategoriya *</label>
                                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required style={{ ...inputStyle, cursor: 'pointer', fontWeight: '600' }}>
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>📅 Sana va vaqt *</label>
                                    <input
                                        type="datetime-local"
                                        value={form.createdAt}
                                        onChange={e => setForm(p => ({ ...p, createdAt: e.target.value }))}
                                        required
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Notice if ELON */}
                                {form.category === 'ELON' && (
                                    <div style={{ gridColumn: '1 / -1', background: 'rgba(234,88,12,0.1)', border: '1px solid rgba(234,88,12,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#ea580c', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>📢</span>
                                        <span><strong>E'lonlar bo'limi:</strong> Ushbu post rasmiy e'lon, seminar, tanlov yoki xabarnoma ko'rinishida alohida nishon bilan ko'rsatiladi.</span>
                                    </div>
                                )}

                                {/* Main Cover Image */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>{form.category === 'FOTOGALEREYA' ? 'Asosiy Muqova Rasmi (Cover Photo)' : 'Asosiy Rasm URL / Fayl'}</label>
                                    <FileUpload folder="news" accept="image/*" label="Asosiy rasm yuklash" onUpload={(url) => setForm(p => ({ ...p, imageUrl: url }))} />
                                    {form.imageUrl && (
                                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <img src={form.imageUrl} alt="" style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} />
                                            <button type="button" onClick={() => setForm(p => ({ ...p, imageUrl: '' }))} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Rasmni o'chirish ✕</button>
                                        </div>
                                    )}
                                </div>

                                {/* FOTOGALEREYA MULTI-PHOTO UPLOADER */}
                                {form.category === 'FOTOGALEREYA' && (
                                    <div style={{ gridColumn: '1 / -1', background: 'var(--bg-secondary)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '12px', padding: '20px', marginTop: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                                            <div>
                                                <h3 style={{ fontSize: '15px', color: 'var(--gold)', fontWeight: '700', marginBottom: '2px' }}>🖼️ Fotogalereya Rasmlari ({form.galleryPhotos.length} ta rasm)</h3>
                                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ushbu galereya to'plamiga yangi fotosuratlar qo'shing va izoh yozing</p>
                                            </div>
                                        </div>

                                        {/* Upload or Add by URL */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px', background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                            <div>
                                                <label style={labelStyle}>📁 Kompyuterdan rasm yuklash</label>
                                                <FileUpload
                                                    folder="gallery_news"
                                                    accept="image/*"
                                                    label="Rasm yuklash va qo'shish"
                                                    onUpload={(url) => handleAddGalleryPhoto(url, newPhotoCaption)}
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>🔗 Yoki Rasm URL havolasi</label>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <input
                                                        type="text"
                                                        value={newPhotoUrl}
                                                        onChange={e => setNewPhotoUrl(e.target.value)}
                                                        placeholder="https://... rasm havolasi"
                                                        style={inputStyle}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAddGalleryPhoto(newPhotoUrl, newPhotoCaption)}
                                                        style={{ padding: '0 16px', background: 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                                    >
                                                        + Qo'shish
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Photos Preview Grid */}
                                        {form.galleryPhotos.length > 0 ? (
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                                                {form.galleryPhotos.map((photo, pIdx) => (
                                                    <div key={pIdx} style={{ background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                                                        <img src={photo.url} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                                                        <div style={{ padding: '8px' }}>
                                                            <input
                                                                type="text"
                                                                value={photo.caption || ''}
                                                                onChange={e => {
                                                                    const val = e.target.value
                                                                    setForm(prev => ({
                                                                        ...prev,
                                                                        galleryPhotos: prev.galleryPhotos.map((it, idx) => idx === pIdx ? { ...it, caption: val } : it)
                                                                    }))
                                                                }}
                                                                placeholder="Rasm izohi..."
                                                                style={{ ...inputStyle, fontSize: '12px', padding: '4px 8px' }}
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveGalleryPhoto(pIdx)}
                                                            style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(220,38,38,0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                                            title="O'chirish"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                                                Hali fotosuratlar qo'shilmadi. Yuqoridagi tugma orqali fotogalereya uchun rasmlarni yuklang.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                                    <label style={{ ...labelStyle, marginBottom: 0 }}>Til bo'yicha kontent</label>
                                    <button
                                        type="button"
                                        onClick={handleAutoTranslate}
                                        disabled={translating}
                                        style={{
                                            padding: '7px 16px',
                                            background: 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.1) 100%)',
                                            border: '1px solid rgba(201,168,76,0.4)',
                                            color: 'var(--gold)',
                                            borderRadius: '8px',
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: translating ? 'not-allowed' : 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {translating ? (
                                            <>
                                                <span style={{ width: '14px', height: '14px', border: '2px solid rgba(201,168,76,0.3)', borderTop: '2px solid var(--gold)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                                Tarjima qilinmoqda...
                                            </>
                                        ) : (
                                            <>
                                                <span>✨</span>
                                                <span>Rus va Ingliz tiliga avtomatik tarjima qilish</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {translateSuccess && (
                                    <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#22c55e', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>✓</span>
                                        <span>{translateSuccess}</span>
                                    </div>
                                )}

                                <div className="nav-tabs-scroll" style={{ display: 'flex', gap: '0', marginBottom: '0', borderBottom: '2px solid var(--border-subtle)' }}>
                                    {LANGS.map(lang => {
                                        const status = getLangStatus(lang.key)
                                        return (
                                            <button key={lang.key} type="button" onClick={() => setActiveLang(lang.key as 'uz' | 'ru' | 'en')} style={{
                                                padding: '10px 24px', border: 'none',
                                                borderBottom: activeLang === lang.key ? '2px solid var(--gold)' : '2px solid transparent',
                                                marginBottom: '-2px', background: 'none', cursor: 'pointer',
                                                fontFamily: 'var(--font-mono)', fontSize: '13px',
                                                color: activeLang === lang.key ? 'var(--text-heading)' : 'var(--text-muted)',
                                                fontWeight: activeLang === lang.key ? '600' : '400',
                                                display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
                                            }}>
                                                <span>{lang.flag}</span><span>{lang.label}</span>
                                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status === 'done' ? '#16a34a' : status === 'partial' ? '#f59e0b' : 'var(--border-color)' }} />
                                            </button>
                                        )
                                    })}
                                </div>

                                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '20px' }}>
                                    {activeLang === 'uz' && (
                                        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#dc2626', fontFamily: 'var(--font-mono)' }}>* O'zbek tili majburiy</div>
                                    )}
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Sarlavha {activeLang === 'uz' ? '*' : '(ixtiyoriy)'}</label>
                                        <input value={getLangField('title')} onChange={e => setLangField('title', e.target.value)} style={inputStyle}
                                               placeholder={activeLang === 'uz' ? 'Sarlavha...' : activeLang === 'ru' ? 'Заголовок...' : 'Title...'} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Kontent / Tavsif {activeLang === 'uz' ? '*' : '(ixtiyoriy)'}</label>
                                        <RichTextEditor key={activeLang} value={getLangField('content')} onChange={(val) => setLangField('content', val)}
                                                        placeholder={activeLang === 'uz' ? 'Matn / tavsif...' : activeLang === 'ru' ? 'Текст...' : 'Content...'} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                                       style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--gold)' }} />
                                <label htmlFor="published" style={{ fontSize: '15px', color: 'var(--text-heading)', cursor: 'pointer' }}>Nashr qilish</label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                <button type="button" onClick={handleCancel} className="btn-outline" style={{ cursor: 'pointer' }}>Bekor qilish</button>
                                <button type="submit" disabled={saving} className="btn-primary" style={{ border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Yuklanmoqda...</div>
                ) : filteredNews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                        {filterCategory ? `Ushbu bo'limda hali elementlar yo'q` : `Hali postlar yo'q`}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredNews.map(item => {
                            const badge = getCategoryBadge(item.category)
                            let photoCount = 0
                            if (item.galleryPhotosJson) {
                                try {
                                    const p = JSON.parse(item.galleryPhotosJson)
                                    if (Array.isArray(p)) photoCount = p.length
                                } catch {}
                            }

                            return (
                                <div key={item.id} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                                    {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />}
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                            <h3 style={{ fontSize: '16px', color: 'var(--text-heading)', fontFamily: 'var(--font-display)', margin: 0 }}>
                                                {item.titleUz || item.title}
                                            </h3>
                                            <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', background: badge.bg, color: badge.color, fontWeight: '600' }}>
                                                {badge.label} {photoCount > 0 ? `(${photoCount} ta rasm)` : ''}
                                            </span>
                                            <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', background: item.published ? 'rgba(34,197,94,0.12)' : 'rgba(156,163,175,0.15)', color: item.published ? '#16a34a' : 'var(--text-muted)' }}>
                                                {item.published ? 'Nashr qilingan' : 'Qoralama'}
                                            </span>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {LANGS.map(lang => {
                                                    const hasTitle = (item as unknown as Record<string, unknown>)[`title${lang.key.charAt(0).toUpperCase() + lang.key.slice(1)}`]
                                                    return <span key={lang.key} title={lang.label} style={{ fontSize: '14px', opacity: hasTitle ? 1 : 0.25 }}>{lang.flag}</span>
                                                })}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                            {new Date(item.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                        <button onClick={() => handleEdit(item)} style={{ padding: '8px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-heading)', cursor: 'pointer' }}>Tahrirlash</button>
                                        <button onClick={() => handleDelete(item.id)} style={{ padding: '8px 16px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '6px', fontSize: '13px', color: '#dc2626', cursor: 'pointer' }}>O'chirish</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', fontFamily: 'var(--font-body)', color: 'var(--text-heading)', outline: 'none', background: 'var(--bg-main)' }
