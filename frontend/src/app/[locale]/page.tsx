'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
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

// Real museum/historical images from Unsplash
const SLIDE_IMAGES = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80', // Museum interior
    'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=1920&q=80', // Library/books
    'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1920&q=80', // Historic architecture
    'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80', // Museum gallery
]

const SLIDE_LABELS = [
    'Muzey ekspozitsiyasi',
    'Kutubxona va manbalar',
    'Tarixiy me\'morchilik',
    'Ko\'rgazma zali',
]

function HeroSlideshow() {
    const [current, setCurrent] = useState(0)
    const [loaded, setLoaded] = useState<boolean[]>([false, false, false, false])
    const [transitioning, setTransitioning] = useState(false)

    // Preload all images on mount
    useEffect(() => {
        SLIDE_IMAGES.forEach((src, i) => {
            const img = new Image()
            img.src = src
            img.onload = () => {
                setLoaded(prev => {
                    const next = [...prev]
                    next[i] = true
                    return next
                })
            }
        })
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setTransitioning(true)
            setTimeout(() => {
                setCurrent(prev => (prev + 1) % SLIDE_IMAGES.length)
                setTransitioning(false)
            }, 600)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {/* Always show a base dark gradient so there's never a blank blue */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, #0a1829 0%, #1B3A6B 60%, #254d8f 100%)',
                zIndex: 0,
            }} />

            {/* Slides */}
            {SLIDE_IMAGES.map((src, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: loaded[i] ? `url(${src})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: i === current && loaded[i] ? (transitioning ? 0 : 0.55) : 0,
                        transition: 'opacity 1.2s ease-in-out',
                        zIndex: 1,
                    }}
                />
            ))}

            {/* Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(10,24,41,0.4) 0%, rgba(10,24,41,0.65) 60%, rgba(10,24,41,0.9) 100%)',
                zIndex: 2,
            }} />

            {/* Slide indicators */}
            <div style={{
                position: 'absolute',
                bottom: '80px',
                right: '40px',
                display: 'flex',
                gap: '8px',
                zIndex: 10,
            }}>
                {SLIDE_IMAGES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        style={{
                            width: i === current ? '32px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: i === current ? '#C9A84C' : 'rgba(255,255,255,0.4)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.4s ease',
                            padding: 0,
                        }}
                    />
                ))}
            </div>

            {/* Slide label */}
            <div style={{
                position: 'absolute',
                bottom: '90px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                zIndex: 10,
                transition: 'opacity 0.5s',
            }}>
                {SLIDE_LABELS[current]}
            </div>
        </>
    )
}

export default function HomePage() {
    const t = useTranslations('home')
    const locale = useLocale()
    const [latestNews, setLatestNews] = useState<NewsItem[]>([])
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

    const stats = [
        { number: '500+', label: t('stats_exhibits'), icon: '🏺' },
        { number: '90', label: t('stats_history'), icon: '📅' },
        { number: '1934', label: t('stats_founded'), icon: '🏛️' },
        { number: '12K+', label: t('stats_visitors'), icon: '👥' },
    ]

    const sections = [
        { href: `/${locale}/about`, icon: '🏛️', title: t('nav_about'), desc: t('sections_about_desc'), color: '#1B3A6B' },
        { href: `/${locale}/gallery`, icon: '🖼️', title: t('nav_gallery'), desc: t('sections_gallery_desc'), color: '#254d8f' },
        { href: `/${locale}/resources`, icon: '📚', title: t('nav_resources'), desc: t('sections_resources_desc'), color: '#112548' },
        { href: `/${locale}/news`, icon: '📰', title: t('nav_news'), desc: t('sections_news_desc'), color: '#1B3A6B' },
        { href: `/${locale}/jadidlar`, icon: '✒️', title: locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlar', desc: locale === 'ru' ? 'Узбекские просветители XIX–XX веков' : locale === 'en' ? 'Uzbek enlighteners of 19th–20th centuries' : "O'zbek ma'rifatparvarlari", color: '#2d1a00' },
        { href: `/${locale}/virtual-tour`, icon: '🎬', title: locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat', desc: locale === 'ru' ? 'Посетите музей онлайн' : locale === 'en' ? 'Visit the museum online' : 'Muzeyni onlayn ziyorat qiling', color: '#0a2810' },
    ]

    useEffect(() => {
        newsService.getAll(0, 3).then(data => setLatestNews(data.content)).catch(() => {})
    }, [])

    // Intersection observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => new Set(Array.from(prev).concat(entry.target.id)))
                    }
                })
            },
            { threshold: 0.1 }
        )
        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    return (
        <>
            {/* ═══════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════ */}
            <section style={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center',
                position: 'relative', overflow: 'hidden', padding: '100px 0 80px',
            }}>
                <HeroSlideshow />

                {/* Geometric decoration */}
                <div style={{
                    position: 'absolute', top: '20%', right: '-5%',
                    width: '600px', height: '600px',
                    border: '1px solid rgba(201,168,76,0.08)',
                    borderRadius: '50%', zIndex: 3,
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: '25%', right: '0%',
                    width: '400px', height: '400px',
                    border: '1px solid rgba(201,168,76,0.05)',
                    borderRadius: '50%', zIndex: 3,
                    pointerEvents: 'none',
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 4 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center' }}>
                        {/* Hero Text */}
                        <div style={{ maxWidth: '680px' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)',
                                color: '#C9A84C', fontFamily: 'var(--font-mono)', fontSize: '11px',
                                letterSpacing: '3px', textTransform: 'uppercase',
                                padding: '8px 20px', borderRadius: '2px', marginBottom: '32px',
                                animation: 'fadeInUp 0.8s ease both',
                            }}>
                                <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#C9A84C', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                                {t('badge')}
                            </div>

                            <h1 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(48px, 7vw, 80px)',
                                fontWeight: '700', color: '#fff', lineHeight: 1.05,
                                marginBottom: '28px',
                                animation: 'fadeInUp 0.8s ease 0.1s both',
                            }}>
                                {t('hero_title1')}<br />
                                <span style={{
                                    color: '#C9A84C',
                                    textShadow: '0 0 60px rgba(201,168,76,0.3)',
                                }}>{t('hero_title2')}</span><br />
                                <span style={{ fontSize: '0.7em', fontWeight: '400', color: 'rgba(255,255,255,0.8)' }}>
                                    {t('hero_title3')}
                                </span>
                            </h1>

                            <p style={{
                                fontSize: '19px', color: 'rgba(255,255,255,0.65)', fontWeight: '300',
                                lineHeight: '1.9', marginBottom: '44px', maxWidth: '520px',
                                animation: 'fadeInUp 0.8s ease 0.2s both',
                            }}>
                                {t('hero_desc')}
                            </p>

                            <div style={{
                                display: 'flex', gap: '16px', flexWrap: 'wrap',
                                animation: 'fadeInUp 0.8s ease 0.3s both',
                            }}>
                                <Link href={`/${locale}/about`} className="btn-primary" style={{
                                    borderRadius: '2px',
                                    letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    fontSize: '13px',
                                }}>
                                    {t('btn_visit')}
                                </Link>
                                <Link href={`/${locale}/virtual-tour`} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#fff', fontFamily: 'var(--font-display)',
                                    fontWeight: '600', fontSize: '13px',
                                    padding: '13px 24px', borderRadius: '2px',
                                    transition: 'all 0.3s', letterSpacing: '1px',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                }}>
                                    ▶ {locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat'}
                                </Link>
                            </div>
                        </div>

                        {/* Quote card */}
                        <div style={{
                            maxWidth: '340px',
                            padding: '36px 32px',
                            background: 'rgba(10, 24, 41, 0.7)',
                            border: '1px solid rgba(201,168,76,0.25)',
                            borderTop: '3px solid #C9A84C',
                            backdropFilter: 'blur(20px)',
                            animation: 'fadeInUp 0.8s ease 0.4s both',
                        }} className="hero-quote">
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '80px', color: 'rgba(201,168,76,0.2)',
                                lineHeight: 0.8, marginBottom: '20px',
                            }}>"</div>
                            <p style={{
                                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                                fontSize: '17px', color: 'rgba(255,255,255,0.85)',
                                lineHeight: '1.9', marginBottom: '20px',
                            }}>
                                Millatni saqlaydigan narsa — maktab, ma'naviyat va ma'rifatdir.
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '1px', background: '#C9A84C' }} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#C9A84C', letterSpacing: '3px' }}>
                                    ABDULLA AVLONIY
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div style={{
                    position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    zIndex: 4, animation: 'fadeIn 1s ease 1.5s both',
                }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '4px' }}>
                        SCROLL
                    </span>
                    <div style={{
                        width: '1px', height: '48px',
                        background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)',
                        animation: 'scrollLine 2s ease-in-out infinite',
                    }} />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                STATS BAR
            ═══════════════════════════════════════════════════════ */}
            <section style={{
                background: '#0d1f3c',
                borderTop: '1px solid rgba(201,168,76,0.15)',
                borderBottom: '1px solid rgba(201,168,76,0.15)',
                padding: '0',
            }}>
                <div className="container" style={{ padding: '0 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{
                                textAlign: 'center', padding: '36px 24px',
                                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                position: 'relative',
                                transition: 'background 0.3s',
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                                <div style={{
                                    fontFamily: 'var(--font-display)', fontSize: '40px',
                                    fontWeight: '700', color: '#C9A84C', lineHeight: 1,
                                    marginBottom: '6px',
                                }}>{stat.number}</div>
                                <div style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                                    color: 'rgba(255,255,255,0.45)', letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                ABOUT PREVIEW
            ═══════════════════════════════════════════════════════ */}
            <section className="section" style={{ background: 'var(--off-white)', overflow: 'hidden' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '80px', alignItems: 'center' }}>
                        <div>
                            <div style={{
                                display: 'inline-flex', gap: '8px', alignItems: 'center',
                                fontFamily: 'var(--font-mono)', fontSize: '10px',
                                color: 'var(--gold)', letterSpacing: '4px',
                                textTransform: 'uppercase', marginBottom: '20px',
                            }}>
                                <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                                {t('who_label')}
                            </div>
                            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: '24px', lineHeight: 1.15 }}>
                                {t('who_title1')} <br />
                                <span style={{ color: 'var(--gold)' }}>{t('who_title2')}</span>
                                <span style={{ fontStyle: 'italic', fontWeight: '400' }}> (1878–1934)</span>
                            </h2>
                            <div style={{ width: '48px', height: '2px', background: 'var(--gold)', marginBottom: '28px' }} />
                            <p style={{ fontSize: '17px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '20px' }}>
                                {t('who_desc1')}
                            </p>
                            <p style={{ fontSize: '17px', color: 'var(--gray-600)', lineHeight: '1.95', marginBottom: '36px' }}>
                                {t('who_desc2')}
                            </p>
                            <Link href={`/${locale}/about`} className="btn-primary" style={{ borderRadius: '2px' }}>
                                {t('btn_read_more')}
                            </Link>
                        </div>

                        <div style={{ position: 'relative' }}>
                            {/* Decorative frame */}
                            <div style={{
                                position: 'absolute', top: '-16px', left: '-16px', right: '16px', bottom: '16px',
                                border: '2px solid rgba(201,168,76,0.2)',
                                borderRadius: '4px',
                                zIndex: 0,
                            }} />
                            <div style={{
                                width: '100%', paddingTop: '125%',
                                background: 'linear-gradient(160deg, #112548 0%, #1B3A6B 50%, #254d8f 100%)',
                                borderRadius: '4px',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 32px 80px rgba(10,24,41,0.3)',
                                zIndex: 1,
                            }}>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    gap: '12px',
                                }}>
                                    <div style={{ fontSize: '72px', opacity: 0.4 }}>🖼️</div>
                                    <div style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '11px',
                                        color: 'rgba(255,255,255,0.3)', letterSpacing: '3px',
                                    }}>AVLONIY PORTRETI</div>
                                </div>
                                {/* Corner decorations */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    height: '100px',
                                    background: 'linear-gradient(to top, rgba(201,168,76,0.1), transparent)',
                                }} />
                            </div>
                            {/* Gold accent */}
                            <div style={{
                                position: 'absolute', bottom: '-8px', right: '-8px',
                                width: '80px', height: '80px',
                                background: 'var(--gold)', opacity: 0.15, borderRadius: '2px',
                                zIndex: 2,
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                SECTIONS GRID
            ═══════════════════════════════════════════════════════ */}
            <section className="section" style={{ background: '#0d1f3c' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <div style={{
                            display: 'inline-flex', gap: '10px', alignItems: 'center',
                            fontFamily: 'var(--font-mono)', fontSize: '10px',
                            color: '#C9A84C', letterSpacing: '4px',
                            textTransform: 'uppercase', marginBottom: '16px',
                        }}>
                            <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                            {t('sections_label')}
                            <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                        </div>
                        <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '0' }}>
                            {t('sections_title1')} <span style={{ color: '#C9A84C' }}>{t('sections_title2')}</span>
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px' }}>
                        {sections.map((s, i) => (
                            <Link key={i} href={s.href} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    padding: '40px 32px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    height: '100%',
                                    transition: 'all 0.35s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                }}
                                     onMouseEnter={e => {
                                         const el = e.currentTarget
                                         el.style.background = 'rgba(201,168,76,0.08)'
                                         el.style.borderColor = 'rgba(201,168,76,0.25)'
                                         el.style.transform = 'translateY(-4px)'
                                     }}
                                     onMouseLeave={e => {
                                         const el = e.currentTarget
                                         el.style.background = 'rgba(255,255,255,0.03)'
                                         el.style.borderColor = 'rgba(255,255,255,0.05)'
                                         el.style.transform = 'translateY(0)'
                                     }}
                                >
                                    <div style={{ fontSize: '36px', marginBottom: '20px' }}>{s.icon}</div>
                                    <h3 style={{
                                        fontFamily: 'var(--font-display)', fontSize: '20px',
                                        color: '#fff', marginBottom: '10px',
                                    }}>{s.title}</h3>
                                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.8' }}>
                                        {s.desc}
                                    </p>
                                    <div style={{
                                        marginTop: '28px',
                                        fontFamily: 'var(--font-mono)', fontSize: '11px',
                                        color: '#C9A84C', letterSpacing: '2px',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                    }}>
                                        <span>→</span>
                                    </div>
                                    {/* Corner line decoration */}
                                    <div style={{
                                        position: 'absolute', bottom: 0, left: 0,
                                        width: '40px', height: '2px', background: '#C9A84C', opacity: 0.3,
                                    }} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                NEWS PREVIEW
            ═══════════════════════════════════════════════════════ */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <div style={{
                                display: 'inline-flex', gap: '8px', alignItems: 'center',
                                fontFamily: 'var(--font-mono)', fontSize: '10px',
                                color: 'var(--gold)', letterSpacing: '4px',
                                textTransform: 'uppercase', marginBottom: '12px',
                            }}>
                                <div style={{ width: '24px', height: '1px', background: 'var(--gold)' }} />
                                {t('news_label')}
                            </div>
                            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>{t('news_title')}</h2>
                        </div>
                        <Link href={`/${locale}/news`} className="btn-outline" style={{ borderRadius: '2px', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
                            {t('news_btn')}
                        </Link>
                    </div>

                    {latestNews.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            {latestNews.map((item, idx) => (
                                <Link key={item.id} href={`/${locale}/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        background: '#fff',
                                        borderRadius: '2px',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(27,58,107,0.08)',
                                        transition: 'all 0.3s',
                                        height: '100%',
                                        display: 'flex', flexDirection: 'column',
                                    }}
                                         onMouseEnter={e => {
                                             e.currentTarget.style.transform = 'translateY(-6px)'
                                             e.currentTarget.style.boxShadow = '0 24px 60px rgba(27,58,107,0.15)'
                                         }}
                                         onMouseLeave={e => {
                                             e.currentTarget.style.transform = 'translateY(0)'
                                             e.currentTarget.style.boxShadow = 'none'
                                         }}
                                    >
                                        <div style={{
                                            height: '220px',
                                            background: item.imageUrl
                                                ? `url(${item.imageUrl}) center/cover`
                                                : `linear-gradient(135deg, #112548, #1B3A6B)`,
                                            display: 'flex', alignItems: 'flex-end',
                                            position: 'relative', overflow: 'hidden',
                                        }}>
                                            {!item.imageUrl && (
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', opacity: 0.3 }}>📸</div>
                                            )}
                                            <div style={{
                                                position: 'absolute', top: '14px', left: '14px',
                                                background: 'rgba(201,168,76,0.9)',
                                                color: 'var(--navy-dark)',
                                                fontFamily: 'var(--font-mono)', fontSize: '9px',
                                                letterSpacing: '2px', textTransform: 'uppercase',
                                                padding: '4px 10px', borderRadius: '2px',
                                            }}>{item.category}</div>
                                        </div>
                                        <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{
                                                fontFamily: 'var(--font-mono)', fontSize: '10px',
                                                color: 'var(--gray-400)', marginBottom: '10px',
                                            }}>
                                                {formatDate(new Date(item.createdAt).getFullYear(), new Date(item.createdAt).getMonth(), new Date(item.createdAt).getDate(), locale)}
                                            </div>
                                            <h3 style={{
                                                fontFamily: 'var(--font-display)', fontSize: '19px',
                                                color: 'var(--navy-dark)', marginBottom: '12px',
                                                lineHeight: '1.35', flex: 1,
                                            }}>{item.title}</h3>
                                            <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.75', marginBottom: '20px' }}>
                                                {item.excerpt || item.content.substring(0, 120) + '...'}
                                            </p>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                fontFamily: 'var(--font-mono)', fontSize: '11px',
                                                color: 'var(--gold)', letterSpacing: '1px',
                                            }}>
                                                {t('read_more')}
                                                <span style={{ transition: 'transform 0.2s' }}>→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray-600)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📰</div>
                            <p>Yangiliklar yuklanmoqda...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                JADIDLAR TEASER
            ═══════════════════════════════════════════════════════ */}
            <section style={{
                background: 'linear-gradient(135deg, #1a0e00 0%, #2d1a00 50%, #1a0e00 100%)',
                padding: '80px 0',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `radial-gradient(circle at 30% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)`,
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        <div>
                            <div style={{
                                display: 'inline-flex', gap: '8px', alignItems: 'center',
                                fontFamily: 'var(--font-mono)', fontSize: '10px',
                                color: '#C9A84C', letterSpacing: '4px',
                                textTransform: 'uppercase', marginBottom: '20px',
                            }}>
                                <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                                {locale === 'ru' ? 'Новый раздел' : locale === 'en' ? 'New section' : 'Yangi bo\'lim'}
                            </div>
                            <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
                                {locale === 'ru' ? 'Узбекские ' : locale === 'en' ? 'Uzbek ' : "O'zbek "}
                                <span style={{ color: '#C9A84C' }}>
                                    {locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlari'}
                                </span>
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', lineHeight: '1.9', marginBottom: '32px', maxWidth: '440px' }}>
                                {locale === 'ru'
                                    ? 'Познакомьтесь с выдающимися узбекскими просветителями XIX–XX веков — борцами за образование, свободу и прогресс.'
                                    : locale === 'en'
                                        ? 'Meet the outstanding Uzbek enlighteners of the 19th–20th centuries — fighters for education, freedom and progress.'
                                        : "XIX–XX asr o'zbek jadidlari — ta'lim, ozodlik va taraqqiyot uchun kurashgan buyuk shaxslar bilan tanishing."}
                            </p>
                            <Link href={`/${locale}/jadidlar`} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                background: '#C9A84C', color: '#1a0e00',
                                fontFamily: 'var(--font-display)', fontWeight: '700',
                                fontSize: '13px', padding: '14px 28px', borderRadius: '2px',
                                letterSpacing: '1px', textTransform: 'uppercase',
                                transition: 'all 0.3s', textDecoration: 'none',
                            }}>
                                {locale === 'ru' ? 'Открыть раздел →' : locale === 'en' ? 'Explore →' : "Bo'limni ochish →"}
                            </Link>
                        </div>

                        {/* Jadid names preview */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                { name: 'Abdulla Avloniy', years: '1878–1934' },
                                { name: 'Mahmudxo\'ja Behbudiy', years: '1875–1919' },
                                { name: 'Abdurauf Fitrat', years: '1886–1938' },
                                { name: 'Hamza Hakimzoda', years: '1889–1929' },
                            ].map((jadid, i) => (
                                <div key={i} style={{
                                    padding: '20px',
                                    background: 'rgba(201,168,76,0.06)',
                                    border: '1px solid rgba(201,168,76,0.15)',
                                    borderRadius: '2px',
                                    transition: 'all 0.3s',
                                }}>
                                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>✒️</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>
                                        {jadid.name}
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(201,168,76,0.6)' }}>
                                        {jadid.years}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                CTA
            ═══════════════════════════════════════════════════════ */}
            <section style={{
                background: 'var(--navy-dark)',
                padding: '100px 0',
                textAlign: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                        radial-gradient(circle at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)
                    `,
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', gap: '10px', alignItems: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                        color: '#C9A84C', letterSpacing: '4px',
                        textTransform: 'uppercase', marginBottom: '20px',
                    }}>
                        <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                        {t('cta_label')}
                        <div style={{ width: '24px', height: '1px', background: '#C9A84C' }} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: 'clamp(30px, 4vw, 48px)', marginBottom: '16px', lineHeight: 1.2 }}>
                        {t('cta_title1')} <span style={{ color: '#C9A84C' }}>{t('cta_title2')}</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px', maxWidth: '480px', margin: '0 auto 40px', lineHeight: '1.8' }}>
                        {t('cta_desc')}
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href={`/${locale}/contact`} className="btn-primary" style={{ borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '13px' }}>
                            {t('cta_btn')}
                        </Link>
                        <Link href={`/${locale}/virtual-tour`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-display)',
                            fontWeight: '600', fontSize: '13px', padding: '13px 24px',
                            borderRadius: '2px', transition: 'all 0.3s', textDecoration: 'none',
                            letterSpacing: '1px', textTransform: 'uppercase',
                        }}>
                            ▶ {locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat'}
                        </Link>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes scrollLine {
                    0%, 100% { opacity: 1; transform: scaleY(1); }
                    50% { opacity: 0.3; transform: scaleY(0.5); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }
            `}</style>
        </>
    )
}