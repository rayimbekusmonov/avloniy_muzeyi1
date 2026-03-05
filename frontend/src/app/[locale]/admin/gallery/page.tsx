'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, removeToken } from '@/lib/api'
import { galleryService } from '@/lib/services'
import { GalleryItem } from '@/lib/api'
import FileUpload from '@/components/FileUpload'


const MEDIA_TYPES = [
    { value: 'PHOTO', label: '🖼️ Rasm' },
    { value: 'VIDEO', label: '🎥 Video' },
    { value: 'AUDIO', label: '🎵 Audio' },
]

const emptyForm = {
    title: '',
    fileUrl: '',
    thumbnailUrl: '',
    description: '',
    mediaType: 'PHOTO',
}

export default function AdminGalleryPage() {
    const router = useRouter()
    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<GalleryItem | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [filterType, setFilterType] = useState('')

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
            const data = await galleryService.getAll(0, 100)
            setItems(data.content)
        } catch {
            setError('Galereya yuklanmadi')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (item: GalleryItem) => {
        setEditItem(item)
        setForm({
            title: item.title,
            fileUrl: item.fileUrl,
            thumbnailUrl: item.thumbnailUrl || '',
            description: item.description || '',
            mediaType: item.mediaType,
        })
        setShowForm(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Elementni o\'chirishni tasdiqlaysizmi?')) return
        try {
            await galleryService.delete(id)
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
                const updated = await galleryService.update(editItem.id, form)
                setItems(prev => prev.map(i => i.id === editItem.id ? updated : i))
            } else {
                const created = await galleryService.create(form)
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

    const filtered = filterType ? items.filter(i => i.mediaType === filterType) : items

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
                        Galereya
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
                    <h1 style={{ fontSize: '26px', color: 'var(--navy-dark)' }}>Galereya boshqaruvi</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                        style={{ border: 'none', cursor: 'pointer' }}
                    >+ Yangi qo'shish</button>
                </div>

                {/* Filter */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    {[{ value: '', label: 'Barchasi' }, ...MEDIA_TYPES].map(t => (
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
                            {editItem ? 'Elementni tahrirlash' : 'Yangi element'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Sarlavha *</label>
                                    <input
                                        value={form.title}
                                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                        required
                                        style={inputStyle}
                                        placeholder="Element sarlavhasi"
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Media turi *</label>
                                    <select
                                        value={form.mediaType}
                                        onChange={e => setForm(p => ({ ...p, mediaType: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        {MEDIA_TYPES.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Thumbnail</label>
                                    <FileUpload
                                        folder="gallery/thumbnails"
                                        accept="image/*"
                                        label="Thumbnail yuklash"
                                        onUpload={(url) => setForm(p => ({ ...p, thumbnailUrl: url }))}
                                    />
                                    {form.thumbnailUrl && (
                                        <img src={form.thumbnailUrl} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginTop: '4px' }} />
                                    )}
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Fayl *</label>
                                    <FileUpload
                                        folder="gallery"
                                        accept={form.mediaType === 'PHOTO' ? 'image/*' : form.mediaType === 'VIDEO' ? 'video/*' : 'audio/*'}
                                        label="Fayl yuklash"
                                        onUpload={(url) => setForm(p => ({ ...p, fileUrl: url }))}
                                    />
                                    {form.fileUrl && (
                                        <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginTop: '4px', wordBreak: 'break-all' }}>{form.fileUrl}</p>
                                    )}
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Tavsif</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                        rows={3}
                                        style={{ ...inputStyle, resize: 'vertical' }}
                                        placeholder="Element haqida qisqa ma'lumot"
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

                {/* Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>Yuklanmoqda...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>Hali elementlar yo'q</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {filtered.map(item => (
                            <div key={item.id} className="card">
                                {/* Preview */}
                                <div style={{
                                    height: '160px',
                                    background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    {item.mediaType === 'PHOTO' && item.fileUrl ? (
                                        <img
                                            src={item.thumbnailUrl || item.fileUrl}
                                            alt={item.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                                        />
                                    ) : (
                                        <div style={{ fontSize: '40px' }}>
                                            {item.mediaType === 'VIDEO' ? '🎥' : item.mediaType === 'AUDIO' ? '🎵' : '🖼️'}
                                        </div>
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: 'rgba(0,0,0,0.5)',
                                        color: '#fff',
                                        padding: '3px 8px',
                                        borderRadius: '10px',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '10px',
                                        letterSpacing: '1px',
                                    }}>{item.mediaType}</div>
                                </div>

                                <div style={{ padding: '16px' }}>
                                    <h3 style={{
                                        fontSize: '15px',
                                        color: 'var(--navy-dark)',
                                        marginBottom: '4px',
                                        fontFamily: 'var(--font-display)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>{item.title}</h3>
                                    {item.description && (
                                        <p style={{
                                            fontSize: '13px',
                                            color: 'var(--gray-600)',
                                            marginBottom: '12px',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}>{item.description}</p>
                                    )}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            style={{
                                                flex: 1,
                                                padding: '7px',
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
                                                flex: 1,
                                                padding: '7px',
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
