'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { isAuthenticated, removeToken } from '@/lib/api'

const Icons = {
    Museum: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
        </svg>
    ),
    Newspaper: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/>
        </svg>
    ),
    Image: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    Book: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    Mail: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
    ),
    Pen: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
    ),
    HelpCircle: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    ),
    Settings: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
    ),
}

export default function AdminDashboardPage() {
    const router = useRouter()
    const locale = useLocale()

    const menuItems = [
        {
            href: `/${locale}/admin/jadidlar`,
            Icon: Icons.Pen,
            title: 'Jadidlar Portali',
            desc: "Tarixiy shaxslar, vaqt shajarasi, arxiv fotosuratlari va asarlarini boshqarish",
            tag: "Markaziy CMS"
        },
        {
            href: `/${locale}/admin/settings`,
            Icon: Icons.Settings,
            title: 'Sayt Sozlamalari & Matnlar',
            desc: "Kontaktlar, ijtimoiy tarmoqlar va bosh sahifa shiorlari",
            tag: "Umumiy"
        },
        {
            href: `/${locale}/admin/news`,
            Icon: Icons.Newspaper,
            title: 'Yangiliklar & Tadbirlar',
            desc: "Muzey yangiliklari, tadbirlar va e'lonlarni kiritish, tahrirlash",
            tag: "Matbuot"
        },
        {
            href: `/${locale}/admin/faq`,
            Icon: Icons.HelpCircle,
            title: 'Savol-Javoblar (FAQ)',
            desc: "Ko'p beriladigan savol va javoblar bazasini yangilash",
            tag: "Ma'lumot"
        },
        {
            href: `/${locale}/admin/resources`,
            Icon: Icons.Book,
            title: 'Manbalar & E-Kitoblar',
            desc: "Elektron kitoblar, ilmiy maqolalar va arxiv hujjatlari",
            tag: "Kutubxona"
        },
        {
            href: `/${locale}/admin/gallery`,
            Icon: Icons.Image,
            title: 'Galereya & Media',
            desc: "Fotosuratlar, video va audio eksponatlar boshqaruvi",
            tag: "Media"
        },
        {
            href: `/${locale}/admin/contacts`,
            Icon: Icons.Mail,
            title: 'Kelgan Xabarlar',
            desc: "Foydalanuvchilar tomonidan yuborilgan murojaat va xabarlar",
            tag: "Aloqa"
        },
    ]

    useEffect(() => {
        if (!isAuthenticated()) router.push(`/${locale}/admin`)
    }, [router, locale])

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
            <header style={{ background: 'var(--bg-header)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#061d15' }}>
                        <Icons.Museum />
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', fontWeight: '600' }}>Admin CMS Paneli</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px' }}>O&apos;ZBEKISTON JADIDLARI MUZEYI</div>
                    </div>
                </div>
                <button onClick={() => { removeToken(); router.push(`/${locale}/admin`) }} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>
                    Chiqish
                </button>
            </header>

            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
                <div style={{ marginBottom: '36px' }}>
                    <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--text-heading)' }}>Muzey Boshqaruv Markazi</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                        Saytning barcha bo'limlari, Jadidlar shajarasi, yangiliklar, sozlamalar va manbalarni mustaqil boshqaring
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {menuItems.map((item, i) => (
                        <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                            <div className="card" style={{ padding: '28px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ color: 'var(--gold)' }}><item.Icon /></div>
                                        <span style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--gold)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                                            {item.tag}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '18px', color: 'var(--text-heading)', marginBottom: '8px', fontWeight: '600' }}>{item.title}</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.desc}</p>
                                </div>
                                <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    Boshqarish <span>→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}
