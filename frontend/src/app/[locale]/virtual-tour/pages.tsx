'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'

// YouTube video ID ni shu yerga qo'ying
// Masalan: https://youtube.com/watch?v=dQw4w9WgXcQ => "dQw4w9WgXcQ"
const YOUTUBE_VIDEO_ID = 'YOUR_VIDEO_ID'

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
            { icon: '🎬', title: 'Видео тур',   desc: 'Высокое качество' },
            { icon: '🏺', title: 'Экспонаты',   desc: 'Детальный осмотр' },
            { icon: '📖', title: 'История',     desc: 'Голосовые комментарии' },
            { icon: '🕐', title: '~10 минут',   desc: 'Продолжительность' },
        ] : locale === 'en' ? [
            { icon: '🎬', title: 'Video Tour',  desc: 'High quality' },
            { icon: '🏺', title: 'Exhibits',    desc: 'Detailed view' },
            { icon: '📖', title: 'History',     desc: 'Voice commentary' },
            { icon: '🕐', title: '~10 min',     desc: 'Duration' },
        ] : [
            { icon: '🎬', title: 'Video Tour',  desc: 'Yuqori sifat' },
            { icon: '🏺', title: 'Eksponatlar', desc: "Batafsil ko'rish" },
            { icon: '📖', title: 'Tarix',       desc: 'Ovozli sharhlar' },
            { icon: '🕐', title: '~10 daqiqa',  desc: 'Davomiyligi' },
        ],
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><span>🎬</span> {t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            {/* Features bar */}
            <section style={{ background: '#0d1f3c', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {t.features.map((f, i) => (
                            <div key={i} style={{
                                padding: '28px 24px', textAlign: 'center',
                                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                            }}>
                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#fff', marginBottom: '4px' }}>{f.title}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Player */}
            <section style={{ background: '#060f1e', padding: '60px 0' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <div style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        background: '#000',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
                        border: '1px solid rgba(201,168,76,0.15)',
                    }}>
                        {!started ? (
                            /* Thumbnail + Play button */
                            <div style={{ position: 'absolute', inset: 0 }}>
                                {/* YouTube thumbnail */}
                                <img
                                    src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                                    alt="Virtual Tour"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                                    onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg` }}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                                }} />

                                {/* Play button */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', gap: '20px',
                                }}>
                                    <button
                                        onClick={() => setStarted(true)}
                                        style={{
                                            width: '90px', height: '90px',
                                            background: '#C9A84C', border: 'none',
                                            borderRadius: '50%', cursor: 'pointer',
                                            fontSize: '32px', color: '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 0 0 20px rgba(201,168,76,0.15)',
                                            transition: 'all 0.3s',
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'
                                            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 24px rgba(201,168,76,0.2)'
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
                                            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 20px rgba(201,168,76,0.15)'
                                        }}
                                    >▶</button>
                                    <div style={{
                                        fontFamily: 'var(--font-display)', fontSize: '20px',
                                        color: '#fff', letterSpacing: '2px',
                                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                    }}>{t.playBtn}</div>
                                </div>
                            </div>
                        ) : (
                            /* YouTube iframe — play tugmasidan keyin yuklanadi */
                            <iframe
                                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        )}
                    </div>

                    <div style={{
                        textAlign: 'center', marginTop: '20px',
                        fontFamily: 'var(--font-mono)', fontSize: '11px',
                        color: 'rgba(255,255,255,0.25)', letterSpacing: '2px',
                    }}>
                        💡 {t.tip}
                    </div>
                </div>
            </section>

            {/* CTA */}
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