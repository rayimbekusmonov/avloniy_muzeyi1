'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services'
import { setToken } from '@/lib/api'

const MuseumIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
    </svg>
)

export default function AdminLoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            const response = await authService.login(username, password)
            setToken(response.token)
            router.push('/admin/dashboard')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Xato yuz berdi')
        } finally { setLoading(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1829 0%, #1B3A6B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '20px', padding: '48px 40px', backdropFilter: 'blur(10px)' }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--gold)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--navy-dark)' }}>
                        <MuseumIcon />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#fff', marginBottom: '6px' }}>Admin Panel</h1>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase' }}>Avloniy Muzeyi</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '15px', fontFamily: 'var(--font-body)', outline: 'none' }}
                               onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                               onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                        />
                    </div>
                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Parol</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '15px', fontFamily: 'var(--font-body)', outline: 'none' }}
                               onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                               onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                        />
                    </div>
                    {error && <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '12px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '20px' }}>{error}</div>}
                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(201,168,76,0.5)' : 'var(--gold)', color: '#0a1829', fontFamily: 'var(--font-display)', fontWeight: '600', fontSize: '15px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {loading ? 'Kirish...' : 'Kirish →'}
                    </button>
                </form>
            </div>
        </div>
    )
}