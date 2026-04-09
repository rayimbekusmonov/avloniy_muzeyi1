'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, removeToken } from '@/lib/api'
import { figureService } from '@/lib/services'
import { HistoricalFigure } from '@/lib/api'
import FileUpload from '@/components/FileUpload'

const LANGS = [
    { key: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { key: 'ru', label: 'Русский', flag: '🇷🇺' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
]

// Asar uchun local tip (backendga yuborishdan oldin)
interface LocalWork {
    tempId: string        // faqat local
    title: string
    year: string
    pdfUrl: string
    sortOrder: number
    // Saqlangan asarlar uchun (tahrirlashda)
    id?: number
    saved?: boolean
}

const emptyForm = {
    nameUz: '', nameRu: '', nameEn: '',
    titleUz: '', titleRu: '', titleEn: '',
    bioUz: '', bioRu: '', bioEn: '',
    years: '',
    imageUrl: '',
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
    const [figures, setFigures] = useState<HistoricalFigure[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<HistoricalFigure | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Asarlar ro'yxati (yangi va mavjud)
    const [works, setWorks] = useState<LocalWork[]>([])
    const [addingWork, setAddingWork] = useState(false)
    const [newWork, setNewWork] = useState<LocalWork>(emptyWorkForm())
    const [workError, setWorkError] = useState('')

    const fetchFigures = useCallback(async () => {
        setLoading(true)
        try {
            const data = await figureService.getAllForAdmin()
            setFigures(data)
        } catch {
            setError('Jadidlar yuklanmadi')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isAuthenticated()) { router.push('/admin'); return }
        fetchFigures()
    }, [fetchFigures, router])

    const handleEdit = (item: HistoricalFigure) => {
        setEditItem(item)
        setForm({
            nameUz: item.nameUz || '', nameRu: item.nameRu || '', nameEn: item.nameEn || '',
            titleUz: item.titleUz || '', titleRu: item.titleRu || '', titleEn: item.titleEn || '',
            bioUz: item.bioUz || '', bioRu: item.bioRu || '', bioEn: item.bioEn || '',
            years: item.years || '',
            imageUrl: item.imageUrl || '',
            featured: item.featured || false,
            sortOrder: item.sortOrder || 0,
            works: item.works || '',
            pdfUrl: item.pdfUrl || '',
        })
        // Mavjud asarlarni local ro'yxatga yuklash
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
        setShowForm(true)
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }

    const handleNewFigure = () => {
        setEditItem(null)
        setForm(emptyForm)
        setWorks([])
        setActiveLang('uz')
        setShowForm(true)
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Jadidni o'chirishni tasdiqlaysizmi?")) return
        try {
            await figureService.delete(id)
            setFigures(prev => prev.filter(f => f.id !== id))
        } catch { setError("O'chirishda xato yuz berdi") }
    }

    // === ASARLAR BILAN ISHLASH ===

    const handleAddWorkToList = () => {
        setWorkError('')
        if (!newWork.title.trim()) { setWorkError("Asar nomi kiritilishi shart"); return }
        if (!newWork.pdfUrl.trim()) { setWorkError("PDF fayl yuklanishi shart"); return }
        setWorks(prev => [...prev, { ...newWork, sortOrder: prev.length }])
        setNewWork(emptyWorkForm())
        setAddingWork(false)
    }

    const handleRemoveWork = async (work: LocalWork) => {
        // Agar saqlangan asar bo'lsa — backenddan o'chirish
        if (work.saved && work.id) {
            if (!confirm("Asarni o'chirishni tasdiqlaysizmi?")) return
            try {
                await figureService.deleteWork(work.id)
            } catch {
                setError("Asarni o'chirishda xato")
                return
            }
        }
        setWorks(prev => prev.filter(w => w.tempId !== work.tempId))
    }

    // === SAQLASH ===

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.nameUz.trim()) { setError("O'zbekcha ism kiritilishi shart"); return }
        if (!form.bioUz.trim()) { setError("O'zbekcha biografiya kiritilishi shart"); return }
        if (!form.years.trim()) { setError("Yillar kiritilishi shart"); return }
        setSaving(true); setError('')

        try {
            let figureId: number

            if (editItem) {
                const updated = await figureService.update(editItem.id, form as any)
                setFigures(prev => prev.map(f => f.id === editItem.id ? updated : f))
                figureId = editItem.id
            } else {
                const created = await figureService.create(form as any)
                setFigures(prev => [...prev, created])
                figureId = created.id
            }

            // Yangi asarlarni saqlash (saved=false bo'lganlar)
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
            await fetchFigures() // Ro'yxatni yangilash
        } catch (err: any) {
            setError(err.message || 'Xato yuz berdi')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditItem(null)
        setForm(emptyForm)
        setWorks([])
        setError('')
        setAddingWork(false)
        setNewWork(emptyWorkForm())
        setWorkError('')
    }

    const setLangField = (field: string, value: string) => {
        const key = `${field}${activeLang.charAt(0).toUpperCase() + activeLang.slice(1)}`
        setForm(p => ({ ...p, [key]: value }))
    }
    const getLangField = (field: string) => {
        const key = `${field}${activeLang.charAt(0).toUpperCase() + activeLang.slice(1)}`
        return (form as any)[key] || ''
    }
    const getLangStatus = (lang: string) => {
        const name = (form as any)[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`]
        const bio = (form as any)[`bio${lang.charAt(0).toUpperCase() + lang.slice(1)}`]
        if (name && bio) return 'done'
        if (name || bio) return 'partial'
        return 'empty'
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
            <header style={{ background: 'var(--navy-dark)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/admin/dashboard" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontSize: '12px', textDecoration: 'none' }}>← Dashboard</Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff' }}>Jadidlar</span>
                </div>
                <button onClick={() => { removeToken(); router.push('/admin') }} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>Chiqish</button>
            </header>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '26px', color: 'var(--navy-dark)' }}>Jadidlar boshqaruvi</h1>
                    {!showForm && (
                        <button onClick={handleNewFigure} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>+ Yangi qo'shish</button>
                    )}
                </div>

                {error && (
                    <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#dc2626', fontSize: '14px' }}>{error}</div>
                )}

                {showForm && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', marginBottom: '32px', border: '1px solid rgba(27,58,107,0.1)', boxShadow: '0 4px 20px rgba(27,58,107,0.08)' }}>
                        <h2 style={{ fontSize: '20px', color: 'var(--navy-dark)', marginBottom: '28px' }}>
                            {editItem ? 'Jadidni tahrirlash' : "Yangi jadid qo'shish"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {/* Asosiy ma'lumotlar */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={labelStyle}>Rasm</label>
                                    <FileUpload folder="jadidlar" accept="image/*" label="Rasm yuklash" onUpload={(url) => setForm(p => ({ ...p, imageUrl: url }))} />
                                    {form.imageUrl && (
                                        <img src={form.imageUrl} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />
                                    )}
                                </div>
                                <div>
                                    <label style={labelStyle}>Yillar * (masalan: 1878–1934)</label>
                                    <input value={form.years} onChange={e => setForm(p => ({ ...p, years: e.target.value }))} required style={inputStyle} placeholder="1878–1934" />
                                    <label style={{ ...labelStyle, marginTop: '16px' }}>Tartib raqami</label>
                                    <input type="number" value={form.sortOrder} onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))} style={inputStyle} min={0} />
                                </div>
                            </div>

                            {/* Markaziy shaxs belgisi */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--gold)' }} />
                                <label htmlFor="featured" style={{ fontSize: '15px', color: 'var(--navy-dark)', cursor: 'pointer' }}>Markaziy shaxs (bosh sahifada alohida ko'rsatiladi)</label>
                            </div>

                            {/* Til tablari */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid rgba(27,58,107,0.1)' }}>
                                    {LANGS.map(lang => {
                                        const status = getLangStatus(lang.key)
                                        return (
                                            <button key={lang.key} type="button" onClick={() => setActiveLang(lang.key as any)} style={{
                                                padding: '10px 24px', border: 'none',
                                                borderBottom: activeLang === lang.key ? '2px solid var(--navy)' : '2px solid transparent',
                                                background: 'none', cursor: 'pointer',
                                                fontFamily: 'var(--font-mono)', fontSize: '13px',
                                                color: activeLang === lang.key ? 'var(--navy-dark)' : 'var(--gray-400)',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                            }}>
                                                <span>{lang.flag}</span><span>{lang.label}</span>
                                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: status === 'done' ? '#16a34a' : status === 'partial' ? '#f59e0b' : 'rgba(27,58,107,0.2)' }} />
                                            </button>
                                        )
                                    })}
                                </div>
                                <div style={{ background: 'rgba(27,58,107,0.02)', border: '1px solid rgba(27,58,107,0.08)', padding: '20px', borderRadius: '0 0 8px 8px' }}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Ism {activeLang === 'uz' ? '*' : '(ixtiyoriy)'}</label>
                                        <input value={getLangField('name')} onChange={e => setLangField('name', e.target.value)} style={inputStyle} placeholder={activeLang === 'uz' ? 'Abdulla Avloniy' : activeLang === 'ru' ? 'Абдулла Авлоний' : 'Abdulla Avloniy'} />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Unvon / Kasb</label>
                                        <input value={getLangField('title')} onChange={e => setLangField('title', e.target.value)} style={inputStyle} placeholder={activeLang === 'uz' ? "Shoir, dramaturg, ma'rifatparvar" : activeLang === 'ru' ? 'Поэт, драматург, просветитель' : 'Poet, playwright, educator'} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Biografiya {activeLang === 'uz' ? '*' : '(ixtiyoriy)'}</label>
                                        <textarea value={getLangField('bio')} onChange={e => setLangField('bio', e.target.value)} rows={6} style={{ ...inputStyle, resize: 'vertical' }} placeholder={activeLang === 'uz' ? "Hayoti va faoliyati haqida..." : ''} />
                                    </div>
                                </div>
                            </div>

                            {/* === ELEKTRON ASARLAR BO'LIMI === */}
                            <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ ...labelStyle, color: 'var(--navy-dark)', fontSize: '13px' }}>
                                            📚 Elektron asarlar
                                        </label>
                                        <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '2px' }}>
                                            Asar nomi va PDF faylini qo'shing — frontend'da yuklab olish tugmasi ko'rinadi
                                        </p>
                                    </div>
                                    {!addingWork && (
                                        <button type="button" onClick={() => { setAddingWork(true); setWorkError('') }} style={{ padding: '8px 16px', background: 'var(--gold)', color: 'var(--navy-dark)', border: 'none', borderRadius: '6px', fontSize: '13px', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontWeight: '600' }}>
                                            + Asar qo'shish
                                        </button>
                                    )}
                                </div>

                                {/* Yangi asar qo'shish formasi */}
                                {addingWork && (
                                    <div style={{ background: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(27,58,107,0.1)' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                            <div>
                                                <label style={labelStyle}>Asar nomi *</label>
                                                <input
                                                    value={newWork.title}
                                                    onChange={e => setNewWork(p => ({ ...p, title: e.target.value }))}
                                                    style={inputStyle}
                                                    placeholder="Masalan: Turkiy Guliston yoxud axloq"
                                                    autoFocus
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Nashr yili</label>
                                                <input
                                                    type="number"
                                                    value={newWork.year}
                                                    onChange={e => setNewWork(p => ({ ...p, year: e.target.value }))}
                                                    style={inputStyle}
                                                    placeholder="1913"
                                                    min={1800}
                                                    max={2100}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '12px' }}>
                                            <label style={labelStyle}>PDF fayl *</label>
                                            <FileUpload
                                                folder="jadidlar/works"
                                                accept=".pdf"
                                                label="PDF yuklash"
                                                onUpload={(url) => setNewWork(p => ({ ...p, pdfUrl: url }))}
                                            />
                                            {newWork.pdfUrl && (
                                                <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
                                                    ✓ PDF yuklandi
                                                </p>
                                            )}
                                        </div>
                                        {workError && (
                                            <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '10px' }}>{workError}</p>
                                        )}
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="button" onClick={handleAddWorkToList} style={{ padding: '8px 20px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
                                                ✓ Qo'shish
                                            </button>
                                            <button type="button" onClick={() => { setAddingWork(false); setNewWork(emptyWorkForm()); setWorkError('') }} style={{ padding: '8px 16px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                                                Bekor
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Asarlar ro'yxati */}
                                {works.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {works.map((work, idx) => (
                                            <div key={work.tempId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#fff', borderRadius: '8px', border: '1px solid rgba(27,58,107,0.08)' }}>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gray-400)', minWidth: '20px' }}>{idx + 1}</span>
                                                <span style={{ fontSize: '18px' }}>📄</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '14px', color: 'var(--navy-dark)', fontWeight: '600' }}>{work.title}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '2px', display: 'flex', gap: '12px' }}>
                                                        {work.year && <span>📅 {work.year}-yil</span>}
                                                        {work.pdfUrl && <span style={{ color: '#16a34a' }}>✓ PDF mavjud</span>}
                                                        {work.saved && <span style={{ color: 'var(--gold)' }}>Saqlangan</span>}
                                                    </div>
                                                </div>
                                                {work.pdfUrl && (
                                                    <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--navy)', textDecoration: 'none', padding: '4px 10px', background: 'rgba(27,58,107,0.08)', borderRadius: '4px' }}>
                                                        Ko'rish ↗
                                                    </a>
                                                )}
                                                <button type="button" onClick={() => handleRemoveWork(work)} style={{ padding: '6px 10px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '6px', fontSize: '12px', color: '#dc2626', cursor: 'pointer' }}>
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '13px', color: 'var(--gray-400)', textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                                        Hali asarlar qo'shilmagan. "Asar qo'shish" tugmasini bosing.
                                    </p>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={handleCancel} className="btn-outline">Bekor qilish</button>
                                <button type="submit" disabled={saving} className="btn-primary" style={{ border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saqlanmoqda...' : editItem ? 'Saqlash' : "Qo'shish"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Jadidlar ro'yxati */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>Yuklanmoqda...</div>
                ) : figures.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>
                        <p>Hali jadidlar qo'shilmagan</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {figures.map(item => (
                            <div key={item.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(27,58,107,0.08)', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))', flexShrink: 0 }}>
                                    {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                        <h3 style={{ fontSize: '16px', color: 'var(--navy-dark)' }}>{item.nameUz}</h3>
                                        {item.featured && <span style={{ fontSize: '10px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '1px 6px', borderRadius: '4px' }}>MARKAZIY</span>}
                                        <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{item.years}</span>
                                        {item.figureWorks && item.figureWorks.length > 0 && (
                                            <span style={{ fontSize: '11px', color: '#16a34a', background: 'rgba(22,163,74,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                                                📄 {item.figureWorks.length} ta asar
                                            </span>
                                        )}
                                    </div>
                                    {item.titleUz && <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '2px' }}>{item.titleUz}</div>}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button onClick={() => handleEdit(item)} style={{ padding: '8px 16px', background: 'rgba(27,58,107,0.08)', border: '1px solid rgba(27,58,107,0.15)', borderRadius: '6px', fontSize: '13px', color: 'var(--navy)', cursor: 'pointer' }}>Tahrirlash</button>
                                    <button onClick={() => handleDelete(item.id)} style={{ padding: '8px 16px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '6px', fontSize: '13px', color: '#dc2626', cursor: 'pointer' }}>O'chirish</button>
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
    color: 'var(--gray-600)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px'
}
const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid rgba(27,58,107,0.2)',
    borderRadius: '8px', fontSize: '15px', color: 'var(--navy-dark)', outline: 'none', background: '#fff'
}