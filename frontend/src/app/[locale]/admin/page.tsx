'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/lib/services'
import { setToken } from '@/lib/api'

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ADMIN_ACCESS_TOKEN || 'avloniy-cms-k7m2p9'
const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 15 * 60 * 1000
const STORAGE_KEY = 'admin_login_attempts'

interface AttemptData {
    count: number
    blockedUntil: number | null
    lastAttempt: number
}

function AdminLoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [authorized, setAuthorized] = useState<boolean | null>(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isClient, setIsClient] = useState(false) // Hydration xatosini oldini olish uchun

    const [blocked, setBlocked] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)

    // LocalStorage yordamchi funksiyalari (faqat client-side)
    const getAttemptData = (): AttemptData => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : { count: 0, blockedUntil: null, lastAttempt: 0 }
        } catch {
            return { count: 0, blockedUntil: null, lastAttempt: 0 }
        }
    }

    const saveAttemptData = (data: AttemptData) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }

    const resetAttempts = () => {
        localStorage.removeItem(STORAGE_KEY)
    }

    // 1. Initial Load & Authorization Check
    useEffect(() => {
        setIsClient(true)
        const accessParam = searchParams.get('access')
        setAuthorized(accessParam === ACCESS_TOKEN)
    }, [searchParams])

    // 2. Load Attempt Data (faqat isClient va authorized bo'lganda)
    useEffect(() => {
        if (!isClient || !authorized) return

        const data = getAttemptData()
        const now = Date.now()

        if (data.blockedUntil && data.blockedUntil > now) {
            setBlocked(true)
            setTimeLeft(data.blockedUntil - now)
            setAttemptsLeft(0)
        } else {
            if (data.blockedUntil && data.blockedUntil <= now) resetAttempts()
            setAttemptsLeft(MAX_ATTEMPTS - (data.count || 0))
        }
    }, [isClient, authorized])

    // 3. Countdown Timer
    useEffect(() => {
        if (!blocked || timeLeft <= 0) return
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                const next = prev - 1000
                if (next <= 0) {
                    setBlocked(false)
                    setAttemptsLeft(MAX_ATTEMPTS)
                    resetAttempts()
                    clearInterval(interval)
                    return 0
                }
                return next
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [blocked, timeLeft])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (blocked) return
        setError('')
        setLoading(true)
        try {
            const response = await authService.login(username, password)
            setToken(response.token)
            resetAttempts()
            router.push('/admin/dashboard')
        } catch {
            const data = getAttemptData()
            const newCount = data.count + 1
            if (newCount >= MAX_ATTEMPTS) {
                const blockedUntil = Date.now() + BLOCK_DURATION_MS
                saveAttemptData({ count: newCount, blockedUntil, lastAttempt: Date.now() })
                setBlocked(true)
                setTimeLeft(BLOCK_DURATION_MS)
                setAttemptsLeft(0)
                setError(`${MAX_ATTEMPTS} marta noto'g'ri urinish. 15 daqiqa bloklandingiz.`)
            } else {
                saveAttemptData({ count: newCount, blockedUntil: null, lastAttempt: Date.now() })
                const left = MAX_ATTEMPTS - newCount
                setAttemptsLeft(left)
                setError(`Username yoki parol noto'g'ri. Yana ${left} ta urinish qoldi.`)
            }
        } finally {
            setLoading(false)
        }
    }

    const formatTimeLeft = (ms: number): string => {
        const totalSeconds = Math.ceil(ms / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        return minutes > 0 ? `${minutes} daqiqa ${seconds} soniya` : `${seconds} soniya`
    }

    // Hydration jarayoni tugaguncha yoki ruxsat tekshirilguncha spinner
    if (!isClient || authorized === null) {
        return <Spinner />
    }

    // Noto'g'ri access token bo'lsa 404
    if (!authorized) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px,15vw,140px)', fontWeight: '700', color: 'rgba(27,58,107,0.08)', lineHeight: 1 }}>404</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--navy-dark)', marginTop: '-16px', marginBottom: '12px' }}>Sahifa topilmadi</h1>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>Siz qidirayotgan sahifa mavjud emas.</p>
                    <a href="/uz" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--navy-dark)', color: '#fff', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: '600' }}>
                        Bosh sahifaga →
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#060f1e 0%,#0a1829 50%,#112548 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--gold)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--navy-dark)', boxShadow: '0 8px 32px rgba(201,168,76,0.3)' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
                        </svg>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', marginBottom: '6px' }}>Boshqaruv Paneli</h1>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', textTransform: 'uppercase' }}>Avloniy Muzeyi · CMS</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '16px', padding: '40px', backdropFilter: 'blur(20px)' }}>
                    {blocked ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px', display: 'block', opacity: 0.7 }}>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#fca5a5', marginBottom: '12px' }}>Kirish bloklandi</h3>
                            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '16px' }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#fca5a5', fontWeight: '700' }}>{formatTimeLeft(timeLeft)}</div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Username</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required disabled={loading} style={inputStyle} placeholder="admin" />
                            </div>
                            <div style={{ marginBottom: '28px' }}>
                                <label style={labelStyle}>Parol</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} style={inputStyle} placeholder="••••••••" />
                            </div>
                            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#fca5a5', fontSize: '13px' }}>⚠ {error}</div>}
                            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(201,168,76,0.4)' : 'var(--gold)', color: '#0a1829', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                                {loading ? 'Tekshirilmoqda...' : 'Kirish →'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

function Spinner() {
    return (
        <div style={{ minHeight: '100vh', background: '#060f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid rgba(201,168,76,0.2)', borderTop: '3px solid #C9A84C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <AdminLoginContent />
        </Suspense>
    )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: '8px' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', outline: 'none' }