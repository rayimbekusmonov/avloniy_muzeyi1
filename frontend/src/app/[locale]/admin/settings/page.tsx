'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { isAuthenticated, removeToken, SiteSetting } from '@/lib/api'
import { settingService } from '@/lib/services'

const LANGS = [
    { key: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { key: 'ru', label: 'Русский', flag: '🇷🇺' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
]

export default function AdminSettingsPage() {
    const router = useRouter()
    const locale = useLocale()

    const [settings, setSettings] = useState<SiteSetting>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')
    const [activeTab, setActiveTab] = useState<'contact' | 'social' | 'stats' | 'hero'>('contact')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push(`/${locale}/admin`)
            return
        }
        settingService.get('uz')
            .then(data => setSettings(data))
            .catch(() => setError("Sozlamalarni yuklab bo'lmadi"))
            .finally(() => setLoading(false))
    }, [router, locale])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage('')
        setError('')
        try {
            const res = await settingService.update(settings)
            setSettings(res)
            setMessage("Sayt sozlamalari muvaffaqiyatli saqlandi!")
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
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Muzey kontaktlari, ijtimoiy tarmoqlar, statistika ko'rsatkichlari va bosh sahifa matnlarini boshqaring</p>
                </div>

                {message && (
                    <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', color: '#22c55e', fontSize: '14px' }}>
                        ✓ {message}
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
                        {/* Section tabs */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                            <button type="button" onClick={() => setActiveTab('contact')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'contact' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'contact' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                📞 Kontakt & Ish vaqti
                            </button>
                            <button type="button" onClick={() => setActiveTab('social')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'social' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'social' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                🌐 Ijtimoiy Tarmoqlar
                            </button>
                            <button type="button" onClick={() => setActiveTab('stats')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'stats' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'stats' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                📊 Statistika Sonlari
                            </button>
                            <button type="button" onClick={() => setActiveTab('hero')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: activeTab === 'hero' ? 'var(--gold)' : 'var(--bg-secondary)', color: activeTab === 'hero' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px' }}>
                                🏛 Bosh Sahifa Matnlari
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

                        {/* TAB 3: Statistics Counters */}
                        {activeTab === 'stats' && (
                            <div>
                                <h3 style={{ fontSize: '15px', color: 'var(--gold)', marginBottom: '16px' }}>Bosh sahifadagi statistika ko'rsatkichlari (Counters)</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Sayt bosh sahifasida chiqadigan raqamlar (masalan: 150+, 50+, 1 000+)</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    <div>
                                        <label style={labelStyle}>Eksponatlar soni</label>
                                        <input type="text" value={settings.statsExhibits || ''} onChange={e => setSettings({ ...settings, statsExhibits: e.target.value })} style={inputStyle} placeholder="150+" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Jadid namoyandalari</label>
                                        <input type="text" value={settings.statsFigures || ''} onChange={e => setSettings({ ...settings, statsFigures: e.target.value })} style={inputStyle} placeholder="50+" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>E-kitob va manbalar</label>
                                        <input type="text" value={settings.statsResources || ''} onChange={e => setSettings({ ...settings, statsResources: e.target.value })} style={inputStyle} placeholder="1 000+" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Foto & Hujjatlar arxivi</label>
                                        <input type="text" value={settings.statsPhotos || ''} onChange={e => setSettings({ ...settings, statsPhotos: e.target.value })} style={inputStyle} placeholder="500+" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: Hero Texts */}
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
