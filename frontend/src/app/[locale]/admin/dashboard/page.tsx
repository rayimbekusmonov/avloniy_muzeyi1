'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isAuthenticated, removeToken } from '@/lib/api'

const Icons = {
    Museum: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
        </svg>
    ),
    Newspaper: () => (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/>
        </svg>
    ),
    Image: () => (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    Book: () => (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    Mail: () => (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
    ),
}

const menuItems = [
    { href: '/admin/news',      Icon: Icons.Newspaper, title: 'Yangiliklar',  desc: "Yangilik qo'shish, tahrirlash, o'chirish" },
    { href: '/admin/gallery',   Icon: Icons.Image,     title: 'Galereya',     desc: 'Rasm, video, audio boshqaruvi' },
    { href: '/admin/resources', Icon: Icons.Book,      title: 'Manbalar',     desc: 'E-kitob va maqolalar' },
    { href: '/admin/contacts',  Icon: Icons.Mail,      title: 'Xabarlar',     desc: 'Foydalanuvchilardan kelgan xabarlar' },
]

export default function AdminDashboardPage() {
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated()) router.push('/admin')
    }, [router])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
            <header style={{ background: 'var(--navy-dark)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-dark)' }}>
                        <Icons.Museum />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', fontWeight: '600' }}>Admin Panel</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>AVLONIY MUZEYI</div>
                    </div>
                </div>
                <button onClick={() => { removeToken(); router.push('/admin') }} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>
                    Chiqish
                </button>
            </header>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--navy-dark)' }}>Boshqaruv paneli</h1>
                <p style={{ color: 'var(--gray-600)', marginBottom: '40px' }}>Muzey kontentini boshqaring</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {menuItems.map((item, i) => (
                        <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ padding: '32px' }}>
                                <div style={{ color: 'var(--gold)', marginBottom: '16px' }}><item.Icon /></div>
                                <h3 style={{ fontSize: '18px', color: 'var(--navy-dark)', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>{item.desc}</p>
                                <div style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)' }}>Boshqarish →</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}