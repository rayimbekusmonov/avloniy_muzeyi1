import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a1829 0%, #1B3A6B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
        }}>
            <div>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(80px, 15vw, 140px)',
                    fontWeight: '700',
                    color: 'rgba(201,168,76,0.15)',
                    lineHeight: 1,
                    marginBottom: '0',
                }}>404</div>

                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(22px, 4vw, 36px)',
                    color: '#fff',
                    marginBottom: '16px',
                    marginTop: '-16px',
                }}>Sahifa topilmadi</div>

                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '16px',
                    maxWidth: '400px',
                    margin: '0 auto 40px',
                    lineHeight: '1.7',
                }}>
                    Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/frontend/public" className="btn-primary">
                        Bosh sahifaga qaytish →
                    </Link>
                    <Link href="/news" className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                        Yangiliklar
                    </Link>
                </div>
            </div>
        </div>
    )
}