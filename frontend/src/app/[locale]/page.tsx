'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

// 1. Sanani formatlash funksiyasi (Hydration xatolarini oldini olish uchun komponent ichida ishlatiladi)
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

        const currentMonths = months[locale as keyof typeof months] || months.uz

        if (locale === 'ru') return `${day} ${currentMonths[month]}, ${year}`
        if (locale === 'en') return `${currentMonths[month]} ${day}, ${year}`
        return `${day}-${currentMonths[month]}, ${year}`
    }
}

const SLIDE_IMAGES = ['/slide1.jpg', '/slide2.jpg', '/slide3.jpg', '/slide4.jpg']

function HeroSlideshow() {
    const t = useTranslations('home')
    const [current, setCurrent] = useState(0)

    // Slideshow mantiqi
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % SLIDE_IMAGES.length)
        }, 6000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div style={{ position: 'absolute', inset: 0, background: '#0a1829', zIndex: 0 }} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    style={{ position: 'absolute', inset: 0, zIndex: 1 }}
                >
                    <Image
                        src={SLIDE_IMAGES[current]}
                        alt="Hero Slide"
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                    />
                </motion.div>
            </AnimatePresence>

            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(10,24,41,0.4) 0%, rgba(10,24,41,0.65) 60%, rgba(10,24,41,0.9) 100%)',
                zIndex: 2,
            }} />

            {/* Slide indicators */}
            <div style={{ position: 'absolute', bottom: '80px', right: '40px', display: 'flex', gap: '8px', zIndex: 10 }}>
                {SLIDE_IMAGES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        style={{
                            width: i === current ? '32px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: i === current ? '#C9A84C' : 'rgba(255,255,255,0.4)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.4s ease', padding: 0,
                        }}
                    />
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

    // Statik ma'lumotlarni useMemo orqali optimallashtiramiz
    const stats = useMemo(() => [
        { number: '500+', label: t('stats_exhibits'), icon: '🏺' },
        { number: '90', label: t('stats_history'), icon: '📅' },
        { number: '1934', label: t('stats_founded'), icon: '🏛️' },
        { number: '12K+', label: t('stats_visitors'), icon: '👥' },
    ], [t])

    const sections = useMemo(() => [
        { href: `/${locale}/about`, icon: '🏛️', title: t('nav_about'), desc: t('sections_about_desc') },
        { href: `/${locale}/gallery`, icon: '🖼️', title: t('nav_gallery'), desc: t('sections_gallery_desc') },
        { href: `/${locale}/resources`, icon: '📚', title: t('nav_resources'), desc: t('sections_resources_desc') },
        { href: `/${locale}/news`, icon: '📰', title: t('nav_news'), desc: t('sections_news_desc') },
        {
            href: `/${locale}/jadidlar`,
            icon: '✒️',
            title: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlar',
            desc: locale === 'ru' ? 'Узбекские просветители XIX–XX веков' : locale === 'en' ? 'Uzbek enlighteners' : "O'zbek ma'rifatparvarlari"
        },
        {
            href: `/${locale}/virtual-tour`,
            icon: '🎬',
            title: locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat',
            desc: locale === 'ru' ? 'Посетите музей онлайн' : locale === 'en' ? 'Visit the museum online' : 'Muzeyni onlayn ziyorat qiling'
        },
    ], [t, locale])

    useEffect(() => {
        newsService.getAll(0, 3).then(data => setLatestNews(data.content)).catch(() => {})
    }, [])

    return (
        <>
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <HeroSlideshow />

                <div className="container" style={{ position: 'relative', zIndex: 4 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="hero-badge" style={{
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
                                <Link href={`/${locale}/virtual-tour`} className="btn-secondary-outline">
                                    ▶ {locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat'}
                                </Link>
                            </div>
                        </motion.div>

                        {/* Quote card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="hero-quote-card"
                            style={{
                                padding: '40px', background: 'rgba(10, 24, 41, 0.7)',
                                border: '1px solid rgba(201,168,76,0.25)', borderTop: '4px solid #C9A84C',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <div style={{ fontSize: '60px', color: 'rgba(201,168,76,0.2)', lineHeight: 0.5 }}>"</div>
                            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '18px', color: '#fff', lineHeight: '1.8', marginBottom: '20px' }}>
                                Millatni saqlaydigan narsa — maktab, ma'naviyat va ma'rifatdir.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '1px', background: '#C9A84C' }} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '2px' }}>ABDULLA AVLONIY</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section style={{ background: '#0d1f3c', borderY: '1px solid rgba(201,168,76,0.15)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '40px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <div style={{ fontSize: '24px' }}>{stat.icon}</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', color: '#C9A84C' }}>{stat.number}</div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTIONS GRID */}
            <section className="section" style={{ background: '#0a1829' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ color: '#fff' }}>{t('sections_title1')} <span style={{ color: '#C9A84C' }}>{t('sections_title2')}</span></h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {sections.map((s, i) => (
                            <motion.div key={i} whileHover={{ y: -5 }}>
                                <Link href={s.href} style={{ textDecoration: 'none' }}>
                                    <div style={{ padding: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                                        <div style={{ fontSize: '32px', marginBottom: '20px' }}>{s.icon}</div>
                                        <h3 style={{ color: '#fff', marginBottom: '10px' }}>{s.title}</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{s.desc}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWS SECTION */}
            <section className="section" style={{ background: '#f8f9fa' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h2>{t('news_title')}</h2>
                        <Link href={`/${locale}/news`} className="btn-outline">{t('news_btn')}</Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {latestNews.map((item) => (
                            <Link key={item.id} href={`/${locale}/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                <motion.div className="news-card" whileHover={{ y: -10 }} style={{ background: '#fff', border: '1px solid #eee' }}>
                                    <div style={{ position: 'relative', height: '220px' }}>
                                        <Image
                                            src={item.imageUrl || '/placeholder.jpg'}
                                            alt={item.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ padding: '25px' }}>
                                        <span style={{ fontSize: '12px', color: '#888' }}>{formatDate(item.createdAt)}</span>
                                        <h3 style={{ fontSize: '18px', margin: '10px 0', color: '#1B3A6B' }}>{item.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#666' }}>{item.excerpt}</p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CSS-in-JS Animatsiyalar */}
            <style jsx>{`
                .pulse-dot {
                    width: 6px; height: 6px; background: #C9A84C; border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(201, 168, 76, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(201, 168, 76, 0); }
                }
                .btn-primary {
                    background: #C9A84C; color: #fff; padding: 14px 28px; text-decoration: none;
                    font-weight: 600; text-transform: uppercase; font-size: 13px; transition: 0.3s;
                }
                .btn-primary:hover { background: #b08d3a; }
                .btn-secondary-outline {
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2);
                    color: #fff; padding: 14px 28px; text-decoration: none; font-size: 13px; transition: 0.3s;
                }
                .btn-secondary-outline:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </>
    )
}