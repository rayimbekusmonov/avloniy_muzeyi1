'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, removeToken } from '@/lib/api'
import { resourceService } from '@/lib/services'
import { ResourceItem } from '@/lib/api'
import FileUpload from '@/components/FileUpload'


const RESOURCE_TYPES = [
    { value: 'EBOOK', label: '📖 E-kitob' },
    { value: 'ARTICLE', label: '📄 Maqola' },
    { value: 'RESEARCH', label: '🔬 Ilmiy ish' },
]

const emptyForm = {
    title: '',
    author: '',
    description: '',
    fileUrl: '',
    coverUrl: '',
    resourceType: 'EBOOK',
    publishedYear: new Date().getFullYear(),
    pageCount: 0,
}

export default function AdminResourcesPage() {
    const router = useRouter()
    const [items, setItems] = useState<ResourceItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<ResourceItem | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [filterType, setFilterType] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin')
            return
        }
        fetchItems()
    }, [router])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const data = await resourceService.getAll(0, 100)
            setItems(data.content)
        } catch {
            setError('Manbalar yuklanmadi')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (item: ResourceItem) => {
        setEditItem(item)
        setForm({
            title: item.title,
            author: item.author,
            description: item.description || '',
            fileUrl: item.fileUrl,
            coverUrl: item.coverUrl || '',
            resourceType: item.resourceType,
            publishedYear: item.publishedYear || new Date().getFullYear(),
            pageCount: item.pageCount || 0,
        })
        setShowForm(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Manbani o\'chirishni tasdiqlaysizmi?')) return
        try {
            await resourceService.delete(id)
            setItems(prev => prev.filter(i => i.id !== id))
        } catch {
            setError('O\'chirishda xato yuz berdi')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            if (editItem) {
                const updated = await resourceService.update(editItem.id, form)
                setItems(prev => prev.map(i => i.id === editItem.id ? updated : i))
            } else {
                const created = await resourceService.create(form)
                setItems(prev => [created, ...prev])
            }
            handleCancel()
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

    const filtered = items
        .filter(i => filterType ? i.resourceType === filterType : true)
        .filter(i => search
            ? i.title.toLowerCase().includes(search.toLowerCase()) ||
            i.author.toLowerCase().includes(search.toLowerCase())
            : true
        )

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
                    <Link href="/frontend/src/app/[locale]/admin/dashboard" style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        letterSpacing: '1px',
                    }}>← Dashboard</Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff' }}>
                        Manbalar
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '26px', color: 'var(--navy-dark)' }}>Manbalar boshqaruvi</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                        style={{ border: 'none', cursor: 'pointer' }}
                    >+ Yangi qo'shish</button>
                </div>

                {/* Filter + Search */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[{ value: '', label: 'Barchasi' }, ...RESOURCE_TYPES].map(t => (
                            <button
                                key={t.value}
                                onClick={() => setFilterType(t.value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid',
                                    borderColor: filterType === t.value ? 'var(--gold)' : 'rgba(27,58,107,0.2)',
                                    background: filterType === t.value ? 'var(--gold)' : '#fff',
                                    color: filterType === t.value ? 'var(--navy-dark)' : 'var(--gray-600)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                }}
                            >{t.label}</button>
                        ))}
                    </div>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Qidirish..."
                        style={{
                            padding: '8px 16px',
                            border: '1px solid rgba(27,58,107,0.2)',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontFamily: 'var(--font-body)',
                            outline: 'none',
                            minWidth: '200px',
                            background: '#fff',
                        }}
                    />
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
                            {editItem ? 'Manbani tahrirlash' : 'Yangi manba'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div>
                                    <label style={labelStyle}>Sarlavha *</label>
                                    <input
                                        value={form.title}
                                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                        required
                                        style={inputStyle}
                                        placeholder="Manba nomi"
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Muallif *</label>
                                    <input
                                        value={form.author}
                                        onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                                        required
                                        style={inputStyle}
                                        placeholder="Muallif ismi"
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Turi *</label>
                                    <select
                                        value={form.resourceType}
                                        onChange={e => setForm(p => ({ ...p, resourceType: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        {RESOURCE_TYPES.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Nashr yili</label>
                                    <input
                                        type="number"
                                        value={form.publishedYear}
                                        onChange={e => setForm(p => ({ ...p, publishedYear: Number(e.target.value) }))}
                                        style={inputStyle}
                                        min={1800}
                                        max={new Date().getFullYear()}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Fayl *</label>
                                    <FileUpload
                                        folder="resources"
                                        accept=".pdf,.epub,video/*,audio/*"
                                        label="Fayl yuklash (PDF, video, audio)"
                                        onUpload={(url) => setForm(p => ({ ...p, fileUrl: url }))}
                                    />
                                    {form.fileUrl && (
                                        <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px', wordBreak: 'break-all' }}>{form.fileUrl}</p>
                                    )}
                                </div>
                                <div>
                                    <label style={labelStyle}>Muqova rasmi</label>
                                    <FileUpload
                                        folder="resources/covers"
                                        accept="image/*"
                                        label="Muqova yuklash"
                                        onUpload={(url) => setForm(p => ({ ...p, coverUrl: url }))}
                                    />
                                    {form.coverUrl && (
                                        <img src={form.coverUrl} alt="" style={{ width: '56px', height: '72px', objectFit: 'cover', borderRadius: '4px', marginTop: '4px' }} />
                                    )}
                                </div>
                                <div>
                                    <label style={labelStyle}>Sahifalar soni</label>
                                    <input
                                        type="number"
                                        value={form.pageCount}
                                        onChange={e => setForm(p => ({ ...p, pageCount: Number(e.target.value) }))}
                                        style={inputStyle}
                                        min={0}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Tavsif</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                        rows={3}
                                        style={{ ...inputStyle, resize: 'vertical' }}
                                        placeholder="Manba haqida qisqa ma'lumot"
                                    />
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

                {/* List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>Yuklanmoqda...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>Hali manbalar yo'q</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filtered.map(item => (
                            <div key={item.id} style={{
                                background: '#fff',
                                borderRadius: '12px',
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                border: '1px solid rgba(27,58,107,0.08)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                {/* Cover */}
                                <div style={{
                                    width: '56px',
                                    height: '72px',
                                    borderRadius: '6px',
                                    background: item.coverUrl ? 'transparent' : 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {item.coverUrl ? (
                                        <img src={item.coverUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '24px' }}>
                                            {item.resourceType === 'EBOOK' ? '📖' : item.resourceType === 'ARTICLE' ? '📄' : '🔬'}
                                        </span>
                                    )}
                                </div>

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
                                            background: 'rgba(201,168,76,0.12)',
                                            color: 'var(--gold)',
                                            whiteSpace: 'nowrap',
                                        }}>{item.resourceType}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--gray-600)' }}>
                                        {item.author}
                                        {item.publishedYear ? ` · ${item.publishedYear}` : ''}
                                        {item.pageCount ? ` · ${item.pageCount} sahifa` : ''}
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
