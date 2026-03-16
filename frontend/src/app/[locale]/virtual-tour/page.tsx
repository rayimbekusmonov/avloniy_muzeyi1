'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'

const YOUTUBE_VIDEO_ID = 'Z5ulqXdxSBA'

const Icons = {
    Video: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
    ),
    Layers: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
        </svg>
    ),
    Book: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    ),
    Clock: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
    ),
    Play: () => (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
    ),
    Lightbulb: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
        </svg>
    ),
}

export default function VirtualTourPage() {
    const locale = useLocale()
    const [started, setStarted] = useState(false)

    const t = {
        label:   locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat',
        h1a:     locale === 'ru' ? 'Посетите ' : locale === 'en' ? 'Visit the ' : 'Muzeyni ',
        h1b:     locale === 'ru' ? 'Музей Онлайн' : locale === 'en' ? 'Museum Online' : 'Onlayn Ziyorat',
        desc:    locale === 'ru'
            ? 'Погрузитесь в атмосферу музея, не выходя из дома.'
            : locale === 'en'
                ? "Immerse yourself in the museum's atmosphere without leaving home."
                : "Uyingizdan chiqmasdan muzey atmosferasiga sho'ng'ing.",
        playBtn: locale === 'ru' ? 'Начать тур' : locale === 'en' ? 'Start Tour' : 'Sayohatni boshlash',
        tip:     locale === 'ru' ? 'Для лучшего опыта используйте полноэкранный режим'
            : locale === 'en' ? 'For the best experience, use fullscreen mode'
                : "Eng yaxshi tajriba uchun to'liq ekran rejimidan foydalaning",
        features: locale === 'ru' ? [
            { Icon: Icons.Video,  title: 'Видео тур',  desc: 'Высокое качество' },
            { Icon: Icons.Layers, title: 'Экспонаты',  desc: 'Детальный осмотр' },
            { Icon: Icons.Book,   title: 'История',    desc: 'Голосовые комментарии' },
            { Icon: Icons.Clock,  title: '~10 минут',  desc: 'Продолжительность' },
        ] : locale === 'en' ? [
            { Icon: Icons.Video,  title: 'Video Tour', desc: 'High quality' },
            { Icon: Icons.Layers, title: 'Exhibits',   desc: 'Detailed view' },
            { Icon: Icons.Book,   title: 'History',    desc: 'Voice commentary' },
            { Icon: Icons.Clock,  title: '~10 min',    desc: 'Duration' },
        ] : [
            { Icon: Icons.Video,  title: 'Video Tour',  desc: 'Yuqori sifat' },
            { Icon: Icons.Layers, title: 'Eksponatlar', desc: "Batafsil ko'rish" },
            { Icon: Icons.Book,   title: 'Tarix',       desc: 'Ovozli sharhlar' },
            { Icon: Icons.Clock,  title: '~10 daqiqa',  desc: 'Davomiyligi' },
        ],
    }

    return (
        <>
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label">
                        <Icons.Video />
                        {t.label}
                    </div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            <section style={{ background: '#0d1f3c', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {t.features.map((f, i) => (
                            <div key={i} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                                <div style={{ color: 'rgba(201,168,76,0.7)', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                    <f.Icon />
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', marginBottom: '4px' }}>{f.title}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ background: '#060f1e', padding: '60px 0' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <div style={{
                        position: 'relative', aspectRatio: '16/9', background: '#000',
                        borderRadius: '4px', overflow: 'hidden',
                        boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
                        border: '1px solid rgba(201,168,76,0.15)',
                    }}>
                        {!started ? (
                            <div style={{ position: 'absolute', inset: 0 }}>
                                <img
                                    src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                                    alt="Virtual Tour"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                                    onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg` }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }} />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                                    <button
                                        onClick={() => setStarted(true)}
                                        style={{
                                            width: '90px', height: '90px', background: '#C9A84C',
                                            border: 'none', borderRadius: '50%', cursor: 'pointer',
                                            color: '#1a0e00', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 0 0 20px rgba(201,168,76,0.15)', transition: 'all 0.3s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 0 0 24px rgba(201,168,76,0.2)' }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 0 20px rgba(201,168,76,0.15)' }}
                                    >
                                        <Icons.Play />
                                    </button>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fff', letterSpacing: '2px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                                        {t.playBtn}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <iframe
                                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        )}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '2px' }}>
                        <Icons.Lightbulb /> {t.tip}
                    </div>
                </div>
            </section>

            <section style={{ background: 'var(--off-white)', padding: '60px 0', textAlign: 'center' }}>
                <div className="container">
                    <h3 style={{ fontSize: '28px', marginBottom: '12px' }}>
                        {locale === 'ru' ? 'Хотите посетить лично?' : locale === 'en' ? 'Want to visit in person?' : 'Shaxsan tashrif buyurmoqchimisiz?'}
                    </h3>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '28px', fontSize: '16px' }}>
                        {locale === 'ru' ? 'Музей открыт ежедневно с 9:00 до 17:00' : locale === 'en' ? 'Museum is open daily from 9:00 to 17:00' : 'Muzey har kuni 9:00 dan 17:00 gacha ochiq'}
                    </p>
                    <a href={`/${locale}/contact`} className="btn-primary" style={{ textDecoration: 'none', borderRadius: '2px' }}>
                        {locale === 'ru' ? 'Связаться →' : locale === 'en' ? 'Contact us →' : "Bog'lanish →"}
                    </a>
                </div>
            </section>
        </>
    )
}