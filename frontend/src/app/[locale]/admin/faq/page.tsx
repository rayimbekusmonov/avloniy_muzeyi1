'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { isAuthenticated, removeToken, FaqItem } from '@/lib/api'
import { faqService } from '@/lib/services'

const LANGS = [
    { key: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { key: 'ru', label: 'Русский', flag: '🇷🇺' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
]

const CATEGORIES = ['Tashrif', 'Manbalar', 'Galereya', 'Tadbirlar', 'Ekskursiya']

const emptyFaqForm = {
    questionUz: '', questionRu: '', questionEn: '',
    answerUz: '', answerRu: '', answerEn: '',
    category: 'Tashrif',
    sortOrder: 0,
}

export default function AdminFaqPage() {
    const router = useRouter()
    const locale = useLocale()

    const [faqs, setFaqs] = useState<FaqItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<FaqItem | null>(null)
    const [form, setForm] = useState(emptyFaqForm)
    const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const fetchFaqs = useCallback(async () => {
        setLoading(true)
        try {
            const data = await faqService.getAllForAdmin()
            setFaqs(data)
        } catch {
            setError("Savol-javoblarni yuklab bo'lmadi")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin`)
            return
        }
        fetchFaqs()
    }, [fetchFaqs, router, locale])

    const handleNew = () => {
        setEditItem(null)
        setForm({ ...emptyFaqForm, sortOrder: faqs.length + 1 })
        setActiveLang('uz')
        setShowForm(true)
    }

    const handleEdit = (item: FaqItem) => {
        setEditItem(item)
        setForm({
            questionUz: item.questionUz || '',
            questionRu: item.questionRu || '',
            questionEn: item.questionEn || '',
            answerUz: item.answerUz || '',
            answerRu: item.answerRu || '',
            answerEn: item.answerEn || '',
            category: item.category || 'Tashrif',
            sortOrder: item.sortOrder || 0,
        })
        setActiveLang('uz')
        setShowForm(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Ushbu savol-javobni o'chirishni tasdiqlaysizmi?")) return
        try {
            await faqService.delete(id)
            setFaqs(prev => prev.filter(f => f.id !== id))
        } catch {
            setError("O'chirishda xatolik yuz berdi")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.questionUz.trim() || !form.answerUz.trim()) {
            setError("O'zbekcha savol va javob kiritilishi shart")
            return
        }

        setSaving(true)
        setError('')
        setSuccessMessage('')

        try {
            if (editItem) {
                const updated = await faqService.update(editItem.id, form)
                setFaqs(prev => prev.map(f => f.id === editItem.id ? updated : f))
                setSuccessMessage("Savol-javob muvaffaqiyatli yangilandi!")
            } else {
                const created = await faqService.create(form)
                setFaqs(prev => [...prev, created])
                setSuccessMessage("Yangi savol-javob muvaffaqiyatli qo'shildi!")
            }
            setShowForm(false)
            setEditItem(null)
            setForm(emptyFaqForm)
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err: any) {
            setError(err?.message || "Saqlashda xato yuz berdi")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
            <header style={{ background: 'var(--bg-header)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href={`/${locale}/admin/dashboard`} style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)', fontSize: '13px', textDecoration: 'none' }}>← Dashboard</Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#fff', fontWeight: '600' }}>Savol-Javoblar (FAQ) Boshqaruvi</span>
                </div>
                <button onClick={() => { removeToken(); router.push(`/${locale}/admin`) }} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>
                    Chiqish
                </button>
            </header>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', color: 'var(--text-heading)', marginBottom: '4px' }}>Ko'p Beriladigan Savollar (FAQ)</h1>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Saytning FAQ sahifasidagi barcha savol va javoblarni boshqaring</p>
                    </div>
                    {!showForm && (
                        <button onClick={handleNew} className="btn-primary" style={{ border: 'none', cursor: 'pointer', padding: '12px 24px', borderRadius: '8px', fontWeight: '600' }}>
                            + Yangi Savol Qo'shish
                        </button>
                    )}
                </div>

                {successMessage && (
                    <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#22c55e', fontSize: '14px' }}>
                        ✓ {successMessage}
                    </div>
                )}

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#ef4444', fontSize: '14px' }}>
                        ⚠ {error}
                    </div>
                )}

                {showForm && (
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-md)', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                            <h2 style={{ fontSize: '18px', color: 'var(--text-heading)' }}>
                                {editItem ? "Savol-Javobni Tahrirlash" : "Yangi Savol-Javob Qo'shish"}
                            </h2>
                            <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Language tab */}
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
                                            fontWeight: '600', fontSize: '12px'
                                        }}
                                    >
                                        {l.flag} {l.label}
                                    </button>
                                ))}
                            </div>

                            {activeLang === 'uz' && (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Savol matni (O'zbekcha) *</label>
                                        <input type="text" value={form.questionUz} onChange={e => setForm({ ...form, questionUz: e.target.value })} required style={inputStyle} placeholder="Muzey qayerda joylashgan?" />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Javob matni (O'zbekcha) *</label>
                                        <textarea rows={4} value={form.answerUz} onChange={e => setForm({ ...form, answerUz: e.target.value })} required style={{ ...inputStyle, resize: 'vertical' }} placeholder="Muzey Toshkent shahri..." />
                                    </div>
                                </>
                            )}

                            {activeLang === 'ru' && (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Текст вопроса (Русский)</label>
                                        <input type="text" value={form.questionRu} onChange={e => setForm({ ...form, questionRu: e.target.value })} style={inputStyle} placeholder="Где находится музей?" />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Текст ответа (Русский)</label>
                                        <textarea rows={4} value={form.answerRu} onChange={e => setForm({ ...form, answerRu: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Музей расположен по адресу..." />
                                    </div>
                                </>
                            )}

                            {activeLang === 'en' && (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Question Text (English)</label>
                                        <input type="text" value={form.questionEn} onChange={e => setForm({ ...form, questionEn: e.target.value })} style={inputStyle} placeholder="Where is the museum located?" />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Answer Text (English)</label>
                                        <textarea rows={4} value={form.answerEn} onChange={e => setForm({ ...form, answerEn: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="The museum is located at..." />
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={labelStyle}>Kategoriya</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Tartib raqami</label>
                                    <input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer' }}>
                                    Bekor qilish
                                </button>
                                <button type="submit" disabled={saving} style={{ padding: '10px 24px', background: saving ? 'rgba(201,168,76,0.5)' : 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>
                                    {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* FAQ List */}
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Yuklanmoqda...</div>
                ) : faqs.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        Hozircha hech qanday savol kiritilmagan
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {faqs.map(item => (
                            <div key={item.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                        <span style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                                            {item.category || 'Tashrif'}
                                        </span>
                                        <h3 style={{ fontSize: '16px', color: 'var(--text-heading)', fontWeight: '600' }}>{item.questionUz}</h3>
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.answerUz}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button onClick={() => handleEdit(item)} style={{ padding: '6px 12px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                        Tahrirlash
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                        O'chirish
                                    </button>
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
