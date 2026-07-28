import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            transition: 'background-color 0.3s ease',
        }}>
            <div>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(80px, 15vw, 140px)',
                    fontWeight: '700',
                    color: 'rgba(201,168,76,0.2)',
                    lineHeight: 1,
                    marginBottom: '0',
                }}>404</div>

                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(22px, 4vw, 36px)',
                    color: 'var(--text-heading)',
                    marginBottom: '16px',
                    marginTop: '-16px',
                }}>Sahifa topilmadi</div>

                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '16px',
                    maxWidth: '400px',
                    margin: '0 auto 40px',
                    lineHeight: '1.7',
                }}>
                    Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/" className="btn-primary">
                        Bosh sahifaga qaytish →
                    </Link>
                    <Link href="/news" className="btn-outline">
                        Yangiliklar
                    </Link>
                </div>
            </div>
        </div>
    )
}