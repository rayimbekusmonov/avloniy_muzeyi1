'use client'
import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'

export default function VirtualTourPage() {
    const locale = useLocale()
    const videoRef = useRef<HTMLVideoElement>(null)
    const [playing, setPlaying] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(1)
    const [showControls, setShowControls] = useState(true)
    const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const t = {
        label: locale === 'ru' ? 'Виртуальный тур' : locale === 'en' ? 'Virtual Tour' : 'Virtual Sayohat',
        h1a: locale === 'ru' ? 'Посетите ' : locale === 'en' ? 'Visit the ' : 'Muzeyni ',
        h1b: locale === 'ru' ? 'Музей Онлайн' : locale === 'en' ? 'Museum Online' : 'Onlayn Ziyorat',
        desc: locale === 'ru'
            ? 'Погрузитесь в атмосферу музея, не выходя из дома. Наш виртуальный тур позволяет вам увидеть каждый зал, каждый экспонат.'
            : locale === 'en'
                ? "Immerse yourself in the museum's atmosphere without leaving home. Our virtual tour lets you see every hall, every exhibit."
                : "Uyingizdan chiqmasdan muzey atmosferasiga sho'ng'ing. Virtual sayohatimiz har bir zalni, har bir eksponatni ko'rishga imkon beradi.",
        playBtn: locale === 'ru' ? 'Начать тур' : locale === 'en' ? 'Start Tour' : 'Sayohatni boshlash',
        tip: locale === 'ru' ? 'Для лучшего опыта используйте полноэкранный режим' : locale === 'en' ? 'For the best experience, use fullscreen mode' : "Eng yaxshi tajriba uchun to'liq ekran rejimidan foydalaning",
        features: locale === 'ru' ? [
            { icon: '🎬', title: 'Видео тур', desc: '4K качество съёмки' },
            { icon: '🏺', title: 'Экспонаты', desc: 'Детальный осмотр предметов' },
            { icon: '📖', title: 'История', desc: 'Голосовые комментарии' },
            { icon: '🕐', title: '~10 минут', desc: 'Продолжительность тура' },
        ] : locale === 'en' ? [
            { icon: '🎬', title: 'Video Tour', desc: '4K quality footage' },
            { icon: '🏺', title: 'Exhibits', desc: 'Detailed item examination' },
            { icon: '📖', title: 'History', desc: 'Voice commentary' },
            { icon: '🕐', title: '~10 min', desc: 'Tour duration' },
        ] : [
            { icon: '🎬', title: 'Video Tour', desc: '4K sifatli suratga olish' },
            { icon: '🏺', title: 'Eksponatlar', desc: "Buyumlarni batafsil ko'rib chiqish" },
            { icon: '📖', title: 'Tarix', desc: 'Ovozli sharhlar' },
            { icon: '🕐', title: '~10 daqiqa', desc: 'Sayohat davomiyligi' },
        ],
    }

    const handleMouseMove = () => {
        setShowControls(true)
        if (controlsTimer.current) clearTimeout(controlsTimer.current)
        controlsTimer.current = setTimeout(() => {
            if (playing) setShowControls(false)
        }, 3000)
    }

    const togglePlay = () => {
        if (!videoRef.current) return
        if (playing) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setPlaying(!playing)
    }

    const toggleFullscreen = () => {
        const container = document.getElementById('video-container')
        if (!container) return
        if (!document.fullscreenElement) {
            container.requestFullscreen().then(() => setFullscreen(true))
        } else {
            document.exitFullscreen().then(() => setFullscreen(false))
        }
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) return
        setCurrentTime(videoRef.current.currentTime)
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100 || 0)
    }

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current) return
        const rect = e.currentTarget.getBoundingClientRect()
        const ratio = (e.clientX - rect.left) / rect.width
        videoRef.current.currentTime = ratio * videoRef.current.duration
    }

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = Math.floor(s % 60)
        return `${m}:${sec.toString().padStart(2, '0')}`
    }

    // Video public papkadan serve qilinadi
    // Videoni: /public/tour-video.mp4 ga joylashtiring
    const VIDEO_URL = '/tour-video.mp4'

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

            {/* Features */}
            <section style={{ background: '#0d1f3c', padding: '0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
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
                    <div
                        id="video-container"
                        onMouseMove={handleMouseMove}
                        style={{
                            position: 'relative',
                            background: '#000',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            aspectRatio: '16/9',
                            boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
                            cursor: playing ? (showControls ? 'default' : 'none') : 'default',
                            border: '1px solid rgba(201,168,76,0.15)',
                        }}
                    >
                        {VIDEO_URL ? (
                            <video
                                ref={videoRef}
                                src={VIDEO_URL}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                                onEnded={() => setPlaying(false)}
                                onClick={togglePlay}
                                playsInline
                            />
                        ) : (
                            /* Placeholder when no video URL */
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'linear-gradient(135deg, #0a1829, #1B3A6B)',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                gap: '16px',
                            }}>
                                <div style={{ fontSize: '80px', opacity: 0.3 }}>🎬</div>
                                <div style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '12px',
                                    color: 'rgba(255,255,255,0.4)', letterSpacing: '3px',
                                    textTransform: 'uppercase',
                                }}>
                                    {locale === 'ru' ? 'Видео загружается...' : locale === 'en' ? 'Video loading...' : 'Video yuklanmoqda...'}
                                </div>
                                <div style={{
                                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                                    color: 'rgba(255,255,255,0.25)', maxWidth: '360px',
                                    textAlign: 'center', lineHeight: '1.8',
                                }}>
                                    {locale === 'ru'
                                        ? 'Добавьте NEXT_PUBLIC_TOUR_VIDEO_URL в переменные окружения'
                                        : locale === 'en'
                                            ? 'Add NEXT_PUBLIC_TOUR_VIDEO_URL to environment variables'
                                            : "NEXT_PUBLIC_TOUR_VIDEO_URL ni muhit o'zgaruvchilariga qo'shing"}
                                </div>
                            </div>
                        )}

                        {/* Play overlay */}
                        {!playing && VIDEO_URL && (
                            <div
                                onClick={togglePlay}
                                style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.5)',
                                    cursor: 'pointer',
                                    gap: '16px',
                                }}
                            >
                                <div style={{
                                    width: '80px', height: '80px',
                                    background: '#C9A84C',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '28px',
                                    boxShadow: '0 0 0 16px rgba(201,168,76,0.15)',
                                    transition: 'all 0.3s',
                                }}>▶</div>
                                <div style={{
                                    fontFamily: 'var(--font-display)', fontSize: '18px',
                                    color: '#fff', letterSpacing: '2px',
                                }}>{t.playBtn}</div>
                            </div>
                        )}

                        {/* Controls */}
                        {VIDEO_URL && (
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                padding: '16px 20px 20px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                                opacity: showControls ? 1 : 0,
                                transition: 'opacity 0.4s',
                            }}>
                                {/* Progress bar */}
                                <div
                                    onClick={handleSeek}
                                    style={{
                                        height: '4px',
                                        background: 'rgba(255,255,255,0.2)',
                                        borderRadius: '2px',
                                        marginBottom: '12px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}
                                >
                                    <div style={{
                                        height: '100%',
                                        width: `${progress}%`,
                                        background: '#C9A84C',
                                        borderRadius: '2px',
                                        transition: 'width 0.1s',
                                    }} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <button onClick={togglePlay} style={{
                                        background: 'none', border: 'none', color: '#fff',
                                        fontSize: '20px', cursor: 'pointer', padding: '0',
                                        lineHeight: 1,
                                    }}>
                                        {playing ? '⏸' : '▶'}
                                    </button>

                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>

                                    <input
                                        type="range" min="0" max="1" step="0.05"
                                        value={volume}
                                        onChange={e => {
                                            const v = Number(e.target.value)
                                            setVolume(v)
                                            if (videoRef.current) videoRef.current.volume = v
                                        }}
                                        style={{ width: '80px', accentColor: '#C9A84C' }}
                                    />

                                    <button onClick={toggleFullscreen} style={{
                                        marginLeft: 'auto', background: 'none', border: 'none',
                                        color: '#fff', fontSize: '16px', cursor: 'pointer',
                                    }}>
                                        {fullscreen ? '⛶' : '⛶'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tip */}
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
                    <a href={`/${locale}/contact`} className="btn-primary" style={{ borderRadius: '2px', textDecoration: 'none' }}>
                        {locale === 'ru' ? "Связаться →" : locale === 'en' ? 'Contact us →' : "Bog'lanish →"}
                    </a>
                </div>
            </section>
        </>
    )
}