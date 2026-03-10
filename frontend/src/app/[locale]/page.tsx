'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

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
        { number: '500+', label: t('stats_exhibits'), icon: '🏺' },
        { number: '90',   label: t('stats_history'),  icon: '📅' },
        { number: '1934', label: t('stats_founded'),  icon: '🏛️' },
        { number: '12K+', label: t('stats_visitors'), icon: '👥' },
    ], [t])

    const sections = useMemo(() => [
        { href: `/${locale}/about`,     icon: '🏛️', title: t('nav_about'),     desc: t('sections_about_desc') },
        { href: `/${locale}/gallery`,   icon: '🖼️', title: t('nav_gallery'),   desc: t('sections_gallery_desc') },
        { href: `/${locale}/resources`, icon: '📚', title: t('nav_resources'), desc: t('sections_resources_desc') },
        { href: `/${locale}/news`,      icon: '📰', title: t('nav_news'),      desc: t('sections_news_desc') },
        {
            href: `/${locale}/jadidlar`, icon: '✒️',
            title: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlar',
            desc:  locale === 'ru' ? 'Узбекские просветители XIX–XX веков' : locale === 'en' ? 'Uzbek enlighteners' : "O'zbek ma'rifatparvarlari",
        },
        {
            href: `/${locale}/virtual-tour`, icon: '🎬',
            title: locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat',
            desc:  locale === 'ru' ? 'Посетите музей онлайн' : locale === 'en' ? 'Visit the museum online' : 'Muzeyni onlayn ziyorat qiling',
        },
    ], [t, locale])

    useEffect(() => {
        newsService.getAll(0, 3).then(data => setLatestNews(data.content)).catch(() => {})
    }, [])

    return (
        <>
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
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: '700', color: '#fff', lineHeight: 1.1, marginBottom: '28px' }}>
                                {t('hero_title1')}<br />
                                <span style={{ color: '#C9A84C' }}>{t('hero_title2')}</span><br />
                                <span style={{ fontSize: '0.7em', fontWeight: '400', color: 'rgba(255,255,255,0.8)' }}>{t('hero_title3')}</span>
                            </h1>
                            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.8', marginBottom: '44px', maxWidth: '520px' }}>
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
                                    ▶ {locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat'}
                                </Link>
                            </div>
                        </div>

                        <div className="hero-quote-card" style={{
                            padding: '40px', background: 'rgba(10,24,41,0.7)',
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '40px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: '700', color: '#C9A84C', lineHeight: 1 }}>{stat.number}</div>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                        {sections.map((s, i) => (
                            <Link key={i} href={s.href} style={{ textDecoration: 'none' }}>
                                <div className="section-card" style={{ padding: '40px', height: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '20px' }}>{s.icon}</div>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                        {latestNews.map((item) => (
                            <Link key={item.id} href={`/${locale}/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                <div className="news-card" style={{ background: '#fff', border: '1px solid rgba(27,58,107,0.08)', overflow: 'hidden', transition: 'all 0.3s' }}>
                                    <div style={{ position: 'relative', height: '220px', background: '#1B3A6B' }}>
                                        <Image src={item.imageUrl || '/placeholder.jpg'} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ padding: '24px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gray-400)' }}>{formatDate(item.createdAt)}</span>
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
                .hero-quote-card { display: none; }
                @media (min-width: 1100px) { .hero-quote-card { display: block !important; } }
            `}</style>
        </>
    )
}