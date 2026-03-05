import Link from 'next/link'

const timeline = [
  { year: '1878', title: "Tug'ildi", desc: "Toshkent shahrida tavallud topdi." },
  { year: '1904', title: "Maktab ocha boshladi", desc: "Yangi usul maktablarini tashkil etdi." },
  { year: '1907', title: "\"Adib\" asari", desc: "Birinchi o'quv qo'llanmasini yozdi." },
  { year: '1913', title: "Sahna asarlari", desc: "Dramaturgiya sohasida faol ijod qildi." },
  { year: '1917', title: "Jadidchilik", desc: "Ma'rifat harakatining faol ishtirokchisi bo'ldi." },
  { year: '1934', title: "Vafot etdi", desc: "Toshkentda hayotdan ko'z yumdi." },
]

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="label">Muzey Haqida</div>
          <h1>Tariх va <span>Ma'lumot</span></h1>
          <p>Abdulla Avloniy muzeyi, uning hayoti va Toshkentdagi muhim o'rni haqida.</p>
        </div>
      </div>

      {/* Muzey Haqida */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Muzey tarixi</div>
              <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Muzey <span style={{ color: 'var(--gold)' }}>Haqida</span></h2>
              <div className="gold-divider" />
              <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.9', marginTop: '16px', marginBottom: '16px' }}>
                Abdulla Avloniy muzeyi 1934-yilda tashkil etilgan bo'lib, buyuk ma'rifatparvarning hayoti, ijodi va pedagogik faoliyatiga bag'ishlangan. Muzey fondida 500 dan ortiq eksponat saqlanadi.
              </p>
              <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.9', marginBottom: '24px' }}>
                Muzey milliy ma'naviy merosni saqlash va kelajak avlodlarga yetkazish maqsadida faoliyat ko'rsatib kelmoqda.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Ish vaqti', value: 'Du–Yak: 9:00–17:00' },
                  { label: 'Kirish narxi', value: 'Bepul' },
                  { label: 'Telefon', value: '+998 (71) 000-00-00' },
                  { label: 'Manzil', value: 'Toshkent shahri' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '16px',
                    background: 'var(--white)',
                    borderRadius: '10px',
                    border: '1px solid rgba(27,58,107,0.08)',
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px', marginBottom: '6px' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--navy-dark)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
              borderRadius: '16px',
              height: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '64px',
              boxShadow: 'var(--shadow-lg)',
            }}>🏛️</div>
          </div>
        </div>
      </section>

      {/* Avloniy Biografiyasi */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Shaxsiyat</div>
            <h2 style={{ fontSize: '36px' }}>Abdulla <span style={{ color: 'var(--gold)' }}>Avloniy</span> Kim?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '64px', alignItems: 'start' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
              borderRadius: '16px',
              height: '380px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '64px',
              position: 'sticky',
              top: '100px',
            }}>👤</div>

            <div>
              {[
                { title: "Hayoti", text: "Abdulla Avloniy 1878-yil Toshkent shahrida tug'ilgan. U kambag'al hunarmand oilasida o'sib-ulg'aydi. Bolaligidanoq ilmga qiziqish bildirdi va o'zi mustaqil ta'lim oldi." },
                { title: "Ma'rifatchilik faoliyati", text: "Avloniy yangi usul maktablarini tashkil etishda faol ishtirok etdi. U zamonaviy ta'lim usullarini joriy qilish, darsliklar yaratish va bolalar tarbiyasida yangi yo'nalishlar ocha boshladi." },
                { title: "Adabiy merosi", text: "U yuzdan ortiq she'r, dramatik asar va maqolalar muallifi. Uning asarlari orasida \"Turkiy Guliston yoxud axloq\", \"Adib\" va ko'plab sahna asarlari alohida ahamiyatga ega." },
                { title: "Jurnalistik faoliyati", text: "Avloniy \"Shuhrat\" va \"Osiyo\" gazetalarini tahrir qildi. Matbuot orqali xalqni ma'rifatga chorladi, zulm va jaholatga qarshi kurashdi." },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '32px', paddingLeft: '24px', borderLeft: '3px solid var(--gold)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--navy-dark)', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.9' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Hayot yo'li</div>
            <h2 style={{ fontSize: '36px' }}>Muhim <span style={{ color: 'var(--gold)' }}>Sanalar</span></h2>
          </div>

          <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
            {/* Center line */}
            <div style={{
              position: 'absolute',
              left: '79px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, var(--gold), rgba(201,168,76,0.1))',
            }} />

            {timeline.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '32px', marginBottom: '36px', alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: '64px',
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--gold)',
                  textAlign: 'right',
                  paddingTop: '12px',
                }}>{item.year}</div>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  border: '3px solid var(--off-white)',
                  flexShrink: 0,
                  marginTop: '14px',
                  zIndex: 1,
                }} />
                <div style={{
                  flex: 1,
                  background: 'var(--white)',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(27,58,107,0.06)',
                }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--navy-dark)', marginBottom: '6px' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
