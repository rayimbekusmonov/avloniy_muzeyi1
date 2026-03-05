'use client'
import { useLocale } from 'next-intl'

export default function AboutPage() {
    const locale = useLocale()

    const timeline = locale === 'ru' ? [
        { year: '1878', title: "Родился", desc: "Родился в Ташкенте." },
        { year: '1904', title: "Открыл школы", desc: "Организовал школы нового метода." },
        { year: '1907', title: '"Адиб"', desc: "Написал первое учебное пособие." },
        { year: '1913', title: "Драматургия", desc: "Активно работал в области драматургии." },
        { year: '1917', title: "Джадидизм", desc: "Стал активным участником просветительского движения." },
        { year: '1934', title: "Скончался", desc: "Скончался в Ташкенте." },
    ] : locale === 'en' ? [
        { year: '1878', title: "Born", desc: "Born in Tashkent." },
        { year: '1904', title: "Opened schools", desc: "Organized new-method schools." },
        { year: '1907', title: '"Adib"', desc: "Wrote the first educational manual." },
        { year: '1913', title: "Dramaturgy", desc: "Actively worked in dramaturgy." },
        { year: '1917', title: "Jadidism", desc: "Became an active participant in the enlightenment movement." },
        { year: '1934', title: "Passed away", desc: "Passed away in Tashkent." },
    ] : [
        { year: '1878', title: "Tug'ildi", desc: "Toshkent shahrida tavallud topdi." },
        { year: '1904', title: "Maktab ocha boshladi", desc: "Yangi usul maktablarini tashkil etdi." },
        { year: '1907', title: '"Adib" asari', desc: "Birinchi o'quv qo'llanmasini yozdi." },
        { year: '1913', title: "Sahna asarlari", desc: "Dramaturgiya sohasida faol ijod qildi." },
        { year: '1917', title: "Jadidchilik", desc: "Ma'rifat harakatining faol ishtirokchisi bo'ldi." },
        { year: '1934', title: "Vafot etdi", desc: "Toshkentda hayotdan ko'z yumdi." },
    ]

    const infoItems = locale === 'ru' ? [
        { label: 'Часы работы', value: 'Пн–Вс: 9:00–17:00' },
        { label: 'Вход', value: 'Бесплатно' },
        { label: 'Телефон', value: '+998 (71) 000-00-00' },
        { label: 'Адрес', value: 'г. Ташкент' },
    ] : locale === 'en' ? [
        { label: 'Working hours', value: 'Mon–Sun: 9:00–17:00' },
        { label: 'Admission', value: 'Free' },
        { label: 'Phone', value: '+998 (71) 000-00-00' },
        { label: 'Address', value: 'Tashkent city' },
    ] : [
        { label: 'Ish vaqti', value: 'Du–Yak: 9:00–17:00' },
        { label: 'Kirish narxi', value: 'Bepul' },
        { label: 'Telefon', value: '+998 (71) 000-00-00' },
        { label: 'Manzil', value: 'Toshkent shahri' },
    ]

    const bioSections = locale === 'ru' ? [
        { title: "Жизнь", text: "Абдулла Авлоний родился в 1878 году в Ташкенте. Рос в семье бедного ремесленника. С детства проявлял интерес к знаниям и самостоятельно учился." },
        { title: "Просветительская деятельность", text: "Авлоний активно участвовал в организации школ нового метода. Внедрял современные методы обучения, создавал учебники и открывал новые направления в воспитании детей." },
        { title: "Литературное наследие", text: "Автор более ста стихотворений, драматических произведений и статей. Среди его работ особое место занимают «Туркий Гулистон ёхуд ахлоқ», «Адиб» и многие сценические произведения." },
        { title: "Журналистская деятельность", text: "Авлоний редактировал газеты «Шухрат» и «Осиё». Через прессу призывал народ к просвещению, боролся против угнетения и невежества." },
    ] : locale === 'en' ? [
        { title: "Life", text: "Abdulla Avloniy was born in 1878 in Tashkent. He grew up in a poor craftsman family. From childhood he showed interest in knowledge and studied independently." },
        { title: "Enlightenment activities", text: "Avloniy actively participated in organizing new-method schools. He introduced modern teaching methods, created textbooks and opened new directions in children's education." },
        { title: "Literary heritage", text: "Author of over a hundred poems, dramatic works and articles. Among his works, 'Turkiy Guliston yokhud Akhlok', 'Adib' and many stage works hold a special place." },
        { title: "Journalistic activities", text: "Avloniy edited the newspapers 'Shuhrat' and 'Osiyo'. Through the press he called people to enlightenment, fought against oppression and ignorance." },
    ] : [
        { title: "Hayoti", text: "Abdulla Avloniy 1878-yil Toshkent shahrida tug'ilgan. U kambag'al hunarmand oilasida o'sib-ulg'aydi. Bolaligidanoq ilmga qiziqish bildirdi va o'zi mustaqil ta'lim oldi." },
        { title: "Ma'rifatchilik faoliyati", text: "Avloniy yangi usul maktablarini tashkil etishda faol ishtirok etdi. U zamonaviy ta'lim usullarini joriy qilish, darsliklar yaratish va bolalar tarbiyasida yangi yo'nalishlar ocha boshladi." },
        { title: "Adabiy merosi", text: "U yuzdan ortiq she'r, dramatik asar va maqolalar muallifi. Uning asarlari orasida \"Turkiy Guliston yoxud axloq\", \"Adib\" va ko'plab sahna asarlari alohida ahamiyatga ega." },
        { title: "Jurnalistik faoliyati", text: "Avloniy \"Shuhrat\" va \"Osiyo\" gazetalarini tahrir qildi. Matbuot orqali xalqni ma'rifatga chorladi, zulm va jaholatga qarshi kurashdi." },
    ]

    const t = {
        label:        locale === 'ru' ? 'О музее'       : locale === 'en' ? 'About Museum'  : 'Muzey Haqida',
        h1a:          locale === 'ru' ? 'История и '    : locale === 'en' ? 'History & '    : 'Tariх va ',
        h1b:          locale === 'ru' ? 'Информация'    : locale === 'en' ? 'Information'   : "Ma'lumot",
        desc:         locale === 'ru' ? 'О музее Абдуллы Авлония, его жизни и важной роли в Ташкенте.' : locale === 'en' ? 'About Abdulla Avloniy museum, his life and important role in Tashkent.' : "Abdulla Avloniy muzeyi, uning hayoti va Toshkentdagi muhim o'rni haqida.",
        museumLabel:  locale === 'ru' ? 'История музея' : locale === 'en' ? 'Museum history' : 'Muzey tarixi',
        museumH2a:    locale === 'ru' ? 'О '            : locale === 'en' ? 'About the '    : 'Muzey ',
        museumH2b:    locale === 'ru' ? 'Музее'         : locale === 'en' ? 'Museum'        : 'Haqida',
        museumDesc1:  locale === 'ru'
            ? 'Музей Абдуллы Авлония был основан в 1934 году и посвящён жизни, творчеству и педагогической деятельности великого просветителя. В фонде музея хранится более 500 экспонатов.'
            : locale === 'en'
                ? 'Abdulla Avloniy Museum was established in 1934 and is dedicated to the life, creative work and pedagogical activities of the great enlightener. The museum holds over 500 exhibits.'
                : "Abdulla Avloniy muzeyi 1934-yilda tashkil etilgan bo'lib, buyuk ma'rifatparvarning hayoti, ijodi va pedagogik faoliyatiga bag'ishlangan. Muzey fondida 500 dan ortiq eksponat saqlanadi.",
        museumDesc2:  locale === 'ru'
            ? 'Музей продолжает работу по сохранению и передаче национального духовного наследия будущим поколениям.'
            : locale === 'en'
                ? 'The museum continues its work to preserve and pass on the national spiritual heritage to future generations.'
                : "Muzey milliy ma'naviy merosni saqlash va kelajak avlodlarga yetkazish maqsadida faoliyat ko'rsatib kelmoqda.",
        personLabel:  locale === 'ru' ? 'Личность'      : locale === 'en' ? 'Personality'   : 'Shaxsiyat',
        personH2c:    locale === 'ru' ? ' — кто он?'    : locale === 'en' ? ' — who is he?' : ' Kim?',
        timelineLabel: locale === 'ru' ? 'Жизненный путь' : locale === 'en' ? "Life's journey" : "Hayot yo'li",
        timelineH2a:  locale === 'ru' ? 'Важные '       : locale === 'en' ? 'Important '    : 'Muhim ',
        timelineH2b:  locale === 'ru' ? 'Даты'          : locale === 'en' ? 'Dates'         : 'Sanalar',
    }

    return (
        <>
            {/* Page Header */}
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label">{t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span></h1>
                    <p>{t.desc}</p>
                </div>
            </div>

            {/* Muzey Haqida */}
            <section className="section" style={{ background: 'var(--off-white)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                                {t.museumLabel}
                            </div>
                            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>
                                {t.museumH2a}<span style={{ color: 'var(--gold)' }}>{t.museumH2b}</span>
                            </h2>
                            <div className="gold-divider" />
                            <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.9', marginTop: '16px', marginBottom: '16px' }}>
                                {t.museumDesc1}
                            </p>
                            <p style={{ fontSize: '16px', color: 'var(--gray-600)', lineHeight: '1.9', marginBottom: '24px' }}>
                                {t.museumDesc2}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {infoItems.map((item, i) => (
                                    <div key={i} style={{ padding: '16px', background: 'var(--white)', borderRadius: '10px', border: '1px solid rgba(27,58,107,0.08)' }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold)', letterSpacing: '1px', marginBottom: '6px' }}>{item.label}</div>
                                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--navy-dark)' }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                            borderRadius: '16px', height: '480px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '64px',
                            boxShadow: 'var(--shadow-lg)',
                        }}>🏛️</div>
                    </div>
                </div>
            </section>

            {/* Biografiya */}
            <section className="section" style={{ background: 'var(--white)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                            {t.personLabel}
                        </div>
                        <h2 style={{ fontSize: '36px' }}>
                            Abdulla <span style={{ color: 'var(--gold)' }}>Avloniy</span>{t.personH2c}
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '64px', alignItems: 'start' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
                            borderRadius: '16px', height: '380px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '64px',
                            position: 'sticky', top: '100px',
                        }}>👤</div>

                        <div>
                            {bioSections.map((item, i) => (
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
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
                            {t.timelineLabel}
                        </div>
                        <h2 style={{ fontSize: '36px' }}>
                            {t.timelineH2a}<span style={{ color: 'var(--gold)' }}>{t.timelineH2b}</span>
                        </h2>
                    </div>

                    <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
                        <div style={{
                            position: 'absolute', left: '79px', top: 0, bottom: 0, width: '2px',
                            background: 'linear-gradient(to bottom, var(--gold), rgba(201,168,76,0.1))',
                        }} />

                        {timeline.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '32px', marginBottom: '36px', alignItems: 'flex-start' }}>
                                <div style={{
                                    minWidth: '64px', fontFamily: 'var(--font-display)', fontSize: '18px',
                                    fontWeight: '700', color: 'var(--gold)', textAlign: 'right', paddingTop: '12px',
                                }}>{item.year}</div>
                                <div style={{
                                    width: '16px', height: '16px', borderRadius: '50%', background: 'var(--gold)',
                                    border: '3px solid var(--off-white)', flexShrink: 0, marginTop: '14px', zIndex: 1,
                                }} />
                                <div style={{
                                    flex: 1, background: 'var(--white)', borderRadius: '12px',
                                    padding: '20px 24px', boxShadow: 'var(--shadow-sm)',
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