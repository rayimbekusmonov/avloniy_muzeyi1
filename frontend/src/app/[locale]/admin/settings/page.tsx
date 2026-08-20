'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { isAuthenticated, removeToken, SiteSetting } from '@/lib/api'
import { settingService } from '@/lib/services'
import { translateBatch } from '@/lib/translate'

const LANGS = [
    { key: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { key: 'ru', label: 'Русский', flag: '🇷🇺' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
]

const DEFAULT_HERO_QUOTES = [
    {
        text: "Tarbiya biz uchun yo hayot — yo mamot, yo najot — yo halokat, yo saodat — yo falokat masalasidir.",
        author: "Abdulla Avloniy",
        role: "Shoir, pedagog va matbuot asoschisi (Toshkent)"
    },
    {
        text: "Haq olinadur, berilmaydur! Dunyoda turmoq uchun dunyoviy fan va ilm lozimdir.",
        author: "Mahmudxo'ja Behbudiy",
        role: "Jadidchilik harakati sarvari va dramaturg (Samarqand)"
    },
    {
        text: "Bizni jaholat va nodonlik qorong'uligidan faqat ilm, ma'rifat va maktab qutqara oladi.",
        author: "Munavvarqori Abdurrashidxonov",
        role: "Toshkent jadidlarining yetakchisi"
    },
    {
        text: "Go'zal Turkiston, senga ne bo'ldi? Yonar bag'ringizda alanga qayda?",
        author: "Abdulhamid Cho'lpon",
        role: "Buyuk shoir va adib (Andijon / Farg'ona)"
    },
    {
        text: "Haqiqat egiladi, bukiladi, ammo sinmaydi! Millat ma'rifat bilan yashaydi.",
        author: "Abdurauf Fitrat",
        role: "Olim va dramaturg (Buxoro)"
    }
]

const DEFAULT_FOOTER_LINKS = [
    { id: '1', labelUz: 'Jadidlar Katalogi', labelRu: 'Джадиды', labelEn: 'Jadids Directory', href: '/jadidlar' },
    { id: '2', labelUz: 'Harakat Tarixi', labelRu: 'История движения', labelEn: 'Movement History', href: '/about' },
    { id: '3', labelUz: 'Kutubxona va Asarlar', labelRu: 'Библиотека и Труды', labelEn: 'Library & Works', href: '/resources' },
    { id: '4', labelUz: 'Foto va Hujjatlar', labelRu: 'Фото и Архивы', labelEn: 'Photo Archives', href: '/gallery' },
    { id: '5', labelUz: 'Yangiliklar & Tadbirlar', labelRu: 'Новости и События', labelEn: 'News & Events', href: '/news' },
    { id: '6', labelUz: 'Savol-Javoblar (FAQ)', labelRu: 'FAQ', labelEn: 'FAQ', href: '/faq' },
    { id: '7', labelUz: "Bog'lanish", labelRu: 'Контакты', labelEn: 'Contact', href: '/contact' },
]

export default function AdminSettingsPage() {
    const router = useRouter()
    const locale = useLocale()

    const [settings, setSettings] = useState<SiteSetting>({})
    const [heroQuotes, setHeroQuotes] = useState<Array<{ text: string; author: string; role: string }>>(DEFAULT_HERO_QUOTES)
    const [footerLinks, setFooterLinks] = useState<Array<{ id: string; labelUz: string; labelRu?: string; labelEn?: string; href: string }>>(DEFAULT_FOOTER_LINKS)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [translating, setTranslating] = useState(false)
    const [translateSuccess, setTranslateSuccess] = useState('')
    const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')
    const [activeTab, setActiveTab] = useState<'contact' | 'social' | 'hero' | 'quotes' | 'footer'>('contact')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleAutoTranslate = async () => {
        setTranslating(true)
        setError('')
        setTranslateSuccess('')

        try {
            const fieldsToTranslate: Record<string, string> = {
                museumName: settings.museumNameUz || '',
                address: settings.addressUz || '',
                workingHours: settings.workingHoursUz || '',
                heroTitle: settings.heroTitleUz || '',
                heroSubtitle: settings.heroSubtitleUz || '',
                quoteText: settings.quoteTextUz || '',
                footerTagline: settings.footerTaglineUz || '',
                footerCopyright: settings.footerCopyrightUz || '',
            }

            // Also translate link labels that have labelUz
            footerLinks.forEach((link, idx) => {
                if (link.labelUz) {
                    fieldsToTranslate[`link_${idx}`] = link.labelUz
                }
            })

            const res = await translateBatch(fieldsToTranslate, ['ru', 'en'])

            setSettings(prev => ({
                ...prev,
                museumNameRu: res.ru.museumName || prev.museumNameRu,
                museumNameEn: res.en.museumName || prev.museumNameEn,
                addressRu: res.ru.address || prev.addressRu,
                addressEn: res.en.address || prev.addressEn,
                workingHoursRu: res.ru.workingHours || prev.workingHoursRu,
                workingHoursEn: res.en.workingHours || prev.workingHoursEn,
                heroTitleRu: res.ru.heroTitle || prev.heroTitleRu,
                heroTitleEn: res.en.heroTitle || prev.heroTitleEn,
                heroSubtitleRu: res.ru.heroSubtitle || prev.heroSubtitleRu,
                heroSubtitleEn: res.en.heroSubtitle || prev.heroSubtitleEn,
                quoteTextRu: res.ru.quoteText || prev.quoteTextRu,
                quoteTextEn: res.en.quoteText || prev.quoteTextEn,
                footerTaglineRu: res.ru.footerTagline || prev.footerTaglineRu,
                footerTaglineEn: res.en.footerTagline || prev.footerTaglineEn,
                footerCopyrightRu: res.ru.footerCopyright || prev.footerCopyrightRu,
                footerCopyrightEn: res.en.footerCopyright || prev.footerCopyrightEn,
            }))

            setFooterLinks(prev => prev.map((link, idx) => ({
                ...link,
                labelRu: res.ru[`link_${idx}`] || link.labelRu,
                labelEn: res.en[`link_${idx}`] || link.labelEn,
            })))

            setTranslateSuccess("Barcha matnlar va Footer havolalari Rus hamda Ingliz tillariga muvaffaqiyatli tarjima qilindi!")
            setTimeout(() => setTranslateSuccess(''), 7000)
        } catch (err: any) {
            setError("Tarjima qilishda xatolik yuz berdi: " + (err?.message || 'Qayta urinib ko\'ring'))
        } finally {
            setTranslating(false)
        }
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin`)
            return
        }
        settingService.get('uz')
            .then(data => {
                setSettings(data)
                if (data.heroQuotesJson) {
                    try {
                        const parsed = JSON.parse(data.heroQuotesJson)
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setHeroQuotes(parsed)
                        }
                    } catch {}
                }
                if (data.footerLinksJson) {
                    try {
                        const parsedLinks = JSON.parse(data.footerLinksJson)
                        if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
                            setFooterLinks(parsedLinks)
                        }
                    } catch {}
                }
            })
            .catch(() => setError("Sozlamalarni yuklab bo'lmadi"))
            .finally(() => setLoading(false))
    }, [router, locale])

    const handleAddQuote = () => {
        setHeroQuotes(prev => [
            ...prev,
            { text: '', author: '', role: '' }
        ])
    }

    const handleUpdateQuote = (index: number, field: 'text' | 'author' | 'role', val: string) => {
        setHeroQuotes(prev => prev.map((q, idx) => idx === index ? { ...q, [field]: val } : q))
    }

    const handleRemoveQuote = (index: number) => {
        setHeroQuotes(prev => prev.filter((_, idx) => idx !== index))
    }

    // Footer Links Management
    const handleAddFooterLink = () => {
        setFooterLinks(prev => [
            ...prev,
            { id: Date.now().toString(), labelUz: '', labelRu: '', labelEn: '', href: '/' }
        ])
    }

    const handleUpdateFooterLink = (index: number, field: 'labelUz' | 'labelRu' | 'labelEn' | 'href', val: string) => {
        setFooterLinks(prev => prev.map((l, idx) => idx === index ? { ...l, [field]: val } : l))
    }

    const handleRemoveFooterLink = (index: number) => {
        setFooterLinks(prev => prev.filter((_, idx) => idx !== index))
    }

    const handleMoveFooterLink = (index: number, direction: 'up' | 'down') => {
        setFooterLinks(prev => {
            const next = [...prev]
            const targetIdx = direction === 'up' ? index - 1 : index + 1
            if (targetIdx < 0 || targetIdx >= next.length) return prev
            const temp = next[index]
            next[index] = next[targetIdx]
            next[targetIdx] = temp
            return next
        })
    }

    const handleResetDefaultFooterLinks = () => {
        if (confirm("Footer havolalarini standart holatiga qaytarishni tasdiqlaysizmi?")) {
            setFooterLinks(DEFAULT_FOOTER_LINKS)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')
        setError('')
        try {
            const payload: SiteSetting = {
                ...settings,
                heroQuotesJson: JSON.stringify(heroQuotes),
                footerLinksJson: JSON.stringify(footerLinks)
            }
            const res = await settingService.update(payload)
            setSettings(res)
            setMessage("Sayt sozlamalari, Footer va hikmatlar karuseli muvaffaqiyatli saqlandi!")
            setTimeout(() => setMessage(''), 4000)
        } catch (err: any) {
            setError(err?.message || "Saqlashda xatolik yuz berdi")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
            <header style={{ background: 'var(--bg-header)', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href={`/${locale}/admin/dashboard`} style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)', fontSize: '13px', textDecoration: 'none' }}>← Dashboard</Link>
                    <div style={{ color: 'rgba(255,255,255,0.2)' }}>|</div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: '#fff', fontWeight: '600' }}>Sayt Sozlamalari & Kontenti</span>
                </div>
                <button onClick={() => { removeToken(); router.push(`/${locale}/admin`) }} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', cursor: 'pointer' }}>
                    Chiqish
                </button>
            </header>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '26px', color: 'var(--text-heading)', marginBottom: '6px' }}>Sayt Sozlamalari & Matnlari</h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Muzey kontaktlari, ijtimoiy tarmoqlar, Footer va bosh sahifa matnlarini boshqaring</p>
                </div>

                {message && (
                    <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#22c55e', fontSize: '14px' }}>
                        ✓ {message}
                    </div>
                )}

                {translateSuccess && (
                    <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#22c55e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>✓</span>
                        <span>{translateSuccess}</span>
                    </div>
                )}

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#ef4444', fontSize: '14px' }}>
                        ⚠ {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Yuklanmoqda...</div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', boxShadow: 'var(--shadow-md)' }}>
                        {/* Section tabs & Auto-Translate Action */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button type="button" onClick={() => setActiveTab('contact')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'contact' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'contact' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                    📞 Kontakt & Ish vaqti
                                </button>
                                <button type="button" onClick={() => setActiveTab('social')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'social' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'social' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                    🌐 Ijtimoiy tarmoqlar
                                </button>
                                <button type="button" onClick={() => setActiveTab('footer')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'footer' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'footer' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                    🦶 Footer Boshqaruvi
                                </button>
                                <button type="button" onClick={() => setActiveTab('hero')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'hero' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'hero' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                    🏛 Bosh sahifa matnlari
                                </button>
                                <button type="button" onClick={() => setActiveTab('quotes')} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'quotes' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'quotes' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                    💬 Hikmatlar karuseli ({heroQuotes.length} ta)
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={translating}
                                style={{
                                    padding: '9px 18px',
                                    background: 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.1) 100%)',
                                    border: '1px solid rgba(201,168,76,0.4)',
                                    color: 'var(--gold)',
                                    borderRadius: '8px',
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: translating ? 'not-allowed' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {translating ? (
                                    <>
                                        <span style={{ width: '14px', height: '14px', border: '2px solid rgba(201,168,76,0.3)', borderTop: '2px solid var(--gold)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                        Tarjima qilinmoqda...
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        <span>Barcha matnlarni Rus va Ingliz tiliga tarjima qilish</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* TAB 1: Contact & Address */}
                        {activeTab === 'contact' && (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={labelStyle}>Telefon raqami</label>
                                        <input type="text" value={settings.phone || ''} onChange={e => setSettings({ ...settings, phone: e.target.value })} style={inputStyle} placeholder="+998 71 200 00 00" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Email manzili</label>
                                        <input type="email" value={settings.email || ''} onChange={e => setSettings({ ...settings, email: e.target.value })} style={inputStyle} placeholder="info@avloniy-muzey.uz" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Telegram username / bot</label>
                                        <input type="text" value={settings.telegram || ''} onChange={e => setSettings({ ...settings, telegram: e.target.value })} style={inputStyle} placeholder="@avloniy_muzey" />
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginBottom: '20px' }}>
                                    <h3 style={{ fontSize: '15px', color: 'var(--gold)', marginBottom: '16px' }}>📍 Muzey manzili (3 tilda)</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                                        <div>
                                            <label style={labelStyle}>🇺🇿 Manzil (O'zbekcha)</label>
                                            <input type="text" value={settings.addressUz || ''} onChange={e => setSettings({ ...settings, addressUz: e.target.value })} style={inputStyle} placeholder="Toshkent shahri, Yunusobod tumani..." />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>🇷🇺 Manzil (Русский)</label>
                                            <input type="text" value={settings.addressRu || ''} onChange={e => setSettings({ ...settings, addressRu: e.target.value })} style={inputStyle} placeholder="г. Ташкент, Юнусабадский район..." />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>🇬🇧 Manzil (English)</label>
                                            <input type="text" value={settings.addressEn || ''} onChange={e => setSettings({ ...settings, addressEn: e.target.value })} style={inputStyle} placeholder="34, Abdulla Avloniy Street..." />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                                    <h3 style={{ fontSize: '15px', color: 'var(--gold)', marginBottom: '16px' }}>⏰ Ish vaqtlari (3 tilda)</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                                        <div>
                                            <label style={labelStyle}>🇺🇿 Ish vaqtlari (O'zbekcha)</label>
                                            <input type="text" value={settings.workingHoursUz || ''} onChange={e => setSettings({ ...settings, workingHoursUz: e.target.value })} style={inputStyle} placeholder="Dush-Shan: 09:00 - 18:00 | Yak: 10:00 - 16:00" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>🇷🇺 Ish vaqtlari (Русский)</label>
                                            <input type="text" value={settings.workingHoursRu || ''} onChange={e => setSettings({ ...settings, workingHoursRu: e.target.value })} style={inputStyle} placeholder="Пн-Сб: 09:00 - 18:00 | Вс: 10:00 - 16:00" />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>🇬🇧 Ish vaqtlari (English)</label>
                                            <input type="text" value={settings.workingHoursEn || ''} onChange={e => setSettings({ ...settings, workingHoursEn: e.target.value })} style={inputStyle} placeholder="Mon-Sat: 09:00 - 18:00 | Sun: 10:00 - 16:00" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: Social Media Links */}
                        {activeTab === 'social' && (
                            <div>
                                <h3 style={{ fontSize: '15px', color: 'var(--gold)', marginBottom: '16px' }}>Rasmiy ijtimoiy tarmoq havolalari</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Telegram kanal URL</label>
                                        <input type="url" value={settings.telegramUrl || ''} onChange={e => setSettings({ ...settings, telegramUrl: e.target.value })} style={inputStyle} placeholder="https://t.me/avloniy_muzey" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Instagram sahifa URL</label>
                                        <input type="url" value={settings.instagramUrl || ''} onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })} style={inputStyle} placeholder="https://instagram.com/avloniy_muzey" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>YouTube kanal URL</label>
                                        <input type="url" value={settings.youtubeUrl || ''} onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })} style={inputStyle} placeholder="https://youtube.com/@avloniy_muzey" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Facebook sahifa URL</label>
                                        <input type="url" value={settings.facebookUrl || ''} onChange={e => setSettings({ ...settings, facebookUrl: e.target.value })} style={inputStyle} placeholder="https://facebook.com/avloniy_muzey" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: Footer Management */}
                        {activeTab === 'footer' && (
                            <div>
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{ fontSize: '16px', color: 'var(--gold)', marginBottom: '4px' }}>🦶 Footer (Sayt pastki qismi) Boshqaruvi</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Footer matnlari, mualliflik huquqi va navigatsiya havolalarini qo'shing, tahrirlang yoki o'chiring</p>
                                </div>

                                {/* Language Selector for Footer Texts */}
                                <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '28px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                                        <h4 style={{ fontSize: '14px', color: 'var(--text-heading)', fontWeight: '600' }}>📝 Footer Tavsifi va Copyright (3 tilda)</h4>
                                        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-card)', padding: '4px', borderRadius: '8px' }}>
                                            {LANGS.map(l => (
                                                <button
                                                    key={l.key}
                                                    type="button"
                                                    onClick={() => setActiveLang(l.key as any)}
                                                    style={{
                                                        padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                                        background: activeLang === l.key ? 'var(--gold)' : 'transparent',
                                                        color: activeLang === l.key ? '#061d15' : 'var(--text-muted)',
                                                        fontWeight: '600', fontSize: '12px'
                                                    }}
                                                >
                                                    {l.flag} {l.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {activeLang === 'uz' && (
                                        <div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>🇺🇿 Footer qisqacha tavsifi (Tagline / Shior)</label>
                                                <textarea
                                                    rows={3}
                                                    value={settings.footerTaglineUz ?? "O'zbekiston jadidlarining hayoti, ilmiy-adabiy merosi, asarlari va tarixiy hujjatlarini jamlagan yagona ma'rifat portali."}
                                                    onChange={e => setSettings({ ...settings, footerTaglineUz: e.target.value })}
                                                    style={{ ...inputStyle, resize: 'vertical' }}
                                                    placeholder="O'zbekiston jadidlarining hayoti, ilmiy-adabiy merosi..."
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>🇺🇿 Footer Copyright (Mualliflik huquqi matni)</label>
                                                <input
                                                    type="text"
                                                    value={settings.footerCopyrightUz ?? "© 2026 O'zbekiston Jadidlari Ma'rifat Portali. Barcha huquqlar himoyalangan."}
                                                    onChange={e => setSettings({ ...settings, footerCopyrightUz: e.target.value })}
                                                    style={inputStyle}
                                                    placeholder="© 2026 O'zbekiston Jadidlari Ma'rifat Portali. Barcha huquqlar himoyalangan."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeLang === 'ru' && (
                                        <div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>🇷🇺 Описание в футере (Русский)</label>
                                                <textarea
                                                    rows={3}
                                                    value={settings.footerTaglineRu ?? "Единый портал узбекского джадидизма: жизнь, наследие, труды и исторические документы узбекских просветителей."}
                                                    onChange={e => setSettings({ ...settings, footerTaglineRu: e.target.value })}
                                                    style={{ ...inputStyle, resize: 'vertical' }}
                                                    placeholder="Единый портал узбекского джадидизма..."
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>🇷🇺 Текст копирайта (Русский)</label>
                                                <input
                                                    type="text"
                                                    value={settings.footerCopyrightRu ?? "© 2026 Просветительский портал «Джадиды Узбекистана». Все права защищены."}
                                                    onChange={e => setSettings({ ...settings, footerCopyrightRu: e.target.value })}
                                                    style={inputStyle}
                                                    placeholder="© 2026 Просветительский портал..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeLang === 'en' && (
                                        <div>
                                            <div style={{ marginBottom: '16px' }}>
                                                <label style={labelStyle}>🇬🇧 Footer Tagline (English)</label>
                                                <textarea
                                                    rows={3}
                                                    value={settings.footerTaglineEn ?? "The unified portal of Uzbek Jadidism: life, heritage, works, and historical records of Uzbek enlighteners."}
                                                    onChange={e => setSettings({ ...settings, footerTaglineEn: e.target.value })}
                                                    style={{ ...inputStyle, resize: 'vertical' }}
                                                    placeholder="The unified portal of Uzbek Jadidism..."
                                                />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>🇬🇧 Footer Copyright (English)</label>
                                                <input
                                                    type="text"
                                                    value={settings.footerCopyrightEn ?? "© 2026 Uzbek Jadids Enlightenment Portal. All rights reserved."}
                                                    onChange={e => setSettings({ ...settings, footerCopyrightEn: e.target.value })}
                                                    style={inputStyle}
                                                    placeholder="© 2026 Uzbek Jadids Enlightenment Portal..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Links Management */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '15px', color: 'var(--gold)', fontWeight: '600', marginBottom: '2px' }}>🔗 Footer Navigatsiya Havolalari ({footerLinks.length} ta)</h4>
                                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Footerda chiquvchi bo'limlar ro'yxati (yangi havola qo'shishingiz, tartibini o'zgartirishingiz yoki o'chirishingiz mumkin)</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={handleResetDefaultFooterLinks}
                                                style={{
                                                    padding: '7px 14px',
                                                    background: 'rgba(255,255,255,0.06)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--text-muted)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                🔄 Standart holat
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleAddFooterLink}
                                                style={{
                                                    padding: '7px 16px',
                                                    background: 'rgba(201,168,76,0.15)',
                                                    border: '1px solid var(--gold)',
                                                    color: 'var(--gold)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '700'
                                                }}
                                            >
                                                + Yangi havola qo'shish
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        {footerLinks.map((link, idx) => (
                                            <div key={link.id || idx} style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', fontWeight: '700', background: 'rgba(201,168,76,0.12)', padding: '2px 8px', borderRadius: '6px' }}>#{idx + 1}</span>
                                                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-heading)' }}>{link.labelUz || 'Yangi havola'}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <button
                                                            type="button"
                                                            disabled={idx === 0}
                                                            onClick={() => handleMoveFooterLink(idx, 'up')}
                                                            style={{ padding: '4px 8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? 'var(--text-muted)' : 'var(--text-heading)', fontSize: '11px' }}
                                                            title="Yuqoriga surish"
                                                        >
                                                            ↑
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={idx === footerLinks.length - 1}
                                                            onClick={() => handleMoveFooterLink(idx, 'down')}
                                                            style={{ padding: '4px 8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: idx === footerLinks.length - 1 ? 'not-allowed' : 'pointer', color: idx === footerLinks.length - 1 ? 'var(--text-muted)' : 'var(--text-heading)', fontSize: '11px' }}
                                                            title="Pastga surish"
                                                        >
                                                            ↓
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFooterLink(idx)}
                                                            style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                                                        >
                                                            O'chirish ✕
                                                        </button>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                                    <div>
                                                        <label style={labelStyle}>🇺🇿 Havola nomi (O'zbekcha) *</label>
                                                        <input
                                                            type="text"
                                                            value={link.labelUz}
                                                            onChange={e => handleUpdateFooterLink(idx, 'labelUz', e.target.value)}
                                                            style={inputStyle}
                                                            placeholder="Jadidlar Katalogi"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={labelStyle}>🇷🇺 Havola nomi (Русский)</label>
                                                        <input
                                                            type="text"
                                                            value={link.labelRu || ''}
                                                            onChange={e => handleUpdateFooterLink(idx, 'labelRu', e.target.value)}
                                                            style={inputStyle}
                                                            placeholder="Джадиды"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={labelStyle}>🇬🇧 Havola nomi (English)</label>
                                                        <input
                                                            type="text"
                                                            value={link.labelEn || ''}
                                                            onChange={e => handleUpdateFooterLink(idx, 'labelEn', e.target.value)}
                                                            style={inputStyle}
                                                            placeholder="Jadids Directory"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={labelStyle}>🔗 Manzil / URL (href) *</label>
                                                        <input
                                                            type="text"
                                                            value={link.href}
                                                            onChange={e => handleUpdateFooterLink(idx, 'href', e.target.value)}
                                                            style={inputStyle}
                                                            placeholder="/jadidlar yoki https://..."
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: Hero Texts */}
                        {activeTab === 'hero' && (
                            <div>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '8px', width: 'fit-content' }}>
                                    {LANGS.map(l => (
                                        <button
                                            key={l.key}
                                            type="button"
                                            onClick={() => setActiveLang(l.key as any)}
                                            style={{
                                                padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                                background: activeLang === l.key ? 'var(--gold)' : 'transparent',
                                                color: activeLang === l.key ? '#061d15' : 'var(--text-muted)',
                                                fontWeight: '600', fontSize: '12px'
                                            }}
                                        >
                                            {l.flag} {l.label}
                                        </button>
                                    ))}
                                </div>

                                {activeLang === 'uz' && (
                                    <>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Muzey rasmiy nomi (O'zbekcha)</label>
                                            <input type="text" value={settings.museumNameUz || ''} onChange={e => setSettings({ ...settings, museumNameUz: e.target.value })} style={inputStyle} placeholder="Abdulla Avloniy Memorial Muzeyi" />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Bosh sahifa asosiy sarlavhasi (O'zbekcha)</label>
                                            <input type="text" value={settings.heroTitleUz || ''} onChange={e => setSettings({ ...settings, heroTitleUz: e.target.value })} style={inputStyle} placeholder="O'zbekiston Jadidlari & Abdulla Avloniy Merosi" />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Bosh sahifa qisqacha tavsifi (O'zbekcha)</label>
                                            <textarea rows={3} value={settings.heroSubtitleUz || ''} onChange={e => setSettings({ ...settings, heroSubtitleUz: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Milliy ma'rifatparvarlik harakati..." />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Avloniyning bosh sahifadagi shiori (O'zbekcha)</label>
                                            <textarea rows={2} value={settings.quoteTextUz || ''} onChange={e => setSettings({ ...settings, quoteTextUz: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tarbiya biz uchun yo hayot — yo mamot..." />
                                        </div>
                                    </>
                                )}

                                {activeLang === 'ru' && (
                                    <>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Название музея (Русский)</label>
                                            <input type="text" value={settings.museumNameRu || ''} onChange={e => setSettings({ ...settings, museumNameRu: e.target.value })} style={inputStyle} placeholder="Мемориальный Музей Абдуллы Авлония" />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Главный заголовок (Русский)</label>
                                            <input type="text" value={settings.heroTitleRu || ''} onChange={e => setSettings({ ...settings, heroTitleRu: e.target.value })} style={inputStyle} placeholder="Узбекские Джадиды и Наследие Абдуллы Авлония" />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Подзаголовок (Русский)</label>
                                            <textarea rows={3} value={settings.heroSubtitleRu || ''} onChange={e => setSettings({ ...settings, heroSubtitleRu: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Единый интерактивный портал..." />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Цитата Авлония (Русский)</label>
                                            <textarea rows={2} value={settings.quoteTextRu || ''} onChange={e => setSettings({ ...settings, quoteTextRu: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Воспитание для нас — вопрос жизни или смерти..." />
                                        </div>
                                    </>
                                )}

                                {activeLang === 'en' && (
                                    <>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Museum Name (English)</label>
                                            <input type="text" value={settings.museumNameEn || ''} onChange={e => setSettings({ ...settings, museumNameEn: e.target.value })} style={inputStyle} placeholder="Abdulla Avloniy Memorial Museum" />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Hero Main Title (English)</label>
                                            <input type="text" value={settings.heroTitleEn || ''} onChange={e => setSettings({ ...settings, heroTitleEn: e.target.value })} style={inputStyle} placeholder="Uzbek Jadids & The Heritage of Abdulla Avloniy" />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Hero Subtitle (English)</label>
                                            <textarea rows={3} value={settings.heroSubtitleEn || ''} onChange={e => setSettings({ ...settings, heroSubtitleEn: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Comprehensive interactive portal..." />
                                        </div>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={labelStyle}>Avloniy's Quote (English)</label>
                                            <textarea rows={2} value={settings.quoteTextEn || ''} onChange={e => setSettings({ ...settings, quoteTextEn: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Upbringing for us is a matter of life or death..." />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* TAB 4: Quotes Carousel */}
                        {activeTab === 'quotes' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '16px', color: 'var(--gold)', marginBottom: '4px' }}>💬 Bosh sahifadagi Jadidlar hikmatlari karuseli</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Bosh sahifa yuqori qismida aylanib turuvchi iqtibos va hikmatlar ro'yxati</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddQuote}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(201,168,76,0.15)',
                                            border: '1px solid var(--gold)',
                                            color: 'var(--gold)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        + Yangi hikmat qo'shish
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {heroQuotes.map((q, idx) => (
                                        <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold)', fontWeight: '700' }}>#{idx + 1} - Hikmat</span>
                                                {heroQuotes.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveQuote(idx)}
                                                        style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                                                    >
                                                        O'chirish ✕
                                                    </button>
                                                )}
                                            </div>

                                            <div style={{ marginBottom: '14px' }}>
                                                <label style={labelStyle}>Hikmat / Iqtibos matni *</label>
                                                <textarea
                                                    rows={2}
                                                    value={q.text}
                                                    onChange={e => handleUpdateQuote(idx, 'text', e.target.value)}
                                                    style={{ ...inputStyle, resize: 'vertical' }}
                                                    placeholder="Tarbiya biz uchun yo hayot — yo mamot..."
                                                    required
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                                                <div>
                                                    <label style={labelStyle}>Muallif (Jadid ismi) *</label>
                                                    <input
                                                        type="text"
                                                        value={q.author}
                                                        onChange={e => handleUpdateQuote(idx, 'author', e.target.value)}
                                                        style={inputStyle}
                                                        placeholder="Abdulla Avloniy"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>Muallif unvoni / Shiori / Shahri</label>
                                                    <input
                                                        type="text"
                                                        value={q.role}
                                                        onChange={e => handleUpdateQuote(idx, 'role', e.target.value)}
                                                        style={inputStyle}
                                                        placeholder="Shoir, pedagog va matbuot asoschisi (Toshkent)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" disabled={saving} style={{ padding: '12px 32px', background: saving ? 'rgba(201,168,76,0.5)' : 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer' }}>
                                {saving ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash →'}
                            </button>
                        </div>
                    </form>
                )}
            </main>
        </div>
    )
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-main)',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    outline: 'none',
}
