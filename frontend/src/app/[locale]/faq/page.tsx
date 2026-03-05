'use client'
import { useState } from 'react'

const faqs = [
  {
    category: 'Tashrif',
    items: [
      { q: 'Muzey qayerda joylashgan?', a: 'Muzey Toshkent shahri markazida joylashgan. To\'liq manzil: [Placeholder manzil]. Google Maps orqali yo\'nalish olishingiz mumkin.' },
      { q: 'Muzeyning ish vaqti qanday?', a: 'Muzey Dushanbadan Yakshanba kuni soat 9:00 dan 17:00 gacha ishlaydi. Dam olish kuni: Dushanba.' },
      { q: 'Kirish pullik yoki bepulmi?', a: 'Asosiy zalga kirish bepul. Ba\'zi maxsus ko\'rgazmalar uchun nominal to\'lov olinishi mumkin.' },
      { q: 'Bolalar bilan kelsa bo\'ladimi?', a: 'Albatta! Muzey barcha yoshdagi mehmonga mo\'ljallangan. Maktab ekskursiyalari uchun avvaldan ro\'yxatdan o\'tish tavsiya etiladi.' },
    ]
  },
  {
    category: 'Manbalar',
    items: [
      { q: 'E-kitoblarni yuklab olish bepulmi?', a: 'Ha, saytdagi barcha e-kitoblar va maqolalar bepul yuklab olinadi. Ro\'yxatdan o\'tish shart emas.' },
      { q: 'Audio materiallarni offline tinglab bo\'ladimi?', a: 'Hozircha faqat online tinglash imkoniyati mavjud. Kelajakda yuklab olish funksiyasi qo\'shiladi.' },
    ]
  },
  {
    category: 'Galereya va tadbirlar',
    items: [
      { q: 'Muzeyda ekskursiya o\'tkazish mumkinmi?', a: 'Ha. Guruh ekskursiyalari uchun kamida 3 kun oldin bog\'lanish orqali buyurtma bering.' },
      { q: 'Foto va video suratga olish ruxsatmi?', a: 'Shaxsiy foydalanish uchun foto va video suratga olishga ruxsat beriladi. Tijorat maqsadlarida muzey ma\'muriyatidan ruxsat olish kerak.' },
      { q: 'Muzeyda tadbirlar o\'tkazish mumkinmi?', a: "Ma'ruza, anjuman yoki madaniy tadbirlar uchun muzey zali band qilinishi mumkin. Tafsilotlar uchun bog'laning." },
    ]
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: '1px solid rgba(27,58,107,0.1)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '10px',
      transition: 'box-shadow 0.2s',
      boxShadow: open ? 'var(--shadow-sm)' : 'none',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 24px',
          background: open ? 'var(--navy)' : 'var(--white)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s',
          gap: '16px',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '17px',
          color: open ? '#fff' : 'var(--navy-dark)',
          fontWeight: '600',
          lineHeight: '1.4',
        }}>{q}</span>
        <span style={{
          color: open ? 'var(--gold)' : 'var(--navy)',
          fontSize: '20px',
          flexShrink: 0,
          transition: 'transform 0.3s',
          transform: open ? 'rotate(45deg)' : 'rotate(0)',
          fontWeight: '300',
        }}>+</span>
      </button>
      {open && (
        <div style={{
          padding: '20px 24px',
          background: 'rgba(248,246,240,0.8)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          fontSize: '16px',
          color: 'var(--gray-600)',
          lineHeight: '1.8',
          animation: 'fadeIn 0.2s ease',
        }}>{a}</div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <>
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="label">Savollar</div>
          <h1>Ko'p <span>So'raladigan</span> Savollar</h1>
          <p>Muzey haqida tez-tez beriladigan savollarga javoblar.</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>

          {faqs.map((group, gi) => (
            <div key={gi} style={{ marginBottom: '48px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
              }}>
                <div style={{ width: '4px', height: '24px', background: 'var(--gold)', borderRadius: '2px' }} />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--navy-dark)' }}>{group.category}</h2>
              </div>
              {group.items.map((item, ii) => (
                <AccordionItem key={ii} q={item.q} a={item.a} />
              ))}
            </div>
          ))}

          {/* CTA */}
          <div style={{
            background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            marginTop: '48px',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '22px', marginBottom: '12px' }}>
              Javob topa olmadingizmi?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '24px', fontSize: '16px' }}>
              Savolingizni bizga to'g'ridan-to'g'ri yuboring, tez orada javob beramiz.
            </p>
            <a href="/contact" className="btn-primary">
              Bog'lanish →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
