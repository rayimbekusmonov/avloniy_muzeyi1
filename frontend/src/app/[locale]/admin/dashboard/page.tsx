'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, removeToken } from '@/lib/api'

const menuItems = [
    { href: '/admin/news', icon: '📰', title: 'Yangiliklar', desc: 'Yangilik qo\'shish, tahrirlash, o\'chirish' },
    { href: '/admin/gallery', icon: '🖼️', title: 'Galereya', desc: 'Rasm, video, audio boshqaruvi' },
    { href: '/admin/resources', icon: '📚', title: 'Manbalar', desc: 'E-kitob va maqolalar' },
    { href: '/admin/contacts', icon: '✉️', title: 'Xabarlar', desc: 'Foydalanuvchilardan kelgan xabarlar' },
]

export default function AdminDashboardPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin')
        }
    }, [router])

    const handleLogout = () => {
        removeToken()
        router.push('/admin')
    }

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'var(--gold)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                    }}>🏛️</div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', fontWeight: '600' }}>
                            Admin Panel
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
                            AVLONIY MUZEYI
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
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
                >
                    Chiqish
                </button>
            </header>

            {/* Content */}
            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--navy-dark)' }}>
                    Boshqaruv paneli
                </h1>
                <p style={{ color: 'var(--gray-600)', marginBottom: '40px' }}>
                    Muzey kontentini boshqaring
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {menuItems.map((item, i) => (
                        <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ padding: '32px' }}>
                                <div style={{ fontSize: '36px', marginBottom: '16px' }}>{item.icon}</div>
                                <h3 style={{ fontSize: '18px', color: 'var(--navy-dark)', marginBottom: '8px' }}>
                                    {item.title}
                                </h3>
                                <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>{item.desc}</p>
                                <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)' }}>
                                    Boshqarish →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}