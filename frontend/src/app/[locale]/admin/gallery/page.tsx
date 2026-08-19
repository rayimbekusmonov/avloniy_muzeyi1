'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { isAuthenticated, removeToken } from '@/lib/api'
import { galleryService } from '@/lib/services'
import { GalleryItem } from '@/lib/api'
import FileUpload from '@/components/FileUpload'

const Icons = {
    Photo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    Video: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    Music: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    PhotoLg: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    VideoLg: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    MusicLg: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
}

const MEDIA_TYPES = [
    { value: 'PHOTO', Icon: Icons.Photo, label: 'Rasm' },
    { value: 'VIDEO', Icon: Icons.Video, label: 'Video' },
    { value: 'AUDIO', Icon: Icons.Music, label: 'Audio' },
]

const emptyForm = { title: '', fileUrl: '', thumbnailUrl: '', description: '', mediaType: 'PHOTO' }

export default function AdminGalleryPage() {
    const router = useRouter()
    const locale = useLocale()
    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<GalleryItem | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [sourceType, setSourceType] = useState<'upload' | 'url'>('upload')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [filterType, setFilterType] = useState('')

    useEffect(() => {
        if (!isAuthenticated()) { router.push(`/${locale}/admin`); return }
        fetchItems()
    }, [router, locale])

    const fetchItems = async () => {
        setLoading(true)
        try { const data = await galleryService.getAll(0, 100); setItems(data.content) }
        catch { setError('Galereya yuklanmadi') }
        finally { setLoading(false) }
    }

    const handleEdit = (item: GalleryItem) => {
        setEditItem(item)
        setForm({ title: item.title, fileUrl: item.fileUrl, thumbnailUrl: item.thumbnailUrl || '', description: item.description || '', mediaType: item.mediaType })
        setShowForm(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Elementni o'chirishni tasdiqlaysizmi?")) return
        try { await galleryService.delete(id); setItems(prev => prev.filter(i => i.id !== id)) }
        catch { setError("O'chirishda xato yuz berdi") }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true); setError('')
        try {
            if (editItem) { const u = await galleryService.update(editItem.id, form); setItems(prev => prev.map(i => i.id === editItem.id ? u : i)) }
            else { const c = await galleryService.create(form); setItems(prev => [c, ...prev]) }
            handleCancel()
        } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Xato yuz berdi') }
        finally { setSaving(false) }
    }

    const handleCancel = () => { setShowForm(false); setEditItem(null); setForm(emptyForm); setError('') }

    const getIcon = (type: string) => {
        if (type === 'VIDEO') return <Icons.VideoLg />
        if (type === 'AUDIO') return <Icons.MusicLg />
        return <Icons.PhotoLg />
    }

    const filtered = filterType ? items.filter(i => i.mediaType === filterType) : items

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
            <header style={{ background: 'var(--bg-header)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href={`/${locale}/admin/dashboard`} style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)', fontSize: '12px', textDecoration: 'none' }}>← Dashboard</Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff' }}>Galereya</span>
                </div>
                <button onClick={() => { removeToken(); router.push(`/${locale}/admin`) }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>Chiqish</button>
            </header>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <h1 style={{ fontSize: '26px', color: 'var(--text-heading)' }}>Galereya boshqaruvi</h1>
                    {!showForm && <button onClick={() => { setShowForm(true); setEditItem(null); setForm(emptyForm) }} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>+ Yangi media</button>}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {[{ value: '', label: 'Barchasi' }, ...MEDIA_TYPES].map(t => (
                        <button key={t.value} onClick={() => setFilterType(t.value)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid', borderColor: filterType === t.value ? 'var(--gold)' : 'var(--border-color)', background: filterType === t.value ? 'var(--gold)' : 'var(--bg-card)', color: filterType === t.value ? '#061d15' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {error && <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#dc2626', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

                {showForm && (
                    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '32px', marginBottom: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                        <h2 style={{ fontSize: '20px', color: 'var(--text-heading)', marginBottom: '28px' }}>{editItem ? 'Elementni tahrirlash' : 'Yangi media qo\'shish'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <div><label style={labelStyle}>Sarlavha *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required style={inputStyle} placeholder="Media sarlavhasi" /></div>
                                <div>
                                    <label style={labelStyle}>Turi *</label>
                                    <select value={form.mediaType} onChange={e => setForm(p => ({ ...p, mediaType: e.target.value }))} style={inputStyle}>
                                        {MEDIA_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Thumbnail</label>
                                    <FileUpload folder="gallery/thumbnails" accept="image/*" label="Thumbnail yuklash" onUpload={(url) => setForm(p => ({ ...p, thumbnailUrl: url }))} />
                                    {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginTop: '4px' }} />}
                                </div>
                                <div style={{ gridColumn: '1 / -1', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                    <label style={{ ...labelStyle, color: 'var(--gold)' }}>Media fayl yoki havola *</label>
                                    
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setSourceType('upload')}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                border: '1px solid',
                                                borderColor: sourceType === 'upload' ? 'var(--gold)' : 'var(--border-color)',
                                                background: sourceType === 'upload' ? 'rgba(201,168,76,0.15)' : 'var(--bg-card)',
                                                color: sourceType === 'upload' ? 'var(--gold)' : 'var(--text-muted)',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            📁 Kompyuterdan fayl yuklash
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSourceType('url')}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                border: '1px solid',
                                                borderColor: sourceType === 'url' ? 'var(--gold)' : 'var(--border-color)',
                                                background: sourceType === 'url' ? 'rgba(201,168,76,0.15)' : 'var(--bg-card)',
                                                color: sourceType === 'url' ? 'var(--gold)' : 'var(--text-muted)',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            🔗 Havola orqali (YouTube / Video URL)
                                        </button>
                                    </div>

                                    {sourceType === 'upload' ? (
                                        <div>
                                            <FileUpload folder="gallery" accept={form.mediaType === 'PHOTO' ? 'image/*' : form.mediaType === 'VIDEO' ? 'video/*' : 'audio/*'} label="Fayl yuklash" onUpload={(url) => setForm(p => ({ ...p, fileUrl: url }))} />
                                        </div>
                                    ) : (
                                        <div>
                                            <input
                                                type="text"
                                                value={form.fileUrl}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    let thumb = form.thumbnailUrl;
                                                    if (!thumb && val.includes('youtube.com/watch?v=')) {
                                                        const id = val.split('v=')[1]?.split('&')[0];
                                                        if (id) thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
                                                    } else if (!thumb && val.includes('youtu.be/')) {
                                                        const id = val.split('youtu.be/')[1]?.split('?')[0];
                                                        if (id) thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
                                                    }
                                                    setForm(p => ({ ...p, fileUrl: val, thumbnailUrl: thumb }));
                                                }}
                                                placeholder={form.mediaType === 'VIDEO' ? 'https://www.youtube.com/watch?v=... yoki video fayl havolasi' : 'https://... fayl to\'g\'ridan-to\'g\'ri havolasi'}
                                                style={inputStyle}
                                            />
                                        </div>
                                    )}

                                    {form.fileUrl && (
                                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                            <p style={{ fontSize: '12px', color: 'var(--text-main)', margin: 0, wordBreak: 'break-all' }}><strong>Tanlangan manzil:</strong> {form.fileUrl}</p>
                                            <button type="button" onClick={() => setForm(p => ({ ...p, fileUrl: '' }))} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>O'chirish ✕</button>
                                        </div>
                                    )}
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Tavsif</label>
                                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Element haqida qisqa ma'lumot" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                <button type="button" onClick={handleCancel} className="btn-outline" style={{ cursor: 'pointer' }}>Bekor qilish</button>
                                <button type="submit" disabled={saving} className="btn-primary" style={{ border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Yuklanmoqda...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Hali elementlar yo'q</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        {filtered.map(item => (
                            <div key={item.id} className="card">
                                <div style={{ height: '160px', background: 'var(--bg-header)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                    {item.mediaType === 'PHOTO' && item.fileUrl ? (
                                        <img src={item.thumbnailUrl || item.fileUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                    ) : (
                                        <div style={{ color: 'rgba(255,255,255,0.4)' }}>{getIcon(item.mediaType)}</div>
                                    )}
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '3px 8px', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px' }}>{item.mediaType}</div>
                                </div>
                                <div style={{ padding: '16px' }}>
                                    <h3 style={{ fontSize: '15px', color: 'var(--text-heading)', marginBottom: '4px', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                                    {item.description && <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</p>}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(item)} style={{ flex: 1, padding: '7px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-heading)', cursor: 'pointer' }}>Tahrirlash</button>
                                        <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '7px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '6px', fontSize: '13px', color: '#dc2626', cursor: 'pointer' }}>O'chirish</button>
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

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', fontFamily: 'var(--font-body)', color: 'var(--text-heading)', outline: 'none', background: 'var(--bg-main)' }