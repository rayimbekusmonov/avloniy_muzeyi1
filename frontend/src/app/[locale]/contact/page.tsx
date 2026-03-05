'use client'
import { useState } from 'react'
import { contactService } from '@/lib/services'

export default function ContactPage() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        telegram: '',
        subject: '',
        message: '',
    })
    const [sending, setSending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)
        setError('')
        try {
            await contactService.send(form)
            setSuccess(true)
            setForm({ name: '', phone: '', telegram: '', subject: '', message: '' })
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Xato yuz berdi')
        } finally {
            setSending(false)
        }
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><span>📍</span> Aloqa</div>
                    <h1>Biz bilan <span>Bog'laning</span></h1>
                    <p>Savollaringiz yoki takliflaringiz bo'lsa, bizga yozing</p>
                </div>
            </div>

            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '60px',
                        alignItems: 'start',
                    }}>

                        {/* Contact Info */}
                        <div>
                            <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>
                                Muzey <span style={{ color: 'var(--gold)' }}>ma'lumotlari</span>
                            </h2>
                            <div className="gold-divider" style={{ marginBottom: '32px' }} />

                            {[
                                { icon: '📍', title: 'Manzil', text: "Toshkent shahri, Yunusobod tumani\nAbdulla Avloniy ko'chasi, 34-uy" },
                                { icon: '📞', title: 'Telefon', text: '+998 71 123 45 67' },
                                { icon: '✉️', title: 'Email', text: 'info@avloniy-muzey.uz' },
                                { icon: '🕐', title: 'Ish vaqti', text: "Dushanba – Shanba: 09:00 – 18:00\nYakshanba: 10:00 – 16:00" },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    gap: '16px',
                                    marginBottom: '24px',
                                    padding: '20px',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(27,58,107,0.08)',
                                    boxShadow: 'var(--shadow-sm)',
                                }}>
                                    <div style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</div>
                                    <div>
                                        <div style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '11px',
                                            color: 'var(--gold)',
                                            letterSpacing: '2px',
                                            textTransform: 'uppercase',
                                            marginBottom: '6px',
                                        }}>{item.title}</div>
                                        <div style={{
                                            fontSize: '15px',
                                            color: 'var(--navy-dark)',
                                            lineHeight: '1.7',
                                            whiteSpace: 'pre-line',
                                        }}>{item.text}</div>
                                    </div>
                                </div>
                            ))}

                            {/* Map placeholder */}
                            <div style={{ borderRadius: '12px', overflow: 'hidden', width: '100%' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d636.0895257286825!2d69.21453237652102!3d41.35473189147808!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8c3fa12f11a3%3A0xc849830383f1974d!2sA.AVLONIY%20NOMIDAGI%20PEDAGOGLARNI%20KASBIY%20RIVOJLANTIRISH%20VA%20YANGI%20METODIKALARGA%20O&#39;RGATISH%20MILLIY-TADQIQOT%20INSTITUTI!5e1!3m2!1sru!2s!4v1772104974302!5m2!1sru!2s"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, display: 'block' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                        {/* Form */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '40px',
                            border: '1px solid rgba(27,58,107,0.08)',
                            boxShadow: 'var(--shadow-md)',
                        }}>
                            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
                                Xabar <span style={{ color: 'var(--gold)' }}>yuborish</span>
                            </h2>
                            <div className="gold-divider" style={{ marginBottom: '28px' }} />

                            {success ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                }}>
                                    <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
                                    <h3 style={{ fontSize: '20px', color: 'var(--navy-dark)', marginBottom: '8px' }}>
                                        Xabaringiz yuborildi!
                                    </h3>
                                    <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
                                        Tez orada siz bilan bog'lanamiz.
                                    </p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="btn-primary"
                                        style={{ border: 'none', cursor: 'pointer' }}
                                    >Yana xabar yuborish</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={labelStyle}>Ismingiz *</label>
                                        <input
                                            value={form.name}
                                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                            required
                                            style={inputStyle}
                                            placeholder="To'liq ismingiz"
                                        />
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={labelStyle}>Telefon yoki Telegram * (birini kiriting)</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <input
                                                value={form.phone}
                                                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                                style={inputStyle}
                                                placeholder="+998 90 123 45 67"
                                            />
                                            <input
                                                value={form.telegram}
                                                onChange={e => setForm(p => ({ ...p, telegram: e.target.value }))}
                                                style={inputStyle}
                                                placeholder="@username"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={labelStyle}>Mavzu *</label>
                                        <input
                                            value={form.subject}
                                            onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                                            required
                                            style={inputStyle}
                                            placeholder="Xabar mavzusi"
                                        />
                                    </div>
                                    <div style={{ marginBottom: '28px' }}>
                                        <label style={labelStyle}>Xabar *</label>
                                        <textarea
                                            value={form.message}
                                            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                            required
                                            rows={5}
                                            style={{ ...inputStyle, resize: 'vertical' }}
                                            placeholder="Xabaringizni yozing..."
                                        />
                                    </div>

                                    {error && (
                                        <div style={{
                                            background: 'rgba(220,38,38,0.1)',
                                            border: '1px solid rgba(220,38,38,0.3)',
                                            borderRadius: '8px',
                                            padding: '12px 16px',
                                            color: '#dc2626',
                                            fontSize: '14px',
                                            marginBottom: '20px',
                                        }}>{error}</div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="btn-primary"
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            cursor: sending ? 'not-allowed' : 'pointer',
                                            opacity: sending ? 0.7 : 1,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {sending ? 'Yuborilmoqda...' : 'Xabar yuborish →'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--gray-600)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 16px',
    border: '1px solid rgba(27,58,107,0.2)',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    color: 'var(--navy-dark)',
    outline: 'none',
    background: '#fff',
}