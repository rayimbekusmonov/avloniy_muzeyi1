'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { authService } from '@/lib/services'
import { setToken } from '@/lib/api'

const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 15 * 60 * 1000
const STORAGE_KEY = 'admin_login_attempts'

interface AttemptData {
    count: number
    blockedUntil: number | null
    lastAttempt: number
}

function getAttemptData(): AttemptData {
    if (typeof window === 'undefined') return { count: 0, blockedUntil: null, lastAttempt: 0 }
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { count: 0, blockedUntil: null, lastAttempt: 0 }
        return JSON.parse(raw)
    } catch {
        return { count: 0, blockedUntil: null, lastAttempt: 0 }
    }
}

function saveAttemptData(data: AttemptData) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function resetAttempts() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
}

function formatTimeLeft(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    if (minutes > 0) return `${minutes} daqiqa ${seconds} soniya`
    return `${seconds} soniya`
}

function AdminLoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const locale = useLocale()

    const [mode, setMode] = useState<'login' | 'setup'>('login')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)
    const [blocked, setBlocked] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)

    // Check if admin setup is needed on load
    useEffect(() => {
        authService.getStatus().then(res => {
            if (res && res.hasAdmin === false) {
                setMode('setup')
            }
        }).catch(() => {})

        if (searchParams.get('sessionExpired') === 'true') {
            setError('Sessiya muddati tugadi. Iltimos, qaytadan tizimga kiring.')
        }
    }, [searchParams])

    // Blok holati
    useEffect(() => {
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
    }, [])

    // Countdown timer
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
        setSuccessMessage('')
        setLoading(true)
        try {
            const response = await authService.login(username, password)
            setToken(response.token)
            resetAttempts()
            router.push(`/${locale}/admin/dashboard`)
        } catch (err: any) {
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
                setError(err?.message || `Username yoki parol noto'g'ri. Yana ${left} ta urinish qoldi.`)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        setLoading(true)
        try {
            const res = await authService.setup(username, password)
            setSuccessMessage(res.message || 'Admin muvaffaqiyatli yaratildi! Endi tizimga kiring.')
            setMode('login')
        } catch (err: any) {
            setError(err?.message || 'Admin yaratishda xato yuz berdi. Boshqa admin allaqachon mavjud bo\'lishi mumkin.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--gold)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#061d15', boxShadow: 'var(--shadow-md)' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
                        </svg>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--text-heading)', marginBottom: '6px' }}>Boshqaruv Paneli</h1>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '3px', textTransform: 'uppercase' }}>O&apos;zbekiston Jadidlari · CMS</p>
                </div>

                {/* Mode Selector Tabs */}
                <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                    <button
                        type="button"
                        onClick={() => { setMode('login'); setError(''); }}
                        style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: mode === 'login' ? 'var(--gold)' : 'transparent', color: mode === 'login' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Kirish (Sign In)
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('setup'); setError(''); }}
                        style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: mode === 'setup' ? 'var(--gold)' : 'transparent', color: mode === 'setup' ? '#061d15' : 'var(--text-main)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Setup (Sign Up)
                    </button>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px 40px 40px', boxShadow: 'var(--shadow-lg)' }}>
                    {blocked ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px', display: 'block', opacity: 0.7 }}>
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#ef4444', marginBottom: '12px' }}>Kirish bloklandi</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>Ko'p marta noto'g'ri parol kiritildi.</p>
                            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '16px' }}>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>QOLGAN VAQT</div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#ef4444', fontWeight: '700' }}>{formatTimeLeft(timeLeft)}</div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={mode === 'login' ? handleLogin : handleSetup}>
                            <h2 style={{ fontSize: '16px', color: 'var(--text-heading)', marginBottom: '16px', fontWeight: '600' }}>
                                {mode === 'login' ? 'Tizimga Kirish' : 'Birinchi Admin Akkountini Yaratish'}
                            </h2>

                            {successMessage && (
                                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
                                    <span style={{ color: '#22c55e', fontSize: '13px', lineHeight: '1.5' }}>✓ {successMessage}</span>
                                </div>
                            )}

                            {error && (
                                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
                                    <span style={{ color: '#ef4444', fontSize: '13px', lineHeight: '1.5' }}>⚠ {error}</span>
                                </div>
                            )}

                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Username</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required disabled={loading} autoComplete="username" style={inputStyle} placeholder="admin"
                                       onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                       onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                            </div>
                            <div style={{ marginBottom: '28px' }}>
                                <label style={labelStyle}>Parol {mode === 'setup' && '(kamida 6 belgi)'}</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} style={inputStyle} placeholder="••••••••"
                                       onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                                       onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                            </div>

                            {mode === 'login' && attemptsLeft < MAX_ATTEMPTS && attemptsLeft > 0 && (
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>URINISHLAR</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: attemptsLeft <= 2 ? '#ef4444' : 'var(--text-muted)' }}>{attemptsLeft}/{MAX_ATTEMPTS}</span>
                                    </div>
                                    <div style={{ height: '3px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(attemptsLeft / MAX_ATTEMPTS) * 100}%`, background: attemptsLeft <= 2 ? '#ef4444' : '#C9A84C', borderRadius: '2px', transition: 'all 0.3s' }} />
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(201,168,76,0.4)' : 'var(--gold)', color: '#061d15', fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '15px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                                {loading
                                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <span style={{ width: '16px', height: '16px', border: '2px solid rgba(10,24,41,0.3)', borderTop: '2px solid #061d15', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                        Bajarilmoqda...
                                      </span>
                                    : (mode === 'login' ? 'Kirish →' : 'Admin Yaratish →')
                                }
                            </button>
                        </form>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '2px' }}>
                    DEFAULT CREDENTIALS: <span style={{ color: 'var(--gold)' }}>admin</span> / <span style={{ color: 'var(--gold)' }}>admin123</span>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

function Spinner() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px',
    color: 'var(--text-muted)', letterSpacing: '2px',
    textTransform: 'uppercase', marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px', color: 'var(--text-main)', fontSize: '15px',
    fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s',
}