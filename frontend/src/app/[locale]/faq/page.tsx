'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'

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
                }}>{a}</div>
            )}
        </div>
    )
}

export default function FAQPage() {
    const locale = useLocale()

    const faqsUz = [
        {
            category: 'Tashrif',
            items: [
                { q: "Muzey qayerda joylashgan?", a: "Muzey Toshkent shahri, Yunusobod tumani, Abdulla Avloniy ko'chasi, 34-uyda joylashgan. Google Maps orqali yo'nalish olishingiz mumkin." },
                { q: "Muzeyning ish vaqti qanday?", a: "Muzey Dushanbadan Shanbagacha soat 9:00 dan 18:00 gacha, Yakshanba kuni 10:00 dan 16:00 gacha ochiq." },
                { q: "Kirish pullik yoki bepulmi?", a: "Asosiy zalga kirish bepul. Ba'zi maxsus ko'rgazmalar uchun nominal to'lov olinishi mumkin." },
                { q: "Bolalar bilan kelsa bo'ladimi?", a: "Albatta! Muzey barcha yoshdagi mehmonga mo'ljallangan. Maktab ekskursiyalari uchun avvaldan ro'yxatdan o'tish tavsiya etiladi." },
            ]
        },
        {
            category: 'Manbalar',
            items: [
                { q: "E-kitoblarni yuklab olish bepulmi?", a: "Ha, saytdagi barcha e-kitoblar va maqolalar bepul yuklab olinadi. Ro'yxatdan o'tish shart emas." },
                { q: "Audio materiallarni offline tinglab bo'ladimi?", a: "Hozircha faqat online tinglash imkoniyati mavjud. Kelajakda yuklab olish funksiyasi qo'shiladi." },
            ]
        },
        {
            category: 'Galereya va tadbirlar',
            items: [
                { q: "Muzeyda ekskursiya o'tkazish mumkinmi?", a: "Ha. Guruh ekskursiyalari uchun kamida 3 kun oldin bog'lanish orqali buyurtma bering." },
                { q: "Foto va video suratga olish ruxsatmi?", a: "Shaxsiy foydalanish uchun foto va video suratga olishga ruxsat beriladi. Tijorat maqsadlarida muzey ma'muriyatidan ruxsat olish kerak." },
                { q: "Muzeyda tadbirlar o'tkazish mumkinmi?", a: "Ma'ruza, anjuman yoki madaniy tadbirlar uchun muzey zali band qilinishi mumkin. Tafsilotlar uchun bog'laning." },
            ]
        },
    ]

    const faqsRu = [
        {
            category: 'Посещение',
            items: [
                { q: "Где находится музей?", a: "Музей расположен по адресу: г. Ташкент, Юнусабадский район, ул. Абдуллы Авлония, 34. Маршрут можно построить через Google Maps." },
                { q: "Каков режим работы музея?", a: "Музей открыт с понедельника по субботу с 9:00 до 18:00, в воскресенье с 10:00 до 16:00." },
                { q: "Вход платный или бесплатный?", a: "Вход в основной зал бесплатный. На некоторые специальные выставки может взиматься символическая плата." },
                { q: "Можно ли прийти с детьми?", a: "Конечно! Музей рассчитан на посетителей всех возрастов. Для школьных экскурсий рекомендуется предварительная запись." },
            ]
        },
        {
            category: 'Ресурсы',
            items: [
                { q: "Скачивание электронных книг бесплатное?", a: "Да, все электронные книги и статьи на сайте скачиваются бесплатно. Регистрация не требуется." },
                { q: "Можно ли слушать аудиоматериалы офлайн?", a: "Пока доступно только онлайн-прослушивание. Функция загрузки будет добавлена в будущем." },
            ]
        },
        {
            category: 'Галерея и мероприятия',
            items: [
                { q: "Можно ли провести экскурсию в музее?", a: "Да. Для групповых экскурсий необходимо заказать за 3 дня, связавшись с нами." },
                { q: "Разрешена ли фото- и видеосъёмка?", a: "Фото- и видеосъёмка разрешена для личного использования. Для коммерческих целей требуется разрешение администрации музея." },
                { q: "Можно ли проводить мероприятия в музее?", a: "Зал музея можно забронировать для лекций, конференций или культурных мероприятий. Для получения информации свяжитесь с нами." },
            ]
        },
    ]

    const faqsEn = [
        {
            category: 'Visit',
            items: [
                { q: "Where is the museum located?", a: "The museum is located at 34 Abdulla Avloniy Street, Yunusabad district, Tashkent. You can get directions via Google Maps." },
                { q: "What are the museum's working hours?", a: "The museum is open Monday to Saturday 9:00–18:00, Sunday 10:00–16:00." },
                { q: "Is admission free?", a: "Admission to the main hall is free. Some special exhibitions may have a nominal fee." },
                { q: "Can I bring children?", a: "Of course! The museum is designed for visitors of all ages. Pre-registration is recommended for school excursions." },
            ]
        },
        {
            category: 'Resources',
            items: [
                { q: "Is downloading e-books free?", a: "Yes, all e-books and articles on the site are free to download. No registration required." },
                { q: "Can audio materials be listened to offline?", a: "Currently only online listening is available. A download function will be added in the future." },
            ]
        },
        {
            category: 'Gallery & Events',
            items: [
                { q: "Can tours be arranged at the museum?", a: "Yes. For group tours, please book at least 3 days in advance by contacting us." },
                { q: "Is photography and videography allowed?", a: "Photo and video recording is permitted for personal use. Commercial use requires permission from museum administration." },
                { q: "Can events be held at the museum?", a: "The museum hall can be reserved for lectures, conferences or cultural events. Contact us for details." },
            ]
        },
    ]

    const faqs = locale === 'ru' ? faqsRu : locale === 'en' ? faqsEn : faqsUz

    const t = {
        label: locale === 'ru' ? 'Вопросы' : locale === 'en' ? 'Questions' : 'Savollar',
        h1a: locale === 'ru' ? 'Часто задаваемые ' : locale === 'en' ? 'Frequently Asked ' : "Ko'p ",
        h1b: locale === 'ru' ? 'вопросы' : locale === 'en' ? 'Questions' : "So'raladigan",
        h1c: locale === 'ru' ? '' : locale === 'en' ? '' : ' Savollar',
        desc: locale === 'ru' ? 'Ответы на часто задаваемые вопросы о музее.' : locale === 'en' ? 'Answers to frequently asked questions about the museum.' : 'Muzey haqida tez-tez beriladigan savollarga javoblar.',
        ctaTitle: locale === 'ru' ? 'Не нашли ответ?' : locale === 'en' ? "Didn't find an answer?" : 'Javob topa olmadingizmi?',
        ctaDesc: locale === 'ru' ? 'Отправьте нам свой вопрос напрямую, и мы ответим вам в ближайшее время.' : locale === 'en' ? 'Send us your question directly and we will respond to you soon.' : "Savolingizni bizga to'g'ridan-to'g'ri yuboring, tez orada javob beramiz.",
        ctaBtn: locale === 'ru' ? 'Связаться →' : locale === 'en' ? 'Contact us →' : "Bog'lanish →",
    }

    return (
        <>
            <div className="page-header">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="label">{t.label}</div>
                    <h1>{t.h1a}<span>{t.h1b}</span>{t.h1c}</h1>
                    <p>{t.desc}</p>
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
                            {t.ctaTitle}
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '24px', fontSize: '16px' }}>
                            {t.ctaDesc}
                        </p>
                        <a href={`/${locale}/contact`} className="btn-primary">
                            {t.ctaBtn}
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}