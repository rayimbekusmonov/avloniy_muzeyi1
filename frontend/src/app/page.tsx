'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

function formatDate(year: number, month: number, day: number) {
    const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
    return `${day}-${months[month]}, ${year}`
}

const stats = [
    { number: '500+', label: 'Eksponat' },
    { number: '90', label: "Yillik tarix" },
    { number: '1934', label: 'Asos solingan' },
    { number: '12K+', label: 'Yillik mehmon' },
]

const sections = [
    {
        href: '/about',
        icon: '🏛️',
        title: 'Muzey Haqida',
        desc: "Abdulla Avloniy hayoti, ijodi va muzeyning tarixi bilan tanishing.",
    },
    {
        href: '/gallery',
        icon: '🖼️',
        title: 'Galereya',
        desc: "Rasmlar, videolar va audio materiallar to'plami.",
    },
    {
        href: '/resources',
        icon: '📚',
        title: 'Manbalar',
        desc: "E-kitoblar, maqolalar va ilmiy ishlar kutubxonasi.",
    },
    {
        href: '/news',
        icon: '📰',
        title: 'Yangiliklar',
        desc: "Muzeyning so'nggi tadbirlari va yangiliklari.",
    },
]

// ✅ Rasmlarni Supabase ga yuklab, URL larni shu yerga qo'ying
const SLIDE_IMAGES = [
    '/slide1.jpg',
    '/slide2.jpg',
    '/slide3.jpg',
    '/slide4.jpg',
]

function HeroSlideshow() {
    const [current, setCurrent] = useState(0)
    const [next, setNext] = useState(1)
    const [fading, setFading] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setFading(true)
            setTimeout(() => {
                setCurrent(prev => (prev + 1) % SLIDE_IMAGES.length)
                setNext(prev => (prev + 1) % SLIDE_IMAGES.length)
                setFading(false)
            }, 1000)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {/* Current slide */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${SLIDE_IMAGES[current]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'opacity 1s ease',
                opacity: fading ? 0 : 0.25,
            }} />
            {/* Next slide (preload) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${SLIDE_IMAGES[next]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'opacity 1s ease',
                opacity: fading ? 0.25 : 0,
            }} />
            {/* Dark overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(10,24,41,0.85) 0%, rgba(27,58,107,0.75) 50%, rgba(37,77,143,0.7) 100%)',
            }} />
        </>
    )
}

export default function HomePage() {
    const [latestNews, setLatestNews] = useState<NewsItem[]>([])

    useEffect(() => {
        newsService.getAll(0, 3).then(data => setLatestNews(data.content))
    }, [])

    return (
        <>
            {/* HERO */}
            <section style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a1829 0%, #1B3A6B 50%, #254d8f 100%)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: '100px 0',
            }}>
                {/* Slideshow */}
                <HeroSlideshow />

                {/* Gold radial glow */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                        radial-gradient(circle at 75% 40%, rgba(201,168,76,0.12) 0%, transparent 45%),
                        radial-gradient(circle at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 40%)
                    `,
                    pointerEvents: 'none',
                    zIndex: 1,
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '40px',
                    }}>
                        {/* Hero Text */}
                        <div style={{ flex: '1 1 500px' }}>
                            <div className="animate-fade-up" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(201,168,76,0.12)',
                                border: '1px solid rgba(201,168,76,0.3)',
                                color: '#C9A84C',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                letterSpacing: '3px',
                                textTransform: 'uppercase' as const,
                                padding: '7px 18px',
                                borderRadius: '20px',
                                marginBottom: '28px',
                            }}>
                                <span>✦</span> Toshkent · 1934-yildan buyon
                            </div>

                            <h1 className="animate-fade-up animate-delay-1" style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(40px, 8vw, 72px)',
                                fontWeight: '700',
                                color: '#fff',
                                lineHeight: 1.1,
                                marginBottom: '24px',
                            }}>
                                Abdulla<br />
                                <span style={{ color: '#C9A84C' }}>Avloniy</span><br />
                                Muzeyi
                            </h1>

                            <p className="animate-fade-up animate-delay-2" style={{
                                fontSize: '18px',
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: '300',
                                lineHeight: '1.8',
                                marginBottom: '40px',
                                maxWidth: '520px',
                            }}>
                                Buyuk ma'rifatparvar, shoir va pedagog Abdulla Avloniy xotirasini
                                saqlovchi va kelajak avlodlarga yetkazuvchi milliy muzey.
                            </p>

                            <div className="animate-fade-up animate-delay-3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <Link href="/about" className="btn-primary">Muzeyni ko'rish →</Link>
                                <Link href="/gallery" className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>Galereya</Link>
                            </div>
                        </div>

                        {/* Hero Quote */}
                        <div className="hero-quote animate-fade-up animate-delay-4" style={{
                            flex: '1 1 300px',
                            maxWidth: '400px',
                            padding: '32px',
                            background: 'rgba(201,168,76,0.08)',
                            border: '1px solid rgba(201,168,76,0.2)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <div style={{ fontSize: '48px', color: 'rgba(201,168,76,0.4)', lineHeight: 1, marginBottom: '12px', fontFamily: 'Georgia' }}>"</div>
                            <p style={{
                                fontFamily: 'var(--font-display)',
                                fontStyle: 'italic',
                                fontSize: '17px',
                                color: 'rgba(255,255,255,0.8)',
                                lineHeight: '1.8',
                                marginBottom: '16px',
                            }}>
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
                    position: 'absolute',
                    bottom: '32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '2px',
                    animation: 'fadeIn 1s ease 1s both',
                    zIndex: 2,
                }}>
                    <div>SCROLL</div>
                    <div style={{ width: '1px', height: '32px', background: 'rgba(201,168,76,0.4)' }} />
                </div>
            </section>

            {/* STATS */}
            <section style={{ background: 'var(--navy)', padding: '48px 0' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '0',
                    }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{
                                textAlign: 'center',
                                padding: '24px',
                                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            }}>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '42px',
                                    fontWeight: '700',
                                    color: '#C9A84C',
                                    lineHeight: 1,
                                    marginBottom: '8px',
                                }}>{stat.number}</div>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '11px',
                                    color: 'rgba(255,255,255,0.6)',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase' as const,
                                }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT PREVIEW */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '80px',
                        alignItems: 'center',
                    }}>
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '16px' }}>
                                Kimdir u?
                            </div>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: '16px' }}>
                                Abdulla <span style={{ color: 'var(--gold)' }}>Avloniy</span>
                            </h2>
                            <div className="gold-divider" />
                            <p style={{ fontSize: '17px', color: 'var(--gray-600)', lineHeight: '1.9', marginBottom: '16px', marginTop: '16px' }}>
                                Abdulla Avloniy (1878–1934) — o'zbek adabiyoti va pedagogika tarixida alohida o'rin tutuvchi buyuk shaxs. U shoir, dramaturg, tarjimon, jurnalist va ma'rifatparvar sifatida halqimiz ma'naviyatiga katta hissa qo'shgan.
                            </p>
                            <p style={{ fontSize: '17px', color: 'var(--gray-600)', lineHeight: '1.9', marginBottom: '32px' }}>
                                Uning "Turkiy Guliston yoxud axloq" asari hamon pedagogik fikr taraqqiyotida muhim manba bo'lib kelmoqda.
                            </p>
                            <Link href="/about" className="btn-primary">
                                Batafsil o'qish →
                            </Link>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '100%',
                                paddingTop: '120%',
                                background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                                borderRadius: '16px',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-lg)',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.3)',
                                    fontFamily: 'var(--font-display)',
                                }}>
                                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🖼️</div>
                                    <div style={{ fontSize: '14px', letterSpacing: '2px' }}>AVLONIY PORTRETI</div>
                                </div>
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: '-16px',
                                right: '-16px',
                                width: '100px',
                                height: '100px',
                                background: 'var(--gold)',
                                borderRadius: '12px',
                                zIndex: -1,
                                opacity: 0.3,
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTIONS PREVIEW */}
            <section className="section" style={{ background: 'var(--white)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '12px' }}>
                            Nima topasiz?
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
                            Muzey <span style={{ color: 'var(--gold)' }}>bo'limlari</span>
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
                                        Ko'rish →
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
                                So'nggi voqealar
                            </div>
                            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Yangiliklar</h2>
                        </div>
                        <Link href="/news" className="btn-outline">Barchasini ko'rish</Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {latestNews.map(item => (
                            <Link key={item.id} href={`/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                <div className="card">
                                    <div style={{
                                        height: '180px',
                                        background: item.imageUrl
                                            ? `url(${item.imageUrl}) center/cover`
                                            : 'linear-gradient(135deg, var(--navy-dark), var(--navy-light))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.3)',
                                        fontSize: '32px',
                                    }}>{!item.imageUrl && '📸'}</div>
                                    <div style={{ padding: '24px' }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '10px' }}>
                                            {formatDate(
                                                new Date(item.createdAt).getFullYear(),
                                                new Date(item.createdAt).getMonth(),
                                                new Date(item.createdAt).getDate()
                                            )}
                                        </div>
                                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--navy-dark)', marginBottom: '10px', lineHeight: '1.4' }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.7' }}>
                                            {item.excerpt || item.content.substring(0, 100) + '...'}
                                        </p>
                                        <div style={{ display: 'inline-block', marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)' }}>
                                            Batafsil →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                padding: '80px 0',
                textAlign: 'center',
            }}>
                <div className="container">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase' as const, marginBottom: '16px' }}>
                        Bizga tashrif buyuring
                    </div>
                    <h2 style={{ color: 'var(--white)', fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: '16px' }}>
                        Muzeyga <span style={{ color: 'var(--gold)' }}>xush kelibsiz</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '17px', maxWidth: '500px', margin: '0 auto 36px' }}>
                        Har kuni Dushanbadan Yakshanba kuni. Manzil va ish vaqti haqida ma'lumot oling.
                    </p>
                    <Link href="/contact" className="btn-primary">
                        Manzilni ko'rish →
                    </Link>
                </div>
            </section>
        </>
    )
}
