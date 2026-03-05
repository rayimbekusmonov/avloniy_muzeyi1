'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const months = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
    return `${date.getDate()}-${months[date.getMonth()]}, ${date.getFullYear()}`
}

export default function NewsDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const [news, setNews] = useState<NewsItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await newsService.getBySlug(slug)
                setNews(data)
            } catch {
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }
        if (slug) fetch()
    }, [slug])

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' }}>
            Yuklanmoqda...
        </div>
    )

    if (notFound || !news) return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ fontSize: '48px' }}>📭</div>
            <p style={{ color: 'var(--gray-600)' }}>Yangilik topilmadi</p>
            <Link href="/news" className="btn-primary">← Yangiliklarga qaytish</Link>
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
                        <Link href="/news" style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1px',
                        }}>← Yangiliklarga qaytish</Link>
                    </div>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(201,168,76,0.15)',
                        color: 'var(--gold)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '2px',
                        padding: '4px 14px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                    }}>{news.category}</div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(28px, 4vw, 48px)',
                        color: '#fff',
                        lineHeight: '1.2',
                        marginBottom: '20px',
                    }}>{news.title}</h1>
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                    }}>
                        <span>📅 {formatDate(news.createdAt)}</span>
                        {news.authorUsername && <span>✍️ {news.authorUsername}</span>}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section style={{ background: 'var(--off-white)', padding: '60px 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    {news.excerpt && (
                        <p style={{
                            fontSize: '20px',
                            color: 'var(--navy)',
                            lineHeight: '1.8',
                            fontStyle: 'italic',
                            borderLeft: '4px solid var(--gold)',
                            paddingLeft: '24px',
                            marginBottom: '40px',
                        }}>{news.excerpt}</p>
                    )}
                    <div style={{
                        fontSize: '17px',
                        color: 'var(--text-dark)',
                        lineHeight: '1.9',
                        whiteSpace: 'pre-wrap',
                    }}>{news.content}</div>

                    <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(27,58,107,0.1)' }}>
                        <Link href="/news" className="btn-outline">← Barcha yangiliklar</Link>
                    </div>
                </div>
            </section>
        </>
    )
}