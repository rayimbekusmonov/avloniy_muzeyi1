'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLocale } from 'next-intl'
import { faqService } from '@/lib/services'
import { FaqItem } from '@/lib/api'

const Icons = {
    MessageCircle: () => (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
    ),
    HelpCircle: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    ),
}

function AccordionItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false)
    return (
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px', boxShadow: open ? 'var(--shadow-sm)' : 'none' }}>
            <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: open ? 'var(--gold-pale)' : 'var(--bg-card)', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s', gap: '16px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: open ? '#C9A84C' : 'var(--text-heading)', fontWeight: '600', lineHeight: '1.4' }}>{q}</span>
                <span style={{ color: '#C9A84C', fontSize: '22px', flexShrink: 0, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'none', fontWeight: '300', lineHeight: 1 }}>+</span>
            </button>
            {open && (
                <div style={{ padding: '20px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', fontSize: '16px', color: 'var(--text-main)', lineHeight: '1.8' }}>{a}</div>
            )}
        </div>
    )
}

const FALLBACK_FAQS_UZ = [
    { category: 'Tashrif', items: [
        { q: "Muzey qayerda joylashgan?", a: "Muzey Toshkent shahri, Yunusobod tumani, Abdulla Avloniy ko'chasi, 34-uyda joylashgan." },
        { q: "Muzeyning ish vaqti qanday?", a: "Muzey Dushanbadan Shanbagacha soat 9:00 dan 18:00 gacha, Yakshanba kuni 10:00 dan 16:00 gacha ochiq." },
        { q: "Kirish pullik yoki bepulmi?", a: "Asosiy zalga kirish bepul. Ba'zi maxsus ko'rgazmalar uchun nominal to'lov olinishi mumkin." },
        { q: "Bolalar bilan kelsa bo'ladimi?", a: "Albatta! Muzey barcha yoshdagi mehmonga mo'ljallangan. Maktab ekskursiyalari uchun avvaldan ro'yxatdan o'tish tavsiya etiladi." },
    ]},
    { category: 'Manbalar', items: [
        { q: "E-kitoblarni yuklab olish bepulmi?", a: "Ha, saytdagi barcha e-kitoblar va maqolalar bepul yuklab olinadi." },
        { q: "Audio materiallarni offline tinglab bo'ladimi?", a: "Hozircha faqat online tinglash imkoniyati mavjud. Kelajakda yuklab olish funksiyasi qo'shiladi." },
    ]},
    { category: 'Galereya va tadbirlar', items: [
        { q: "Muzeyda ekskursiya o'tkazish mumkinmi?", a: "Ha. Guruh ekskursiyalari uchun kamida 3 kun oldin bog'lanish orqali buyurtma bering." },
        { q: "Foto va video suratga olish ruxsatmi?", a: "Shaxsiy foydalanish uchun ruxsat beriladi. Tijorat maqsadlarida muzey ma'muriyatidan ruxsat olish kerak." },
    ]},
]

export default function FAQPage() {
    const locale = useLocale()
    const [faqList, setFaqList] = useState<FaqItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        faqService.getAll(locale)
            .then(data => {
                if (data && data.length > 0) {
                    setFaqList(data)
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [locale])

    const groupedFaqs = useMemo(() => {
        if (faqList.length === 0) {
            return FALLBACK_FAQS_UZ
        }

        const groups: { [key: string]: { q: string; a: string }[] } = {}
        faqList.forEach(item => {
            const cat = item.category || (locale === 'ru' ? 'Общие' : locale === 'en' ? 'General' : 'Umumiy')
            if (!groups[cat]) groups[cat] = []
            groups[cat].push({
                q: item.question || item.questionUz,
                a: item.answer || item.answerUz,
            })
        })

        return Object.keys(groups).map(category => ({
            category,
            items: groups[category],
        }))
    }, [faqList, locale])

    const t = {
        label: locale === 'ru' ? 'Вопросы' : locale === 'en' ? 'Questions' : 'Savollar',
        h1a: locale === 'ru' ? 'Часто задаваемые ' : locale === 'en' ? 'Frequently Asked ' : "Ko'p ",
        h1b: locale === 'ru' ? 'вопросы' : locale === 'en' ? 'Questions' : "So'raladigan Savollar",
        desc: locale === 'ru' ? 'Ответы на часто задаваемые вопросы о музее.' : locale === 'en' ? 'Answers to frequently asked questions about the museum.' : 'Muzey haqida tez-tez beriladigan savollarga javoblar.',
        ctaTitle: locale === 'ru' ? 'Не нашли ответ?' : locale === 'en' ? "Didn't find an answer?" : 'Javob topa olmadingizmi?',
        ctaDesc: locale === 'ru' ? 'Отправьте нам свой вопрос напрямую.' : locale === 'en' ? 'Send us your question directly.' : "Savolingizni bizga to'g'ridan-to'g'ri yuboring.",
        ctaBtn: locale === 'ru' ? 'Связаться →' : locale === 'en' ? 'Contact us →' : "Bog'lanish →",
    }

    return (
        <>
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label"><Icons.HelpCircle /> {t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            <section className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>Yuklanmoqda...</div>
                    ) : (
                        groupedFaqs.map((group, gi) => (
                            <div key={gi} style={{ marginBottom: '48px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ width: '4px', height: '24px', background: 'var(--gold)', borderRadius: '2px' }} />
                                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-heading)' }}>{group.category}</h2>
                                </div>
                                {group.items.map((item, ii) => (
                                    <AccordionItem key={ii} q={item.q} a={item.a} />
                                ))}
                            </div>
                        ))
                    )}

                    <div style={{ background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '48px' }}>
                        <div style={{ color: 'rgba(201,168,76,0.7)', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><Icons.MessageCircle /></div>
                        <h3 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '22px', marginBottom: '12px' }}>{t.ctaTitle}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '24px', fontSize: '16px' }}>{t.ctaDesc}</p>
                        <a href={`/${locale}/contact`} className="btn-primary">{t.ctaBtn}</a>
                    </div>
                </div>
            </section>
        </>
    )
}