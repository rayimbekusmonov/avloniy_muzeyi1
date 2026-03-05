'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, removeToken, api } from '@/lib/api'
import { ContactResponse, Page } from '@/lib/api'

async function fetchContacts(page = 0): Promise<Page<ContactResponse>> {
    return api.get(`/api/contact?page=${page}&size=20`)
}

async function markRead(id: number): Promise<ContactResponse> {
    return api.put(`/api/contact/${id}/read`, {})
}

async function deleteContact(id: number): Promise<void> {
    return api.delete(`/api/contact/${id}`)
}

export default function AdminContactsPage() {
    const router = useRouter()
    const [contacts, setContacts] = useState<ContactResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [selected, setSelected] = useState<ContactResponse | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin')
            return
        }
        fetchData()
    }, [router, page])

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await fetchContacts(page)
            setContacts(data.content)
            setTotalPages(data.totalPages)
        } catch {
            setError('Xabarlar yuklanmadi')
        } finally {
            setLoading(false)
        }
    }

    const handleRead = async (contact: ContactResponse) => {
        setSelected(contact)
        if (!contact.read) {
            try {
                const updated = await markRead(contact.id)
                setContacts(prev => prev.map(c => c.id === contact.id ? updated : c))
                setSelected(updated)
            } catch {
                // silent
            }
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Xabarni o\'chirishni tasdiqlaysizmi?')) return
        try {
            await deleteContact(id)
            setContacts(prev => prev.filter(c => c.id !== id))
            if (selected?.id === id) setSelected(null)
        } catch {
            setError('O\'chirishda xato')
        }
    }

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString('uz-UZ') + ' ' + d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    }

    const unreadCount = contacts.filter(c => !c.read).length

    return (
        <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
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
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff' }}>Xabarlar</span>
                    {unreadCount > 0 && (
                        <span style={{
                            background: 'var(--gold)',
                            color: 'var(--navy-dark)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '10px',
                        }}>{unreadCount} yangi</span>
                    )}
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

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                <h1 style={{ fontSize: '26px', color: 'var(--navy-dark)', marginBottom: '32px' }}>
                    Foydalanuvchi xabarlari
                </h1>

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

                <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '24px' }}>
                    <div>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>Yuklanmoqda...</div>
                        ) : contacts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>
                                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                                <p>Hali xabarlar yo'q</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {contacts.map(contact => (
                                    <div
                                        key={contact.id}
                                        onClick={() => handleRead(contact)}
                                        style={{
                                            background: selected?.id === contact.id ? 'rgba(201,168,76,0.08)' : '#fff',
                                            borderRadius: '12px',
                                            padding: '16px 20px',
                                            border: `1px solid ${selected?.id === contact.id ? 'rgba(201,168,76,0.3)' : 'rgba(27,58,107,0.08)'}`,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            boxShadow: 'var(--shadow-sm)',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: contact.read ? 'transparent' : 'var(--gold)',
                                            flexShrink: 0,
                                            border: contact.read ? '1px solid rgba(27,58,107,0.2)' : 'none',
                                        }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{
                                                    fontFamily: 'var(--font-display)',
                                                    fontSize: '15px',
                                                    color: 'var(--navy-dark)',
                                                    fontWeight: contact.read ? '400' : '600',
                                                }}>{contact.name}</span>
                                                <span style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '11px',
                                                    color: 'var(--gray-400)',
                                                }}>{formatDate(contact.createdAt as unknown as string)}</span>
                                            </div>
                                            <div style={{
                                                fontSize: '13px',
                                                color: 'var(--gray-600)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>{contact.subject}</div>
                                        </div>
                                        <button
                                            onClick={e => { e.stopPropagation(); handleDelete(contact.id) }}
                                            style={{
                                                padding: '6px 10px',
                                                background: 'rgba(220,38,38,0.08)',
                                                border: '1px solid rgba(220,38,38,0.2)',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                color: '#dc2626',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                            }}
                                        >✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                                        style={{ padding: '8px 16px', border: '1px solid rgba(27,58,107,0.2)', borderRadius: '8px', background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', color: page === 0 ? 'var(--gray-400)' : 'var(--navy)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>←</button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i} onClick={() => setPage(i)}
                                            style={{ padding: '8px 14px', border: '1px solid', borderColor: page === i ? 'var(--gold)' : 'rgba(27,58,107,0.2)', borderRadius: '8px', background: page === i ? 'var(--gold)' : '#fff', color: page === i ? 'var(--navy-dark)' : 'var(--navy)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{i + 1}</button>
                                ))}
                                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                                        style={{ padding: '8px 16px', border: '1px solid rgba(27,58,107,0.2)', borderRadius: '8px', background: '#fff', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', color: page === totalPages - 1 ? 'var(--gray-400)' : 'var(--navy)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>→</button>
                            </div>
                        )}
                    </div>

                    {selected && (
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '28px',
                            border: '1px solid rgba(27,58,107,0.1)',
                            boxShadow: 'var(--shadow-md)',
                            position: 'sticky',
                            top: '80px',
                            alignSelf: 'start',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--navy-dark)' }}>
                                    Xabar tafsiloti
                                </h3>
                                <button onClick={() => setSelected(null)} style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    color: 'var(--gray-400)',
                                }}>✕</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { label: 'Ism', value: selected.name },
                                    { label: 'Telefon', value: selected.phone || '—' },
                                    { label: 'Telegram', value: selected.telegram || '—' },
                                    { label: 'Mavzu', value: selected.subject },
                                    { label: 'Sana', value: formatDate(selected.createdAt as unknown as string) },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            {item.label}
                                        </div>
                                        <div style={{ fontSize: '15px', color: 'var(--navy-dark)' }}>{item.value}</div>
                                    </div>
                                ))}

                                <div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        Xabar
                                    </div>
                                    <div style={{
                                        fontSize: '15px',
                                        color: 'var(--navy-dark)',
                                        lineHeight: '1.8',
                                        background: 'var(--off-white)',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        whiteSpace: 'pre-wrap',
                                    }}>{selected.message}</div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                    {selected.phone && (
                                        <a
                                            href={`tel:${selected.phone}`}
                                            className="btn-primary"
                                            style={{ flex: 1, textAlign: 'center' }}
                                        >
                                            📞 Qo'ng'iroq
                                        </a>
                                    )}
                                    {selected.telegram && (
                                        <a
                                            href={`https://t.me/${selected.telegram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-outline"
                                            style={{ flex: 1, textAlign: 'center' }}
                                        >
                                            ✈️ Telegram
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}