'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

// SVG Ikonlar
const Icons = {
    Museum: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
        </svg>
    ),
    Gallery: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
        </svg>
    ),
    Book: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    Newspaper: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/>
        </svg>
    ),
    Pen: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
        </svg>
    ),
    Play: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
        </svg>
    ),
    Exhibits: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
    ),
    Calendar: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    ),
    Building: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
    ),
    Users: () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    Camera: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
        </svg>
    ),
}

function useFormattedDate() {
    const locale = useLocale()
    return (dateString: string) => {
        const date = new Date(dateString)
        const day = date.getDate()
        const month = date.getMonth()
        const year = date.getFullYear()
        const months = {
            ru: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
            en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            uz: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
        }
        const m = months[locale as keyof typeof months] || months.uz
        if (locale === 'ru') return `${day} ${m[month]}, ${year}`
        if (locale === 'en') return `${m[month]} ${day}, ${year}`
        return `${day}-${m[month]}, ${year}`
    }
}

const SLIDE_IMAGES = ['/slide1.jpg', '/slide2.jpg', '/slide3.jpg', '/slide4.jpg']

function HeroSlideshow() {
    const [current, setCurrent] = useState(0)
    const [prev, setPrev] = useState<number | null>(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(c => { setPrev(c); return (c + 1) % SLIDE_IMAGES.length })
        }, 6000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div style={{ position: 'absolute', inset: 0, background: '#0a1829', zIndex: 0 }} />
            {prev !== null && (
                <div key={`prev-${prev}`} style={{ position: 'absolute', inset: 0, zIndex: 1, animation: 'slideFadeOut 1.5s ease forwards' }}>
                    <Image src={SLIDE_IMAGES[prev]} alt="" fill sizes="100vw" style={{ objectFit: 'cover', opacity: 0.55 }} />
                </div>
            )}
            <div key={`curr-${current}`} style={{ position: 'absolute', inset: 0, zIndex: 2, animation: 'slideFadeIn 1.5s ease forwards' }}>
                <Image src={SLIDE_IMAGES[current]} alt="Hero Slide" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: 0.55 }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(to bottom, rgba(10,24,41,0.4) 0%, rgba(10,24,41,0.65) 60%, rgba(10,24,41,0.9) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '80px', right: '40px', display: 'flex', gap: '8px', zIndex: 10 }}>
                {SLIDE_IMAGES.map((_, i) => (
                    <button key={i} onClick={() => { setPrev(current); setCurrent(i) }} style={{
                        width: i === current ? '32px' : '8px', height: '8px', borderRadius: '4px',
                        background: i === current ? '#C9A84C' : 'rgba(255,255,255,0.4)',
                        border: 'none', cursor: 'pointer', transition: 'all 0.4s ease', padding: 0,
                    }} />
                ))}
            </div>
        </>
    )
}

export default function HomePage() {
    const t = useTranslations('home')
    const locale = useLocale()
    const formatDate = useFormattedDate()
    const [latestNews, setLatestNews] = useState<NewsItem[]>([])

    const stats = useMemo(() => [
        { number: '500+', label: t('stats_exhibits'), Icon: Icons.Exhibits },
        { number: '90',   label: t('stats_history'),  Icon: Icons.Calendar },
        { number: '1934', label: t('stats_founded'),  Icon: Icons.Building },
        { number: '12K+', label: t('stats_visitors'), Icon: Icons.Users },
    ], [t])

    const sections = useMemo(() => [
        { href: `/${locale}/about`,       Icon: Icons.Museum,    title: t('nav_about'),     desc: t('sections_about_desc') },
        { href: `/${locale}/gallery`,     Icon: Icons.Gallery,   title: t('nav_gallery'),   desc: t('sections_gallery_desc') },
        { href: `/${locale}/resources`,   Icon: Icons.Book,      title: t('nav_resources'), desc: t('sections_resources_desc') },
        { href: `/${locale}/news`,        Icon: Icons.Newspaper, title: t('nav_news'),      desc: t('sections_news_desc') },
        {
            href: `/${locale}/jadidlar`, Icon: Icons.Pen,
            title: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlar',
            desc:  locale === 'ru' ? 'Узбекские просветители XIX–XX веков' : locale === 'en' ? 'Uzbek enlighteners' : "O'zbek ma'rifatparvarlari",
        },
        {
            href: `/${locale}/virtual-tour`, Icon: Icons.Play,
            title: locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat',
            desc:  locale === 'ru' ? 'Посетите музей онлайн' : locale === 'en' ? 'Visit the museum online' : 'Muzeyni onlayn ziyorat qiling',
        },
    ], [t, locale])

    useEffect(() => {
        newsService.getAll(0, 3, undefined, locale).then(data => setLatestNews(data.content)).catch(() => {})
    }, [locale])

    return (
        <>
            {/* HERO */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <HeroSlideshow />
                <div className="container" style={{ position: 'relative', zIndex: 4, paddingTop: '100px', paddingBottom: '80px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        <div style={{ animation: 'fadeInUp 0.8s ease both' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)',
                                color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '11px',
                                letterSpacing: '3px', textTransform: 'uppercase', padding: '8px 20px', marginBottom: '32px',
                            }}>
                                <span className="pulse-dot" />
                                {t('badge')}
                            </div>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: '700', color: '#fff', lineHeight: 1.1, marginBottom: '28px' }}>
                                {t('hero_title1')}<br />
                                <span style={{ color: '#C9A84C' }}>{t('hero_title2')}</span><br />
                                <span style={{ fontSize: '0.7em', fontWeight: '400', color: 'rgba(255,255,255,0.8)' }}>{t('hero_title3')}</span>
                            </h1>
                            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.65)', lineHeight: '1.8', marginBottom: '44px', maxWidth: '520px' }}>
                                {t('hero_desc')}
                            </p>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <Link href={`/${locale}/about`} className="btn-primary">{t('btn_visit')}</Link>
                                <Link href={`/${locale}/virtual-tour`} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff', padding: '14px 28px', fontSize: '13px',
                                    textDecoration: 'none', transition: 'background 0.3s',
                                }}>
                                    <Icons.Play />
                                    {locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat'}
                                </Link>
                            </div>
                        </div>

                        {/* Quote card */}
                        <div className="hero-quote-card" style={{
                            padding: 'clamp(24px, 3vw, 40px)', background: 'rgba(10,24,41,0.7)',
                            border: '1px solid rgba(201,168,76,0.25)', borderTop: '4px solid #C9A84C',
                            backdropFilter: 'blur(20px)', animation: 'fadeInUp 0.8s ease 0.3s both',
                        }}>
                            <div style={{ fontSize: '60px', color: 'rgba(201,168,76,0.2)', lineHeight: 0.5, marginBottom: '20px' }}>"</div>
                            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '18px', color: '#fff', lineHeight: '1.8', marginBottom: '20px' }}>
                                Millatni saqlaydigan narsa — maktab, ma'naviyat va ma'rifatdir.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '1px', background: '#C9A84C' }} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '2px' }}>ABDULLA AVLONIY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section style={{ background: '#0d1f3c', borderTop: '1px solid rgba(201,168,76,0.15)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                <div className="container">
                    <div className="grid-4-col">
                        {stats.map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: 'clamp(24px, 3vw, 40px) 20px' }}>
                                <div style={{ color: 'rgba(201,168,76,0.6)', display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                                    <stat.Icon />
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '700', color: '#C9A84C', lineHeight: 1 }}>{stat.number}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTIONS */}
            <section className="section" style={{ background: '#0a1829' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ color: '#fff', fontSize: 'clamp(26px, 3vw, 38px)' }}>
                            {t('sections_title1')} <span style={{ color: '#C9A84C' }}>{t('sections_title2')}</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {sections.map((s, i) => (
                            <Link key={i} href={s.href} style={{ textDecoration: 'none' }}>
                                <div className="section-card" style={{ padding: 'clamp(24px, 3vw, 40px)', height: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                                    <div style={{ color: '#C9A84C', marginBottom: '20px', opacity: 0.8 }}>
                                        <s.Icon />
                                    </div>
                                    <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '20px' }}>{s.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.7' }}>{s.desc}</p>
                                    <div style={{ marginTop: '24px', color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>→</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWS */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                        <h2>{t('news_title')}</h2>
                        <Link href={`/${locale}/news`} className="btn-outline">{t('news_btn')}</Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {latestNews.map((item) => (
                            <Link key={item.id} href={`/${locale}/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                <div className="news-card" style={{ background: '#fff', border: '1px solid rgba(27,58,107,0.08)', overflow: 'hidden', transition: 'all 0.3s' }}>
                                    <div style={{ position: 'relative', height: '220px', background: '#1B3A6B' }}>
                                        {item.imageUrl ? (
                                            <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                                                <Icons.Camera />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gray-400)' }}>
                                            {formatDate(item.createdAt)}
                                        </span>
                                        <h3 style={{ fontSize: '18px', margin: '10px 0', color: 'var(--navy-dark)', lineHeight: '1.4' }}>{item.title}</h3>
                                        <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.7' }}>{item.excerpt}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes slideFadeIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideFadeOut { from { opacity: 1; } to { opacity: 0; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                .pulse-dot { display: inline-block; width: 6px; height: 6px; background: #C9A84C; border-radius: 50%; animation: pulse 2s infinite; }
                @keyframes pulse {
                    0%, 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(201,168,76,0.7); }
                    70%      { transform: scale(1);    box-shadow: 0 0 0 8px rgba(201,168,76,0); }
                }
                .section-card:hover { background: rgba(201,168,76,0.07) !important; border-color: rgba(201,168,76,0.2) !important; transform: translateY(-4px); }
                .news-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(27,58,107,0.15); }
            `}</style>
        </>
    )
}
