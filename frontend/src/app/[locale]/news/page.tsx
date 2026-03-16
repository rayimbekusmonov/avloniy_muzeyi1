'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { newsService } from '@/lib/services'
import { NewsItem } from '@/lib/api'

const CATEGORIES = [
    { value: '', labelUz: 'Barchasi', labelRu: 'Все', labelEn: 'All' },
    { value: 'YANGILIK', labelUz: 'Yangilik', labelRu: 'Новости', labelEn: 'News' },
    { value: 'KORGAZMA', labelUz: "Ko'rgazma", labelRu: 'Выставка', labelEn: 'Exhibition' },
    { value: 'TADBIR', labelUz: 'Tadbir', labelRu: 'Мероприятие', labelEn: 'Event' },
    { value: 'BAYRAM', labelUz: 'Bayram', labelRu: 'Праздник', labelEn: 'Holiday' },
]

function formatDate(dateString: string, locale: string) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const months = {
        ru: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
        en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        uz: ['Yanv','Fevr','Mart','Apr','May','Iyun','Iyul','Avg','Sent','Okt','Noyb','Dek'],
    }
    const m = months[locale as keyof typeof months] || months.uz
    if (locale === 'ru') return `${day} ${m[month]}, ${year}`
    if (locale === 'en') return `${m[month]} ${day}, ${year}`
    return `${day}-${m[month]}, ${year}`
}

export default function NewsPage() {
    const locale = useLocale()
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const t = {
        label: locale === 'ru' ? 'Новости' : locale === 'en' ? 'News' : 'Yangiliklar',
        h1a: locale === 'ru' ? 'Последние ' : locale === 'en' ? 'Latest ' : 'So\'nggi ',
        h1b: locale === 'ru' ? 'Новости' : locale === 'en' ? 'News' : 'Yangiliklar',
        desc: locale === 'ru'
            ? 'Следите за последними событиями и новостями музея Абдуллы Авлония.'
            : locale === 'en'
                ? 'Follow the latest events and news from the Abdulla Avloniy Museum.'
                : "Abdulla Avloniy muzeyi so'nggi yangiliklari va tadbirlarini kuzatib boring.",
        empty: locale === 'ru' ? 'Новостей пока нет' : locale === 'en' ? 'No news yet' : 'Hali yangiliklar yo\'q',
        readMore: locale === 'ru' ? 'Читать далее' : locale === 'en' ? 'Read more' : 'Batafsil',
        prev: locale === 'ru' ? '← Назад' : locale === 'en' ? '← Prev' : '← Oldingi',
        next: locale === 'ru' ? 'Далее →' : locale === 'en' ? 'Next →' : 'Keyingi →',
    }

    useEffect(() => {
        fetchNews()
    }, [activeCategory, page, locale])

    const fetchNews = async () => {
        setLoading(true)
        try {
            const data = await newsService.getAll(page, 9, activeCategory || undefined, locale)
            setNews(data.content)
            setTotalPages(data.totalPages)
        } catch {
            setNews([])
        } finally {
            setLoading(false)
        }
    }

    const getCategoryLabel = (cat: typeof CATEGORIES[0]) => {
        return locale === 'ru' ? cat.labelRu : locale === 'en' ? cat.labelEn : cat.labelUz
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><span>📰</span> {t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            {/* Category Filter */}
            <section style={{ background: '#0d1f3c', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => { setActiveCategory(cat.value); setPage(0) }}
                                style={{
                                    padding: '16px 24px',
                                    border: 'none',
                                    borderBottom: activeCategory === cat.value ? '2px solid #C9A84C' : '2px solid transparent',
                                    background: 'none',
                                    color: activeCategory === cat.value ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {getCategoryLabel(cat)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📰</div>
                            <p>{locale === 'ru' ? 'Загрузка...' : locale === 'en' ? 'Loading...' : 'Yuklanmoqda...'}</p>
                        </div>
                    ) : news.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px', color: 'var(--gray-600)' }}>
                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
                            <p>{t.empty}</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                            {news.map(item => (
                                <Link key={item.id} href={`/${locale}/news/${item.slug}`} style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                         onMouseEnter={e => {
                                             e.currentTarget.style.transform = 'translateY(-6px)'
                                             e.currentTarget.style.boxShadow = '0 20px 50px rgba(27,58,107,0.15)'
                                         }}
                                         onMouseLeave={e => {
                                             e.currentTarget.style.transform = 'translateY(0)'
                                             e.currentTarget.style.boxShadow = ''
                                         }}
                                    >
                                        {/* Image */}
                                        <div style={{ position: 'relative', height: '220px', background: 'linear-gradient(135deg, #112548, #1B3A6B)', overflow: 'hidden' }}>
                                            {item.imageUrl ? (
                                                <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', opacity: 0.3 }}>📸</div>
                                            )}
                                            <div style={{
                                                position: 'absolute', top: '14px', left: '14px',
                                                background: 'rgba(201,168,76,0.9)', color: '#112548',
                                                fontFamily: 'var(--font-mono)', fontSize: '9px',
                                                letterSpacing: '2px', textTransform: 'uppercase',
                                                padding: '4px 10px', borderRadius: '2px',
                                            }}>{item.category}</div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gray-400)', marginBottom: '10px' }}>
                                                {formatDate(item.createdAt, locale)}
                                            </div>
                                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--navy-dark)', marginBottom: '10px', lineHeight: '1.35', flex: 1 }}>
                                                {item.title}
                                            </h3>
                                            {item.excerpt && (
                                                <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.75', marginBottom: '16px' }}>
                                                    {item.excerpt.length > 120 ? item.excerpt.substring(0, 120) + '...' : item.excerpt}
                                                </p>
                                            )}
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {t.readMore} →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '48px' }}>
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="btn-outline"
                                style={{ opacity: page === 0 ? 0.4 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
                            >{t.prev}</button>
                            <span style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gray-600)' }}>
                                {page + 1} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page === totalPages - 1}
                                className="btn-outline"
                                style={{ opacity: page === totalPages - 1 ? 0.4 : 1, cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer' }}
                            >{t.next}</button>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}