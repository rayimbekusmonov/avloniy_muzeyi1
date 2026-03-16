'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

function formatDate(dateStr: string, locale: string) {
    const date = new Date(dateStr)
    const months = {
        uz: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
        ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    }
    const m = months[locale as keyof typeof months] || months.uz
    if (locale === 'ru') return `${date.getDate()} ${m[date.getMonth()]}, ${date.getFullYear()}`
    if (locale === 'en') return `${m[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    return `${date.getDate()}-${m[date.getMonth()]}, ${date.getFullYear()}`
}

export default function NewsDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const locale = useLocale()
    const [news, setNews] = useState<NewsItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true)
            setNotFound(false)
            try {
                // locale parametr bilan — to'g'ri til qaytariladi
                const data = await newsService.getBySlug(slug, locale)
                setNews(data)
            } catch {
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }
        if (slug) fetchNews()
    }, [slug, locale]) // locale o'zgarganda qayta yuklaydi

    const t = {
        back: locale === 'ru' ? '← Назад к новостям' : locale === 'en' ? '← Back to news' : '← Yangiliklarga qaytish',
        all: locale === 'ru' ? '← Все новости' : locale === 'en' ? '← All news' : '← Barcha yangiliklar',
        notFound: locale === 'ru' ? 'Новость не найдена' : locale === 'en' ? 'News not found' : 'Yangilik topilmadi',
        loading: locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...',
    }

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' }}>
            {t.loading}
        </div>
    )

    if (notFound || !news) return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>📭</div>
            <p style={{ color: 'var(--gray-600)' }}>{t.notFound}</p>
            <Link href={`/${locale}/news`} className="btn-primary">{t.back}</Link>
        </div>
    )

    return (
        <>
            {/* Hero */}
            <div style={{
                background: news.imageUrl
                    ? `linear-gradient(to bottom, rgba(10,24,41,0.7), rgba(10,24,41,0.95)), url(${news.imageUrl}) center/cover`
                    : 'linear-gradient(135deg, #0a1829, #1B3A6B)',
                padding: '120px 0 60px',
            }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <Link href={`/${locale}/news`} style={{
                            fontFamily: 'var(--font-mono)', fontSize: '12px',
                            color: 'rgba(255,255,255,0.5)', letterSpacing: '1px',
                        }}>{t.back}</Link>
                    </div>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(201,168,76,0.15)', color: 'var(--gold)',
                        fontFamily: 'var(--font-mono)', fontSize: '10px',
                        letterSpacing: '2px', padding: '4px 14px',
                        borderRadius: '10px', marginBottom: '20px',
                    }}>{news.category}</div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(28px, 4vw, 48px)',
                        color: '#fff', lineHeight: '1.2', marginBottom: '20px',
                    }}>{news.title}</h1>
                    <div style={{
                        display: 'flex', gap: '20px',
                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                    }}>
                        <span>📅 {formatDate(news.createdAt, locale)}</span>
                        {news.authorUsername && <span>✍️ {news.authorUsername}</span>}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section style={{ background: 'var(--off-white)', padding: '60px 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    {news.excerpt && (
                        <p style={{
                            fontSize: '20px', color: 'var(--navy)', lineHeight: '1.8',
                            fontStyle: 'italic', borderLeft: '4px solid var(--gold)',
                            paddingLeft: '24px', marginBottom: '40px',
                        }}>{news.excerpt}</p>
                    )}

                    {/* dangerouslySetInnerHTML — HTML teglarni to'g'ri render qiladi */}
                    <div
                        className="news-content"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />

                    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(27,58,107,0.1)' }}>
                        <Link href={`/${locale}/news`} className="btn-outline">{t.all}</Link>
                    </div>
                </div>
            </section>

            <style>{`
                .news-content {
                    font-size: 17px;
                    color: var(--text-dark);
                    line-height: 1.9;
                }
                .news-content p {
                    margin-bottom: 20px;
                }
                .news-content h1, .news-content h2, .news-content h3 {
                    font-family: var(--font-display);
                    color: var(--navy-dark);
                    margin: 32px 0 16px;
                }
                .news-content ul, .news-content ol {
                    padding-left: 24px;
                    margin-bottom: 20px;
                }
                .news-content li {
                    margin-bottom: 8px;
                }
                .news-content img {
                    max-width: 100%;
                    border-radius: 4px;
                    margin: 24px 0;
                }
                .news-content a {
                    color: var(--navy);
                    text-decoration: underline;
                }
                .news-content blockquote {
                    border-left: 4px solid var(--gold);
                    padding-left: 20px;
                    font-style: italic;
                    color: var(--navy);
                    margin: 24px 0;
                }
                /* RichTextEditor dan kelgan inline style larni tozalash */
                .news-content span[style*="background-color: rgb(255, 255, 255)"] {
                    background-color: transparent !important;
                }
                .news-content span[style*="color: rgb(0, 0, 0)"] {
                    color: inherit !important;
                }
            `}</style>
        </>
    )
}
