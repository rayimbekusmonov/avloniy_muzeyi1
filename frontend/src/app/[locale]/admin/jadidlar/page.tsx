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
    figureWorks: []
}

const emptyWorkForm = { title: '', year: '', pdfUrl: '' }

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

    // Asarlar uchun state-lar
    const [showWorkForm, setShowWorkForm] = useState(false)
    const [workForm, setWorkForm] = useState(emptyWorkForm)

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
            figureWorks: item.figureWorks || []
        })
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

    // --- ASARLAR BILAN ISHLASH ---
    const handleAddWork = async () => {
        if (!workForm.title || !workForm.pdfUrl || !editItem) {
            alert("Asar nomi va PDF fayli majburiy!");
            return;
        }
        try {
            const work = await figureService.addWork(editItem.id, {
                title: workForm.title,
                year: workForm.year ? Number(workForm.year) : undefined,
                pdfUrl: workForm.pdfUrl,
            })
            // State-ni yangilash: editItem ichidagi figureWorks ro'yxatiga yangi asarni qo'shish
            setEditItem(prev => prev ? { ...prev, figureWorks: [...(prev.figureWorks || []), work] } : prev)
            setWorkForm(emptyWorkForm)
            setShowWorkForm(false)
        } catch {
            setError("Asar qo'shishda xato yuz berdi")
        }
    }

    const handleDeleteWork = async (workId: number) => {
        if (!confirm("Asarni o'chirishni tasdiqlaysizmi?")) return
        try {
            await figureService.deleteWork(workId)
            setEditItem(prev => prev ? {
                ...prev,
                figureWorks: (prev.figureWorks || []).filter(w => w.id !== workId)
            } : prev)
        } catch {
            setError("Asarni o'chirishda xato yuz berdi")
        }
    }
    // ----------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.nameUz.trim()) { setError("O'zbekcha ism kiritilishi shart"); return }
        if (!form.bioUz.trim()) { setError("O'zbekcha biografiya kiritilishi shart"); return }
        if (!form.years.trim()) { setError("Yillar kiritilishi shart"); return }
        setSaving(true); setError('')
        try {
            if (editItem) {
                const updated = await figureService.update(editItem.id, form as any)
                setFigures(prev => prev.map(f => f.id === editItem.id ? updated : f))
            } else {
                const created = await figureService.create(form as any)
                setFigures(prev => [...prev, created])
            }
            handleCancel()
        } catch (err: any) {
            setError(err.message || 'Xato yuz berdi')
        } finally { setSaving(false) }
    }

    const handleCancel = () => {
        setShowForm(false); setEditItem(null); setForm(emptyForm); setError('')
        setShowWorkForm(false); setWorkForm(emptyWorkForm)
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
                        <button onClick={() => { setShowForm(true); setActiveLang('uz') }} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>+ Yangi qo'shish</button>
                    )}
                </div>

                {error && (
                    <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#dc2626', fontSize: '14px' }}>{error}</div>
                )}

                {showForm && (
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', marginBottom: '32px', border: '1px solid rgba(27,58,107,0.1)', boxShadow: '0 4px 20px rgba(27,58,107,0.08)' }}>
                        <h2 style={{ fontSize: '20px', color: 'var(--navy-dark)', marginBottom: '28px' }}>
                            {editItem ? 'Jadidni tahrirlash' : 'Yangi jadid qo\'shish'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={labelStyle}>Rasm *</label>
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

                            {/* ASARLAR BO'LIMI - FAQAT TAHRIRLASHDA */}
                            {editItem && (
                                <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(27,58,107,0.02)', border: '1px solid rgba(27,58,107,0.08)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <label style={labelStyle}>Elektron asarlar</label>
                                        <button type="button" onClick={() => setShowWorkForm(true)} style={{ padding: '6px 14px', background: 'var(--gold)', color: 'var(--navy-dark)', border: 'none', borderRadius: '6px', fontSize: '12px', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>+ Asar qo'shish</button>
                                    </div>

                                    {showWorkForm && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr auto', gap: '8px', marginBottom: '16px', alignItems: 'end' }}>
                                            <div>
                                                <label style={{ ...labelStyle, fontSize: '10px' }}>Asar nomi</label>
                                                <input value={workForm.title} onChange={e => setWorkForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} placeholder="Turkiy Guliston" />
                                            </div>
                                            <div>
                                                <label style={{ ...labelStyle, fontSize: '10px' }}>Yil</label>
                                                <input type="number" value={workForm.year} onChange={e => setWorkForm(p => ({ ...p, year: e.target.value }))} style={inputStyle} placeholder="1913" />
                                            </div>
                                            <div>
                                                <label style={{ ...labelStyle, fontSize: '10px' }}>PDF fayl</label>
                                                <FileUpload folder="jadidlar/works" accept=".pdf" label="PDF" onUpload={(url) => setWorkForm(p => ({ ...p, pdfUrl: url }))} />
                                            </div>
                                            <button type="button" onClick={handleAddWork} style={{ padding: '10px 16px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', height: '42px' }}>Saqlash</button>
                                        </div>
                                    )}

                                    {editItem.figureWorks && editItem.figureWorks.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {editItem.figureWorks.map(work => (
                                                <div key={work.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#fff', borderRadius: '6px', border: '1px solid rgba(27,58,107,0.1)' }}>
                                                    <span style={{ fontSize: '16px' }}>📄</span>
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ fontSize: '14px', color: 'var(--navy-dark)', fontWeight: '500' }}>{work.title}</span>
                                                        {work.year && <span style={{ fontSize: '12px', color: 'var(--gray-400)', marginLeft: '8px' }}>({work.year})</span>}
                                                    </div>
                                                    {work.pdfUrl && <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'none' }}>Yuklab olish ↓</a>}
                                                    <button type="button" onClick={() => handleDeleteWork(work.id)} style={{ padding: '4px 10px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '4px', fontSize: '12px', color: '#dc2626', cursor: 'pointer' }}>✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ fontSize: '13px', color: 'var(--gray-400)', textAlign: 'center', padding: '20px' }}>Hali asarlar qo'shilmagan</p>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--gold)' }} />
                                <label htmlFor="featured" style={{ fontSize: '15px', color: 'var(--navy-dark)', cursor: 'pointer' }}>Markaziy shaxs</label>
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
                                        <input value={getLangField('name')} onChange={e => setLangField('name', e.target.value)} style={inputStyle} />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Unvon</label>
                                        <input value={getLangField('title')} onChange={e => setLangField('title', e.target.value)} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Biografiya {activeLang === 'uz' ? '*' : '(ixtiyoriy)'}</label>
                                        <textarea value={getLangField('bio')} onChange={e => setLangField('bio', e.target.value)} rows={6} style={{ ...inputStyle, resize: 'vertical' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={handleCancel} className="btn-outline">Bekor qilish</button>
                                <button type="submit" disabled={saving} className="btn-primary">
                                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* LIST SECTION */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>Yuklanmoqda...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {figures.map(item => (
                            <div key={item.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(27,58,107,0.08)' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                                    {item.imageUrl && <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h3 style={{ fontSize: '16px', color: 'var(--navy-dark)' }}>{item.nameUz}</h3>
                                        {item.featured && <span style={{ fontSize: '10px', color: 'var(--gold)', border: '1px solid', padding: '1px 5px', borderRadius: '4px' }}>FEATURED</span>}
                                        <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{item.years}</span>
                                        {item.figureWorks && item.figureWorks.length > 0 && (
                                            <span style={{ fontSize: '11px', color: '#16a34a' }}>📄 {item.figureWorks.length} ta asar</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{item.titleUz}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleEdit(item)} className="btn-edit-small">Tahrirlash</button>
                                    <button onClick={() => handleDelete(item.id)} className="btn-delete-small">O'chirish</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--gray-600)', textTransform: 'uppercase', marginBottom: '6px' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid rgba(27,58,107,0.2)', borderRadius: '8px', fontSize: '15px', color: 'var(--navy-dark)', outline: 'none' }