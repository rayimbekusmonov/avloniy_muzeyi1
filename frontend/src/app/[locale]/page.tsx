'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

function formatDate(year: number, month: number, day: number, locale: string) {
    if (locale === 'ru') {
        const months = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']
        return `${day} ${months[month]}, ${year}`
    } else if (locale === 'en') {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        return `${months[month]} ${day}, ${year}`
    } else {
        const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
        return `${day}-${months[month]}, ${year}`
    }
}

const SLIDE_IMAGES = [
    '/slide1.jpg',
    '/slide2.jpg',
    '/slide3.jpg',
    '/slide4.jpg',
]

function HeroSlideshow() {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % SLIDE_IMAGES.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {SLIDE_IMAGES.map((img, i) => (
                <div key={i} style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    transition: 'opacity 1.5s ease-in-out',
                    opacity: i === current ? 0.5 : 0,
                }} />
            ))}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(10,24,41,0.55) 0%, rgba(27,58,107,0.45) 50%, rgba(37,77,143,0.4) 100%)',
            }} />
        </>
    )
}

export default function HomePage() {
    const t = useTranslations('home')
    const locale = useLocale()
    const [latestNews, setLatestNews] = useState<NewsItem[]>([])

    const stats = [
        { number: '500+', label: t('stats_exhibits') },
        { number: '90', label: t('stats_history') },
        { number: '1934', label: t('stats_founded') },
        { number: '12K+', label: t('stats_visitors') },
    ]

    const sections = [
        { href: `/${locale}/about`, icon: '🏛️', title: t('nav_about'), desc: t('sections_about_desc') },
        { href: `/${locale}/gallery`, icon: '🖼️', title: t('nav_gallery'), desc: t('sections_gallery_desc') },
        { href: `/${locale}/resources`, icon: '📚', title: t('nav_resources'), desc: t('sections_resources_desc') },
        { href: `/${locale}/news`, icon: '📰', title: t('nav_news'), desc: t('sections_news_desc') },
    ]

    useEffect(() => {
        newsService.getAll(0, 3).then(data => setLatestNews(data.content))
    }, [])

    return (
        <>
            {/* HERO */}
            <section style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a1829 0%, #1B3A6B 50%, #254d8f 100%)',
                display: 'flex', alignItems: 'center',
                position: 'relative', overflow: 'hidden', padding: '100px 0',
            }}>
                <HeroSlideshow />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                        radial-gradient(circle at 75% 40%, rgba(201,168,76,0.12) 0%, transparent 45%),
                        radial-gradient(circle at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 40%)
                    `,
                    pointerEvents: 'none', zIndex: 1,
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
                        {/* Hero Text */}
                        <div style={{ flex: '1 1 500px' }}>
                            <div className="animate-fade-up" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
                                color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '11px',
                                letterSpacing: '3px', textTransform: 'uppercase' as const,
                                padding: '7px 18px', borderRadius: '20px', marginBottom: '28px',
                            }}>
                                <span>✦</span> {t('badge')}
                            </div>

                            <h1 className="animate-fade-up animate-delay-1" style={{
                                fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 8vw, 72px)',
                                fontWeight: '700', color: '#fff', lineHeight: 1.1, marginBottom: '24px',
                            }}>
                                {t('hero_title1')}<br />
                                <span style={{ color: '#C9A84C' }}>{t('hero_title2')}</span><br />
                                {t('hero_title3')}
                            </h1>

                            <p className="animate-fade-up animate-delay-2" style={{
                                fontSize: '18px', color: 'rgba(255,255,255,0.7)', fontWeight: '300',
                                lineHeight: '1.8', marginBottom: '40px', maxWidth: '520px',
                            }}>
                                {t('hero_desc')}
                            </p>

                            <div className="animate-fade-up animate-delay-3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <Link href={`/${locale}/about`} className="btn-primary">{t('btn_visit')}</Link>
                                <Link href={`/${locale}/gallery`} className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>{t('btn_gallery')}</Link>
                            </div>
                        </div>

                        {/* Hero Quote */}
                        <div className="hero-quote animate-fade-up animate-delay-4" style={{
                            flex: '1 1 300px', maxWidth: '400px', padding: '32px',
                            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                            borderRadius: '16px', backdropFilter: 'blur(10px)',
                        }}>
                            <div style={{ fontSize: '48px', color: 'rgba(201,168,76,0.4)', lineHeight: 1, marginBottom: '12px', fontFamily: 'Georgia' }}>"</div>
                            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '17px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '16px' }}>
                                Millatni saqlaydigan narsa — maktab, ma'naviyat va ma'rifatdir.
                            </p>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#C9A84C', letterSpacing: '2px' }}>
                                — ABDULLA AVLONIY
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div style={{
                    position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '2px', animation: 'fadeIn 1s ease 1s both', zIndex: 2,
                }}>
                    <div>{t('scroll')}</div>
                    <div style={{ width: '1px', height: '32px', background: 'rgba(201,168,76,0.4)' }} />
                </div>
            </section>

            {/* STATS */}
            <section style={{ background: 'var(--navy)', padding: '48px 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0' }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: '700', color: '#C9A84C', lineHeight: 1, marginBottom: '8px' }}>{stat.number}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', textTransform: 'uppercase' as const }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT PREVIEW */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '16px' }}>
                                {t('who_label')}
                            </div>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '16px' }}>
                                {t('who_title1')} <span style={{ color: 'var(--gold)' }}>{t('who_title2')}</span>
                            </h2>
                            <div className="gold-divider" />
                            <p style={{ fontSize: '17px', color: 'var(--gray-600)', lineHeight: '1.9', marginBottom: '16px', marginTop: '16px' }}>
                                {t('who_desc1')}
                            </p>
                            <p style={{ fontSize: '17px', color: 'var(--gray-600)', lineHeight: '1.9', marginBottom: '32px' }}>
                                {t('who_desc2')}
                            </p>
                            <Link href={`/${locale}/about`} className="btn-primary">{t('btn_read_more')}</Link>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '100%', paddingTop: '120%',
                                background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                                borderRadius: '16px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
                            }}>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-display)' }}>
                                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🖼️</div>
                                    <div style={{ fontSize: '14px', letterSpacing: '2px' }}>AVLONIY PORTRETI</div>
                                </div>
                            </div>
                            <div style={{ position: 'absolute', bottom: '-16px', right: '-16px', width: '100px', height: '100px', background: 'var(--gold)', borderRadius: '12px', zIndex: -1, opacity: 0.3 }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTIONS PREVIEW */}
            <section className="section" style={{ background: 'var(--white)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
                            {t('sections_label')}
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
                            {t('sections_title1')} <span style={{ color: 'var(--gold)' }}>{t('sections_title2')}</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                        {sections.map((s, i) => (
                            <Link key={i} href={s.href} style={{ textDecoration: 'none' }}>
                                <div className="card" style={{ padding: '32px', height: '100%' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '20px' }}>{s.icon}</div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--navy-dark)', marginBottom: '12px' }}>{s.title}</h3>
                                    <p style={{ fontSize: '15px', color: 'var(--gray-600)', lineHeight: '1.7' }}>{s.desc}</p>
                                    <div style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)', letterSpacing: '1px' }}>
                                        →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* NEWS PREVIEW */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
                                {t('news_label')}
                            </div>
                            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>{t('news_title')}</h2>
                        </div>
                        <Link href={`/${locale}/news`} className="btn-outline">{t('news_btn')}</Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {latestNews.map(item => (
                            <Link key={item.id} href={`/${locale}/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                <div className="card">
                                    <div style={{
                                        height: '180px',
                                        background: item.imageUrl ? `url(${item.imageUrl}) center/cover` : 'linear-gradient(135deg, var(--navy-dark), var(--navy-light))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.3)', fontSize: '32px',
                                    }}>{!item.imageUrl && '📸'}</div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '10px' }}>
                                            {formatDate(new Date(item.createdAt).getFullYear(), new Date(item.createdAt).getMonth(), new Date(item.createdAt).getDate(), locale)}
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--navy-dark)', marginBottom: '10px', lineHeight: '1.4' }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.7' }}>
                                            {item.excerpt || item.content.substring(0, 100) + '...'}
                                        </p>
                                        <div style={{ display: 'inline-block', marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)' }}>
                                            {t('read_more')} →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))', padding: '80px 0', textAlign: 'center' }}>
                <div className="container">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '16px' }}>
                        {t('cta_label')}
                    </div>
                    <h2 style={{ color: 'var(--white)', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
                        {t('cta_title1')} <span style={{ color: 'var(--gold)' }}>{t('cta_title2')}</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', maxWidth: '500px', margin: '0 auto 36px' }}>
                        {t('cta_desc')}
                    </p>
                    <Link href={`/${locale}/contact`} className="btn-primary">{t('cta_btn')}</Link>
                </div>
            </section>
        </>
    )
}