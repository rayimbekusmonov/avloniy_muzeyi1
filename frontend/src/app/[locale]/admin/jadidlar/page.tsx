'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { isAuthenticated, removeToken, HistoricalFigure } from '@/lib/api'
import { figureService } from '@/lib/services'
import FileUpload from '@/components/FileUpload'

const LANGS = [
    { key: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { key: 'ru', label: 'Русский', flag: '🇷🇺' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
]

const REGIONS = [
    'Toshkent', 'Samarqand', 'Buxoro', "Farg'ona", 'Xorazm',
    'Andijon', 'Namangan', 'Qashqadaryo', 'Surxondaryo', "Qoraqalpog'iston"
]

const CATEGORIES = [
    "Ta'lim & Matbuot", "Matbuot & Teatr", "Adabiyot & She'riyat",
    "Adabiyot & Fan", "Siyosat & Davlat", "San'at & Madaniyat"
]

interface LocalWork {
    tempId: string
    title: string
    year: string
    pdfUrl: string
    sortOrder: number
    id?: number
    saved?: boolean
}

interface TimelineItem {
    year: string
    title: string
    desc: string
}

interface ArchivePhoto {
    title: string
    url: string
}

const emptyForm = {
    nameUz: '', nameRu: '', nameEn: '',
    titleUz: '', titleRu: '', titleEn: '',
    bioUz: '', bioRu: '', bioEn: '',
    years: '',
    imageUrl: '',
    region: 'Toshkent',
    category: "Ta'lim & Matbuot",
    quote: '',
    featured: false,
    sortOrder: 0,
    works: '',
    pdfUrl: '',
}

const emptyWorkForm = (): LocalWork => ({
    tempId: Date.now().toString() + Math.random().toString(36).slice(2),
    title: '',
    year: '',
    pdfUrl: '',
    sortOrder: 0,
})

export default function AdminJadidlarPage() {
    const router = useRouter()
    const locale = useLocale()

    const [figures, setFigures] = useState<HistoricalFigure[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<HistoricalFigure | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')
    const [activeTab, setActiveTab] = useState<'info' | 'timeline' | 'gallery' | 'works'>('info')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Works
    const [works, setWorks] = useState<LocalWork[]>([])
    const [addingWork, setAddingWork] = useState(false)
    const [newWork, setNewWork] = useState<LocalWork>(emptyWorkForm())
    const [workError, setWorkError] = useState('')

    // Timeline
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
    const [newTimeline, setNewTimeline] = useState<TimelineItem>({ year: '', title: '', desc: '' })

    // Gallery Photos
    const [galleryPhotos, setGalleryPhotos] = useState<ArchivePhoto[]>([])
    const [newPhoto, setNewPhoto] = useState<ArchivePhoto>({ title: '', url: '' })

    const fetchFigures = useCallback(async () => {
        setLoading(true)
        try {
            const data = await figureService.getAllForAdmin()
            setFigures(data)
        } catch {
            setError('Jadidlar ma\'lumotlarini yuklab bo\'lmadi')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin`)
            return
        }
        fetchFigures()
    }, [fetchFigures, router, locale])

    const handleEdit = (item: HistoricalFigure) => {
        setEditItem(item)
        setForm({
            nameUz: item.nameUz || '', nameRu: item.nameRu || '', nameEn: item.nameEn || '',
            titleUz: item.titleUz || '', titleRu: item.titleRu || '', titleEn: item.titleEn || '',
            bioUz: item.bioUz || '', bioRu: item.bioRu || '', bioEn: item.bioEn || '',
            years: item.years || '',
            imageUrl: item.imageUrl || '',
            region: item.region || 'Toshkent',
            category: item.category || "Ta'lim & Matbuot",
            quote: item.quote || '',
            featured: item.featured || false,
            sortOrder: item.sortOrder || 0,
            works: item.works || '',
            pdfUrl: item.pdfUrl || '',
        })

        // Parse timeline
        let parsedTimeline: TimelineItem[] = []
        if (item.timeline && item.timeline.length > 0) {
            parsedTimeline = item.timeline
        } else if (item.timelineJson) {
            try { parsedTimeline = JSON.parse(item.timelineJson) } catch {}
        }
        setTimelineItems(parsedTimeline)

        // Parse gallery
        let parsedGallery: ArchivePhoto[] = []
        if (item.galleryPhotos && item.galleryPhotos.length > 0) {
            parsedGallery = item.galleryPhotos
        } else if (item.galleryPhotosJson) {
            try { parsedGallery = JSON.parse(item.galleryPhotosJson) } catch {}
        }
        setGalleryPhotos(parsedGallery)

        // Existing works
        const existingWorks: LocalWork[] = (item.figureWorks || []).map(w => ({
            tempId: `saved-${w.id}`,
            title: w.title,
            year: w.year ? String(w.year) : '',
            pdfUrl: w.pdfUrl || '',
            sortOrder: w.sortOrder || 0,
            id: w.id,
            saved: true,
        }))
        setWorks(existingWorks)

        setActiveLang('uz')
        setActiveTab('info')
        setShowForm(true)
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }

    const handleNewFigure = () => {
        setEditItem(null)
        setForm(emptyForm)
        setWorks([])
        setTimelineItems([])
        setGalleryPhotos([])
        setActiveLang('uz')
        setActiveTab('info')
        setShowForm(true)
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Jadidni butunlay o'chirishni tasdiqlaysizmi?")) return
        try {
            await figureService.delete(id)
            setFigures(prev => prev.filter(f => f.id !== id))
        } catch {
            setError("O'chirishda xato yuz berdi")
        }
    }

    // Work handling
    const handleAddWorkToList = () => {
        setWorkError('')
        if (!newWork.title.trim()) { setWorkError("Asar nomi kiritilishi shart"); return }
        if (!newWork.pdfUrl.trim()) { setWorkError("PDF fayl yuklanishi shart"); return }
        setWorks(prev => [...prev, { ...newWork, sortOrder: prev.length }])
        setNewWork(emptyWorkForm())
        setAddingWork(false)
    }

    const handleRemoveWork = async (work: LocalWork) => {
        if (work.saved && work.id) {
            if (!confirm("Asarni o'chirishni tasdiqlaysizmi?")) return
            try {
                await figureService.deleteWork(work.id)
            } catch {
                setError("Asarni o'chirishda xatolik")
                return
            }
        }
        setWorks(prev => prev.filter(w => w.tempId !== work.tempId))
    }

    // Timeline handling
    const handleAddTimeline = () => {
        if (!newTimeline.year.trim() || !newTimeline.title.trim()) {
            alert("Yil va voqea sarlavhasi kiritilishi shart")
            return
        }
        setTimelineItems(prev => [...prev, newTimeline])
        setNewTimeline({ year: '', title: '', desc: '' })
    }

    const handleRemoveTimeline = (index: number) => {
        setTimelineItems(prev => prev.filter((_, idx) => idx !== index))
    }

    // Gallery Photos handling
    const handleAddGalleryPhoto = () => {
        if (!newPhoto.url.trim()) {
            alert("Rasm yuklanishi shart")
            return
        }
        setGalleryPhotos(prev => [...prev, { title: newPhoto.title.trim() || 'Tarixiy fotosurat', url: newPhoto.url }])
        setNewPhoto({ title: '', url: '' })
    }

    const handleRemoveGalleryPhoto = (index: number) => {
        setGalleryPhotos(prev => prev.filter((_, idx) => idx !== index))
    }

    // Save
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.nameUz.trim()) { setError("O'zbekcha ism kiritilishi shart"); return }
        if (!form.bioUz.trim()) { setError("O'zbekcha biografiya kiritilishi shart"); return }
        if (!form.years.trim()) { setError("Yillar kiritilishi shart"); return }

        setSaving(true)
        setError('')

        const payload = {
            ...form,
            timelineJson: JSON.stringify(timelineItems),
            galleryPhotosJson: JSON.stringify(galleryPhotos),
        }

        try {
            let figureId: number

            if (editItem) {
                const updated = await figureService.update(editItem.id, payload as any)
                setFigures(prev => prev.map(f => f.id === editItem.id ? updated : f))
                figureId = editItem.id
            } else {
                const created = await figureService.create(payload as any)
                setFigures(prev => [...prev, created])
                figureId = created.id
            }

            // Save new works
            const newWorks = works.filter(w => !w.saved)
            for (const w of newWorks) {
                await figureService.addWork(figureId, {
                    title: w.title,
                    year: w.year ? Number(w.year) : undefined,
                    pdfUrl: w.pdfUrl,
                    sortOrder: w.sortOrder,
                })
            }

            handleCancel()
            await fetchFigures()
        } catch (err: any) {
            setError(err?.message || 'Saqlashda xato yuz berdi')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditItem(null)
        setForm(emptyForm)
        setWorks([])
        setTimelineItems([])
        setGalleryPhotos([])
        setError('')
        setAddingWork(false)
        setNewWork(emptyWorkForm())
        setWorkError('')
    }

    const filteredFigures = figures.filter(f =>
        f.nameUz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.titleUz && f.titleUz.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.region && f.region.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
            <header style={{ background: 'var(--bg-header)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href={`/${locale}/admin/dashboard`} style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)', fontSize: '13px', textDecoration: 'none' }}>← Dashboard</Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#fff', fontWeight: '600' }}>Jadidlar Boshqaruvi</span>
                </div>
                <button onClick={() => { removeToken(); router.push(`/${locale}/admin`) }} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>
                    Chiqish
                </button>
            </header>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', color: 'var(--text-heading)', marginBottom: '4px' }}>Jadidlar Portali Boshqaruvi</h1>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Tarixiy shaxslar, ularning asarlari, shajarasi va fotogalereyalarini boshqaring</p>
                    </div>
                    {!showForm && (
                        <button onClick={handleNewFigure} className="btn-primary" style={{ border: 'none', cursor: 'pointer', padding: '12px 24px', borderRadius: '8px', fontWeight: '600' }}>
                            + Yangi Jadid qo'shish
                        </button>
                    )}
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#ef4444', fontSize: '14px' }}>
                        ⚠ {error}
                    </div>
                )}

                {showForm ? (
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-md)', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '20px', color: 'var(--text-heading)' }}>
                                {editItem ? `Tahrirlash: ${editItem.nameUz}` : 'Yangi Jadid Qo\'shish'}
                            </h2>
                            <button onClick={handleCancel} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                        </div>

                        {/* Top Sub-tabs */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                            <button type="button" onClick={() => setActiveTab('info')} style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: activeTab === 'info' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'info' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                👤 Asosiy ma'lumotlar
                            </button>
                            <button type="button" onClick={() => setActiveTab('timeline')} style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: activeTab === 'timeline' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'timeline' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                ⏳ Vaqt shajarasi ({timelineItems.length})
                            </button>
                            <button type="button" onClick={() => setActiveTab('gallery')} style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: activeTab === 'gallery' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'gallery' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                🖼 Foto va Hujjatlar ({galleryPhotos.length})
                            </button>
                            <button type="button" onClick={() => setActiveTab('works')} style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: activeTab === 'works' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'works' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                📚 Asarlar & PDF ({works.length})
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* TAB 1: Asosiy ma'lumotlar */}
                            {activeTab === 'info' && (
                                <div>
                                    {/* Language selector */}
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '8px', width: 'fit-content' }}>
                                        {LANGS.map(l => (
                                            <button
                                                key={l.key}
                                                type="button"
                                                onClick={() => setActiveLang(l.key as any)}
                                                style={{
                                                    padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                                    background: activeLang === l.key ? 'var(--gold)' : 'transparent',
                                                    color: activeLang === l.key ? '#061d15' : 'var(--text-muted)',
                                                    fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px'
                                                }}
                                            >
                                                <span>{l.flag}</span>
                                                <span>{l.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Multi-language inputs */}
                                    {activeLang === 'uz' && (
                                        <>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Ism va Familiya (O'zbekcha) *</label>
                                                <input type="text" value={form.nameUz} onChange={e => setForm({ ...form, nameUz: e.target.value })} required style={inputStyle} placeholder="Abdulla Avloniy" />
                                            </div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Unvon / Faoliyati (O'zbekcha)</label>
                                                <input type="text" value={form.titleUz} onChange={e => setForm({ ...form, titleUz: e.target.value })} style={inputStyle} placeholder="Shoir, dramaturg, pedagog, matbuot asoschisi" />
                                            </div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Tarjimai hol (O'zbekcha) *</label>
                                                <textarea rows={5} value={form.bioUz} onChange={e => setForm({ ...form, bioUz: e.target.value })} required style={{ ...inputStyle, resize: 'vertical' }} placeholder="Jadid haqida to'liq ma'lumot..." />
                                            </div>
                                        </>
                                    )}

                                    {activeLang === 'ru' && (
                                        <>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Имя и Фамилия (Русский)</label>
                                                <input type="text" value={form.nameRu} onChange={e => setForm({ ...form, nameRu: e.target.value })} style={inputStyle} placeholder="Абдулла Авлоний" />
                                            </div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Деятельность / Звание (Русский)</label>
                                                <input type="text" value={form.titleRu} onChange={e => setForm({ ...form, titleRu: e.target.value })} style={inputStyle} placeholder="Поэт, драматург, педагог, издатель" />
                                            </div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Биография (Русский)</label>
                                                <textarea rows={5} value={form.bioRu} onChange={e => setForm({ ...form, bioRu: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Биография на русском..." />
                                            </div>
                                        </>
                                    )}

                                    {activeLang === 'en' && (
                                        <>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Full Name (English)</label>
                                                <input type="text" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} style={inputStyle} placeholder="Abdulla Avloniy" />
                                            </div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Title / Profession (English)</label>
                                                <input type="text" value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} style={inputStyle} placeholder="Poet, playwright, educator, publisher" />
                                            </div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>Biography (English)</label>
                                                <textarea rows={5} value={form.bioEn} onChange={e => setForm({ ...form, bioEn: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Biography in English..." />
                                            </div>
                                        </>
                                    )}

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                        <div>
                                            <label style={labelStyle}>Yashagan yillari *</label>
                                            <input type="text" value={form.years} onChange={e => setForm({ ...form, years: e.target.value })} required style={inputStyle} placeholder="1878–1934" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Harakat markazi (Hudud)</label>
                                            <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} style={inputStyle}>
                                                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                        <div>
                                            <label style={labelStyle}>Soha / Kategoriya</label>
                                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Tartib raqami (Sort Order)</label>
                                            <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} style={inputStyle} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Hikmatli so'zi / Mashhur iqtibosi</label>
                                        <textarea rows={2} value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tarbiya biz uchun yo hayot — yo mamot..." />
                                    </div>

                                    {/* Portrait Image Upload */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={labelStyle}>Jadid portret rasmi</label>
                                        {form.imageUrl && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                                <img src={form.imageUrl} alt="Preview" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                <button type="button" onClick={() => setForm({ ...form, imageUrl: '' })} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Rasmni o'chirish ✕</button>
                                            </div>
                                        )}
                                        <FileUpload folder="jadidlar" accept="image/*" onUpload={url => setForm({ ...form, imageUrl: url })} label="Portret yuklash" />
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                                            <span style={{ fontSize: '14px', fontWeight: '500' }}>Markaziy yetakchi (Featured) sifatida belgilash</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: Vaqt shajarasi (Timeline) */}
                            {activeTab === 'timeline' && (
                                <div>
                                    <h3 style={{ fontSize: '16px', color: 'var(--text-heading)', marginBottom: '12px' }}>Tarixiy Vaqt Shajarasi (Timeline)</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Jadid hayotidagi muhim sanalar va voqealar zanjiri</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                        {timelineItems.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                <div>
                                                    <span style={{ color: 'var(--gold)', fontWeight: '700', fontFamily: 'var(--font-mono)', marginRight: '12px' }}>{item.year}</span>
                                                    <span style={{ fontWeight: '600', marginRight: '12px' }}>{item.title}</span>
                                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.desc}</span>
                                                </div>
                                                <button type="button" onClick={() => handleRemoveTimeline(idx)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px' }}>O'chirish</button>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '10px', border: '1px dashed var(--border-color)' }}>
                                        <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>+ Yangi sana/voqea qo'shish</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginBottom: '12px' }}>
                                            <input type="text" value={newTimeline.year} onChange={e => setNewTimeline({ ...newTimeline, year: e.target.value })} placeholder="Yil (1904)" style={inputStyle} />
                                            <input type="text" value={newTimeline.title} onChange={e => setNewTimeline({ ...newTimeline, title: e.target.value })} placeholder="Voqea sarlavhasi (Yangi usul maktabi)" style={inputStyle} />
                                        </div>
                                        <textarea rows={2} value={newTimeline.desc} onChange={e => setNewTimeline({ ...newTimeline, desc: e.target.value })} placeholder="Qisqacha tavsif..." style={{ ...inputStyle, resize: 'vertical', marginBottom: '12px' }} />
                                        <button type="button" onClick={handleAddTimeline} style={{ padding: '8px 16px', background: 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                                            + Voqeani qo'shish
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: Foto va Hujjatlar arxivi */}
                            {activeTab === 'gallery' && (
                                <div>
                                    <h3 style={{ fontSize: '16px', color: 'var(--text-heading)', marginBottom: '12px' }}>Foto va Tarixiy Hujjatlar Arxivi</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Ushbu jadidga tegishli qo'shimcha fotosuratlar va hujjatlar</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                        {galleryPhotos.map((photo, idx) => (
                                            <div key={idx} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                                <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                                                <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.title}</span>
                                                    <button type="button" onClick={() => handleRemoveGalleryPhoto(idx)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '10px', border: '1px dashed var(--border-color)' }}>
                                        <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>+ Yangi fotosurat yuklash</h4>
                                        <div style={{ marginBottom: '12px' }}>
                                            <input type="text" value={newPhoto.title} onChange={e => setNewPhoto({ ...newPhoto, title: e.target.value })} placeholder="Surat yoki hujjat tavsifi (masalan: 1913-yilgi shaxsiy surati)" style={inputStyle} />
                                        </div>
                                        <div style={{ marginBottom: '12px' }}>
                                            <FileUpload folder="jadidlar_gallery" accept="image/*" onUpload={url => setNewPhoto({ ...newPhoto, url })} label="Fotosuratni tanlash va yuklash" />
                                        </div>
                                        {newPhoto.url && (
                                            <button type="button" onClick={handleAddGalleryPhoto} style={{ padding: '8px 16px', background: 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                                                + Galereyaga kiritish
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: Asarlar & PDF */}
                            {activeTab === 'works' && (
                                <div>
                                    <h3 style={{ fontSize: '16px', color: 'var(--text-heading)', marginBottom: '12px' }}>Ilmiy va Adabiy Asarlari (PDF kitoblar)</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Foydalanuvchilar o'qishi va yuklab olishi uchun PDF kitoblar</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                                        {works.map((work) => (
                                            <div key={work.tempId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                <div>
                                                    <span style={{ fontWeight: '600', marginRight: '10px' }}>📖 {work.title}</span>
                                                    {work.year && <span style={{ color: 'var(--gold)', fontSize: '13px', marginRight: '10px' }}>({work.year}-yil)</span>}
                                                    <a href={work.pdfUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'underline' }}>PDF ochish</a>
                                                </div>
                                                <button type="button" onClick={() => handleRemoveWork(work)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px' }}>O'chirish</button>
                                            </div>
                                        ))}
                                    </div>

                                    {addingWork ? (
                                        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                            <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Yangi kitob / asar kiritish</h4>
                                            {workError && <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '10px' }}>{workError}</div>}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px', marginBottom: '12px' }}>
                                                <input type="text" value={newWork.title} onChange={e => setNewWork({ ...newWork, title: e.target.value })} placeholder="Asar nomi (masalan: Turkiy Guliston)" style={inputStyle} />
                                                <input type="number" value={newWork.year} onChange={e => setNewWork({ ...newWork, year: e.target.value })} placeholder="Yili (1913)" style={inputStyle} />
                                            </div>
                                            <div style={{ marginBottom: '12px' }}>
                                                <FileUpload folder="books" accept=".pdf" onUpload={url => setNewWork({ ...newWork, pdfUrl: url })} label="PDF faylni yuklash" />
                                                {newWork.pdfUrl && <span style={{ color: '#22c55e', fontSize: '12px' }}>✓ PDF muvaffaqiyatli yuklandi</span>}
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button type="button" onClick={handleAddWorkToList} style={{ padding: '8px 16px', background: 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                                                    Saqlash
                                                </button>
                                                <button type="button" onClick={() => setAddingWork(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer' }}>
                                                    Bekor qilish
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => setAddingWork(true)} style={{ padding: '10px 18px', background: 'var(--bg-secondary)', border: '1px dashed var(--gold)', color: 'var(--gold)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                            + Asar / PDF kitob qo'shish
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                                <button type="button" onClick={handleCancel} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                    Bekor qilish
                                </button>
                                <button type="submit" disabled={saving} style={{ padding: '12px 28px', background: saving ? 'rgba(201,168,76,0.5)' : 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer' }}>
                                    {saving ? 'Saqlanmoqda...' : (editItem ? 'O\'zgarishlarni Saqlash' : 'Jadidni Yaratish')}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}

                {/* Figures List */}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Jadid nomi, unvoni yoki hududi bo'yicha qidirish..."
                        style={{ ...inputStyle, maxWidth: '400px', marginBottom: '20px' }}
                    />
                </div>

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Yuklanmoqda...</div>
                ) : filteredFigures.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        Hech qanday jadid topilmadi
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {filteredFigures.map(item => (
                            <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
                                        <div style={{ width: '56px', height: '68px', borderRadius: '6px', overflow: 'hidden', background: '#0a1829', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.nameUz} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '20px' }}>👤</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '17px', color: 'var(--text-heading)', fontWeight: '600', marginBottom: '2px' }}>{item.nameUz}</h3>
                                            <div style={{ fontSize: '13px', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{item.years}</div>
                                            {item.region && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 {item.region}</span>}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px' }}>
                                        {item.bioUz}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {item.featured && <span style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', marginRight: '6px' }}>★ Yetakchi</span>}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(item)} style={{ padding: '6px 12px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                            Tahrirlash
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                            O'chirish
                                        </button>
                                    </div>
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
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-main)',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
}