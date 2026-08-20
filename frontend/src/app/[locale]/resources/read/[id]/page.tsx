'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { readerService, resourceService } from '@/lib/services'
import { BookAccessInfo, ReaderProfile, getReaderSession, setReaderSession, removeReaderSession } from '@/lib/api'

export default function BookReaderPage() {
    const params = useParams()
    const router = useRouter()
    const locale = useLocale()
    const resourceId = Number(params.id)

    const [book, setBook] = useState<BookAccessInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    
    // Reader session
    const [reader, setReader] = useState<ReaderProfile | null>(null)
    
    // DRM & Reader state
    const [currentPage, setCurrentPage] = useState(1)
    const [zoom, setZoom] = useState(100)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [viewMode, setViewMode] = useState<'fit' | 'width' | 'actual'>('fit')
    
    // Auth & Purchase Modal state
    const [showPayModal, setShowPayModal] = useState(false)
    const [authPhone, setAuthPhone] = useState('')
    const [authName, setAuthName] = useState('')
    const [authTelegram, setAuthTelegram] = useState('')
    const [authStep, setAuthStep] = useState<'phone' | 'pay' | 'success'>('phone')
    const [processingPayment, setProcessingPayment] = useState(false)
    const [paySuccessMessage, setPaySuccessMessage] = useState('')

    const readerContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const savedReader = getReaderSession()
        if (savedReader) {
            setReader(savedReader)
            setAuthPhone(savedReader.phone)
            setAuthName(savedReader.fullName)
        }
        loadBookAccess(savedReader?.phone)
    }, [resourceId])

    // Keyboard and anti-copy security
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Block Ctrl+S (Save), Ctrl+P (Print), Ctrl+C (Copy)
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'c' || e.key === 'u')) {
                e.preventDefault()
                alert("Mualliflik huquqini himoya qilish maqsadida ushbu amal cheklangan.")
            }
            // Page navigation
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                handleNextPage()
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                handlePrevPage()
            }
        }

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
        }

        window.addEventListener('keydown', handleKeyDown)
        document.addEventListener('contextmenu', handleContextMenu)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('contextmenu', handleContextMenu)
        }
    }, [currentPage, book])

    const loadBookAccess = async (phone?: string) => {
        setLoading(true)
        setError('')
        try {
            const data = await readerService.checkAccess(resourceId, phone)
            setBook(data)
        } catch (err: any) {
            setError(err?.message || "Kitob ma'lumotlarini yuklashda xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    const previewLimit = book?.previewPagesCount || 10
    const isLocked = book?.isPremium && !book?.hasFullAccess && currentPage > previewLimit

    const handleNextPage = () => {
        if (!book) return
        const maxPages = book.previewPagesCount || 50
        if (book.isPremium && !book.hasFullAccess && currentPage >= previewLimit) {
            setShowPayModal(true)
            return
        }
        setCurrentPage(p => p + 1)
    }

    const handlePrevPage = () => {
        setCurrentPage(p => Math.max(1, p - 1))
    }

    const handleToggleFullscreen = () => {
        if (!document.fullscreenElement) {
            readerContainerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    const handleReaderAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!authPhone.trim()) return
        try {
            const profile = await readerService.auth(authPhone, authName, authTelegram)
            setReader(profile)
            setReaderSession(profile)
            setAuthStep('pay')
            // Re-check access
            await loadBookAccess(profile.phone)
        } catch (err: any) {
            alert(err?.message || "Kirishda xatolik yuz berdi")
        }
    }

    const handleExecutePayment = async (provider: string) => {
        if (!reader?.phone || !book) return
        setProcessingPayment(true)
        try {
            const res = await readerService.purchase(resourceId, reader.phone, reader.fullName, provider)
            setPaySuccessMessage("Xaridingiz muvaffaqiyatli qabul qilindi! Kitob to'liq ochildi.")
            setAuthStep('success')
            await loadBookAccess(reader.phone)
            setTimeout(() => {
                setShowPayModal(false)
                setAuthStep('phone')
            }, 2500)
        } catch (err: any) {
            alert(err?.message || "To'lov jarayonida xatolik yuz berdi")
        } finally {
            setProcessingPayment(false)
        }
    }

    const handleLogoutReader = () => {
        removeReaderSession()
        setReader(null)
        loadBookAccess(undefined)
    }

    // Watermark text
    const watermarkText = reader
        ? `Faqat ${reader.fullName || 'Kitobxon'} (${reader.phone}) mutolaasi uchun · Avloniy Muzeyi DRM`
        : `Avloniy Portali · Demo Mutolaa Rejimi`

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#0a0f0d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(201,168,76,0.2)', borderTop: '3px solid var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <div>Himoyalangan elektron kitobxon yuklanmoqda...</div>
                </div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div style={{ minHeight: '100vh', background: '#0a0f0d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '24px' }}>
                <div style={{ maxWidth: '480px', textAlign: 'center', background: '#111915', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '36px', marginBottom: '16px' }}>⚠️</div>
                    <h2 style={{ fontSize: '20px', color: '#f87171', marginBottom: '12px' }}>Kitobni ochib bo'lmadi</h2>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>{error || "Manba topilmadi"}</p>
                    <Link href={`/${locale}/resources`} style={{ padding: '10px 20px', background: 'var(--gold)', color: '#061d15', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>
                        ← Manbalar ro'yxatiga qaytish
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div ref={readerContainerRef} style={{ minHeight: '100vh', background: '#070b09', color: '#e5e7eb', display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>
            
            {/* TOP BAR */}
            <header style={{ height: '60px', background: 'rgba(10,16,13,0.95)', borderBottom: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href={`/${locale}/resources`} style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '13px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(201,168,76,0.1)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.25)' }}>
                        <span>←</span>
                        <span>Chiqish</span>
                    </Link>
                    <div style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{book.author}</div>
                    </div>
                </div>

                {/* Page Navigation Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1}
                        style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: currentPage <= 1 ? 'rgba(255,255,255,0.2)' : 'var(--gold)', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                    >
                        ◀
                    </button>
                    
                    <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#fff', padding: '0 8px' }}>
                        Sahifa <strong style={{ color: 'var(--gold)' }}>{currentPage}</strong>
                        {book.isPremium && !book.hasFullAccess && (
                            <span style={{ color: '#f59e0b', fontSize: '11px', marginLeft: '6px' }}>
                                (Demo: {previewLimit} bet)
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleNextPage}
                        style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                    >
                        ▶
                    </button>
                </div>

                {/* Right controls: Zoom, DRM Status, Reader Auth */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Zoom buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '6px' }}>
                        <button onClick={() => setZoom(z => Math.max(60, z - 15))} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: '4px 8px' }}>-</button>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.7)', minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(180, z + 15))} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', padding: '4px 8px' }}>+</button>
                    </div>

                    {/* Fullscreen */}
                    <button onClick={handleToggleFullscreen} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }} title="To'liq ekran">
                        {isFullscreen ? '⛶ Kichraytirish' : '⛶ To\'liq ekran'}
                    </button>

                    {/* Reader profile pill */}
                    {reader ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>
                            <span style={{ color: '#22c55e' }}>● {reader.fullName || reader.phone}</span>
                            <button onClick={handleLogoutReader} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}>Chiqish</button>
                        </div>
                    ) : (
                        <button onClick={() => { setShowPayModal(true); setAuthStep('phone') }} style={{ padding: '6px 14px', background: 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                            {book.isPremium ? `⭐ Xarid qilish (${book.price?.toLocaleString()} so'm)` : '🔑 Kirish'}
                        </button>
                    )}
                </div>
            </header>

            {/* MAIN READING AREA */}
            <main style={{ flex: 1, position: 'relative', overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '24px', background: '#0a0f0d' }}>
                
                {/* LOCKED PAYWALL OVERLAY (When page > previewPagesCount) */}
                {isLocked ? (
                    <div style={{ maxWidth: '560px', margin: 'auto', background: 'linear-gradient(180deg, #111a15 0%, #0c120e 100%)', border: '2px solid rgba(201,168,76,0.5)', borderRadius: '20px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', position: 'relative', zIndex: 10 }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px' }}>
                            🔒
                        </div>
                        <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: '8px' }}>
                            Demo Mutolaa Yakunlandi
                        </h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '24px' }}>
                            Siz ushbu manbaning bepul taqdim etilgan <strong>{previewLimit} ta demo sahifasini</strong> o'qib chiqdingiz. Kitobni to'liq, cheklovlarsiz va umrbod o'qish uchun xarid qiling.
                        </p>

                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '12px', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>Kitob Narxi</div>
                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                                {book.price?.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--gold)' }}>SO'M</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => { setShowPayModal(true); setAuthStep(reader ? 'pay' : 'phone') }}
                                style={{ padding: '14px 24px', background: 'linear-gradient(135deg, var(--gold) 0%, #b38b2d 100%)', color: '#061d15', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 16px rgba(201,168,76,0.4)' }}
                            >
                                💳 To'liq kitobni xarid qilish →
                            </button>
                            <button
                                onClick={() => setCurrentPage(previewLimit)}
                                style={{ padding: '10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer' }}
                            >
                                ← Demo sahifalarga qaytish
                            </button>
                        </div>
                    </div>
                ) : (
                    /* UNLOCKED DOCUMENT VIEWER CONTAINER WITH WATERMARK */
                    <div style={{ position: 'relative', width: `${zoom}%`, maxWidth: '900px', background: '#fff', borderRadius: '8px', boxShadow: '0 10px 35px rgba(0,0,0,0.7)', overflow: 'hidden', minHeight: '800px', display: 'flex', flexDirection: 'column' }}>
                        
                        {/* DYNAMIC WATERMARK OVERLAY */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 5,
                            overflow: 'hidden',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'space-around',
                            justifyContent: 'space-around',
                            padding: '40px',
                            opacity: 0.14
                        }}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} style={{
                                    transform: 'rotate(-30deg)',
                                    color: '#000',
                                    fontFamily: 'monospace',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    margin: '30px',
                                    whiteSpace: 'nowrap',
                                    userSelect: 'none'
                                }}>
                                    {watermarkText} · {new Date().toLocaleDateString()}
                                </div>
                            ))}
                        </div>

                        {/* Embed or Render PDF / Document */}
                        {book.fileUrl.endsWith('.pdf') ? (
                            <iframe
                                src={`${book.fileUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
                                style={{ width: '100%', flex: 1, minHeight: '850px', border: 'none' }}
                                title={book.title}
                            />
                        ) : (
                            <div style={{ padding: '40px', color: '#111', lineHeight: '1.8', fontSize: '16px' }}>
                                <h1 style={{ fontSize: '24px', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>{book.title}</h1>
                                <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '24px' }}>Muallif: {book.author}</p>
                                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <p>Ushbu elektron manba brauzer ichida xavfsiz o'qilmoqda. Sahifa: {currentPage}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* AUTH & PAYMENT MODAL */}
            {showPayModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
                    <div style={{ width: '100%', maxWidth: '440px', background: '#101713', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.9)', position: 'relative' }}>
                        <button
                            onClick={() => setShowPayModal(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}
                        >
                            ✕
                        </button>

                        {/* STEP 1: PHONE & NAME AUTH */}
                        {authStep === 'phone' && (
                            <div>
                                <h3 style={{ fontSize: '18px', color: 'var(--gold)', marginBottom: '6px', fontWeight: '700' }}>
                                    📱 Kitobxon Kirishi
                                </h3>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: '1.5' }}>
                                    Sotib olingan kitoblaringiz profilingizga biriktirilishi va doimiy saqlanishi uchun telefon raqamingizni kiriting:
                                </p>

                                <form onSubmit={handleReaderAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>Telefon raqamingiz *</label>
                                        <input
                                            type="tel"
                                            value={authPhone}
                                            onChange={e => setAuthPhone(e.target.value)}
                                            placeholder="+998 90 123 45 67"
                                            required
                                            style={{ width: '100%', padding: '12px', background: '#070b09', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>Ismingiz (Suv belgisi uchun)</label>
                                        <input
                                            type="text"
                                            value={authName}
                                            onChange={e => setAuthName(e.target.value)}
                                            placeholder="Ali Valiyev"
                                            style={{ width: '100%', padding: '12px', background: '#070b09', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        style={{ marginTop: '10px', padding: '14px', background: 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '800', cursor: 'pointer' }}
                                    >
                                        Davom etish →
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* STEP 2: PAYMENT METHOD SELECTION */}
                        {authStep === 'pay' && (
                            <div>
                                <h3 style={{ fontSize: '18px', color: 'var(--gold)', marginBottom: '4px', fontWeight: '700' }}>
                                    💳 To'lovni amalga oshirish
                                </h3>
                                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                                    Xaridor: <strong style={{ color: '#fff' }}>{reader?.fullName}</strong> ({reader?.phone})
                                </p>

                                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(201,168,76,0.3)' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--gold)' }}>To'lanadigan summa:</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
                                        {book.price?.toLocaleString()} SO'M
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button
                                        onClick={() => handleExecutePayment('CLICK')}
                                        disabled={processingPayment}
                                        style={{ padding: '12px 16px', background: '#008ae6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <span>🔵 Click orqali to'lash</span>
                                        <span>→</span>
                                    </button>
                                    <button
                                        onClick={() => handleExecutePayment('PAYME')}
                                        disabled={processingPayment}
                                        style={{ padding: '12px 16px', background: '#14b8a6', color: '#061d15', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <span>🟢 Payme orqali to'lash</span>
                                        <span>→</span>
                                    </button>
                                    <button
                                        onClick={() => handleExecutePayment('DEMO')}
                                        disabled={processingPayment}
                                        style={{ padding: '12px 16px', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <span>⚡ Tezkor Sinov To'lovi (Demo Test)</span>
                                        <span>✓</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {authStep === 'success' && (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                                <h3 style={{ fontSize: '20px', color: '#22c55e', marginBottom: '8px' }}>Tabriklaymiz!</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                                    {paySuccessMessage}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
