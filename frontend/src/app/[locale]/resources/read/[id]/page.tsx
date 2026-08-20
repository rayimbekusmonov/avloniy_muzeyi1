'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { readerService } from '@/lib/services'
import { BookAccessInfo, ReaderProfile, getReaderSession, setReaderSession, removeReaderSession } from '@/lib/api'

type ReaderTheme = 'dark' | 'sepia' | 'light'

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
    
    // Reading Controls
    const [currentPage, setCurrentPage] = useState(1)
    const [zoom, setZoom] = useState(100)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [theme, setTheme] = useState<ReaderTheme>('dark')
    const [pageInputValue, setPageInputValue] = useState('1')
    
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

    // Keyboard shortcuts & anti-piracy protections
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Block Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+U
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'c' || e.key === 'u')) {
                e.preventDefault()
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
        if (book.isPremium && !book.hasFullAccess && currentPage >= previewLimit) {
            setShowPayModal(true)
            return
        }
        const nextPage = currentPage + 1
        setCurrentPage(nextPage)
        setPageInputValue(String(nextPage))
    }

    const handlePrevPage = () => {
        const prevPage = Math.max(1, currentPage - 1)
        setCurrentPage(prevPage)
        setPageInputValue(String(prevPage))
    }

    const handlePageJump = (e: React.FormEvent) => {
        e.preventDefault()
        const target = parseInt(pageInputValue, 10)
        if (!isNaN(target) && target >= 1) {
            if (book?.isPremium && !book?.hasFullAccess && target > previewLimit) {
                setShowPayModal(true)
                return
            }
            setCurrentPage(target)
        } else {
            setPageInputValue(String(currentPage))
        }
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
            await loadBookAccess(profile.phone)
        } catch (err: any) {
            alert(err?.message || "Kirishda xatolik yuz berdi")
        }
    }

    const handleExecutePayment = async (provider: string) => {
        if (!reader?.phone || !book) return
        setProcessingPayment(true)
        try {
            await readerService.purchase(resourceId, reader.phone, reader.fullName, provider)
            setPaySuccessMessage("Xaridingiz muvaffaqiyatli amalga oshirildi! Kitob to'liq ochildi.")
            setAuthStep('success')
            await loadBookAccess(reader.phone)
            setTimeout(() => {
                setShowPayModal(false)
                setAuthStep('phone')
            }, 2000)
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

    // Theme color tokens
    const themeStyles = {
        dark: {
            bg: '#080c0a',
            headerBg: '#0e1411',
            text: '#e2e8f0',
            border: 'rgba(255,255,255,0.08)',
            paperBg: '#121a16',
            paperText: '#f1f5f9',
            watermarkColor: 'rgba(255,255,255,0.07)',
        },
        sepia: {
            bg: '#2b2318',
            headerBg: '#382e20',
            text: '#fef3c7',
            border: 'rgba(251,191,36,0.15)',
            paperBg: '#fbf0d9',
            paperText: '#292013',
            watermarkColor: 'rgba(0,0,0,0.06)',
        },
        light: {
            bg: '#e2e8f0',
            headerBg: '#ffffff',
            text: '#1e293b',
            border: 'rgba(0,0,0,0.1)',
            paperBg: '#ffffff',
            paperText: '#0f172a',
            watermarkColor: 'rgba(0,0,0,0.06)',
        },
    }[theme]

    // Watermark text
    const watermarkText = reader
        ? `Faqat ${reader.fullName || 'Kitobxon'} (${reader.phone}) mutolaasi uchun · Avloniy Portali DRM`
        : `Avloniy Muzeyi · Demo Mutolaa Rejimi`

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#080c0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border: '3px solid rgba(201,168,76,0.2)', borderTop: '3px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <div style={{ fontSize: '14px', letterSpacing: '1px' }}>Himoyalangan elektron kitobxon yuklanmoqda...</div>
                </div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div style={{ minHeight: '100vh', background: '#080c0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '24px' }}>
                <div style={{ maxWidth: '480px', textAlign: 'center', background: '#111915', padding: '40px 32px', borderRadius: '16px', border: '1px solid rgba(201,168,76,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>📖</div>
                    <h2 style={{ fontSize: '20px', color: '#f87171', marginBottom: '12px' }}>Manbani ochib bo'lmadi</h2>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.6' }}>{error || "Manba topilmadi yoki yuklashda xatolik yuz berdi."}</p>
                    <Link href={`/${locale}/resources`} style={{ padding: '12px 24px', background: 'var(--gold)', color: '#061d15', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', display: 'inline-block' }}>
                        ← Kutubxonaga qaytish
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div ref={readerContainerRef} style={{ minHeight: '100vh', height: '100vh', background: themeStyles.bg, color: themeStyles.text, display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none' }}>
            
            {/* CLEAN DISTRACTION-FREE TOPBAR */}
            <header style={{ height: '56px', background: themeStyles.headerBg, borderBottom: `1px solid ${themeStyles.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'relative', zIndex: 50, flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
                
                {/* Left: Back & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '35%', overflow: 'hidden' }}>
                    <Link
                        href={`/${locale}/resources`}
                        style={{
                            color: 'var(--gold)',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontFamily: 'var(--font-mono)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(201,168,76,0.12)',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid rgba(201,168,76,0.3)',
                            fontWeight: '600',
                            flexShrink: 0
                        }}
                    >
                        <span>←</span>
                        <span>Kutubxona</span>
                    </Link>

                    <div style={{ borderLeft: `1px solid ${themeStyles.border}`, paddingLeft: '16px', overflow: 'hidden' }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: themeStyles.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {book.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gold)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {book.author}
                        </div>
                    </div>
                </div>

                {/* Center: Page Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.06)',
                            border: `1px solid ${themeStyles.border}`,
                            color: currentPage <= 1 ? 'rgba(255,255,255,0.2)' : 'var(--gold)',
                            cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px'
                        }}
                        title="Oldingi sahifa (◀)"
                    >
                        ◀
                    </button>

                    <form onSubmit={handlePageJump} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Bet</span>
                        <input
                            type="text"
                            value={pageInputValue}
                            onChange={e => setPageInputValue(e.target.value)}
                            onBlur={handlePageJump}
                            style={{
                                width: '44px',
                                height: '30px',
                                textAlign: 'center',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(201,168,76,0.4)',
                                borderRadius: '6px',
                                color: 'var(--gold)',
                                fontSize: '13px',
                                fontWeight: '700',
                                outline: 'none',
                                fontFamily: 'var(--font-mono)'
                            }}
                        />
                        {book.isPremium && !book.hasFullAccess && (
                            <span style={{ fontSize: '11px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '2px 8px', borderRadius: '12px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                                Demo: {previewLimit} bet
                            </span>
                        )}
                        {book.isPremium && book.hasFullAccess && (
                            <span style={{ fontSize: '11px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '2px 8px', borderRadius: '12px', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                                ✓ To'liq xarid
                            </span>
                        )}
                    </form>

                    <button
                        onClick={handleNextPage}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.06)',
                            border: `1px solid ${themeStyles.border}`,
                            color: 'var(--gold)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px'
                        }}
                        title="Keyingi sahifa (▶)"
                    >
                        ▶
                    </button>
                </div>

                {/* Right: Theme, Zoom, Fullscreen & Auth */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    
                    {/* Theme Toggles */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', padding: '2px', borderRadius: '6px', border: `1px solid ${themeStyles.border}` }}>
                        <button
                            onClick={() => setTheme('dark')}
                            style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: theme === 'dark' ? 'var(--gold)' : 'transparent', color: theme === 'dark' ? '#061d15' : 'inherit', cursor: 'pointer', fontSize: '12px' }}
                            title="Tungi rejim"
                        >
                            🌙
                        </button>
                        <button
                            onClick={() => setTheme('sepia')}
                            style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: theme === 'sepia' ? 'var(--gold)' : 'transparent', color: theme === 'sepia' ? '#061d15' : 'inherit', cursor: 'pointer', fontSize: '12px' }}
                            title="Sepia (Kitob qog'ozi)"
                        >
                            📜
                        </button>
                        <button
                            onClick={() => setTheme('light')}
                            style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: theme === 'light' ? 'var(--gold)' : 'transparent', color: theme === 'light' ? '#061d15' : 'inherit', cursor: 'pointer', fontSize: '12px' }}
                            title="Kunduzgi rejim"
                        >
                            ☀️
                        </button>
                    </div>

                    {/* Zoom */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '6px', border: `1px solid ${themeStyles.border}` }}>
                        <button onClick={() => setZoom(z => Math.max(60, z - 15))} style={{ background: 'transparent', border: 'none', color: themeStyles.text, cursor: 'pointer', fontSize: '13px', padding: '2px 6px' }}>-</button>
                        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', minWidth: '36px', textAlign: 'center' }}>{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(160, z + 15))} style={{ background: 'transparent', border: 'none', color: themeStyles.text, cursor: 'pointer', fontSize: '13px', padding: '2px 6px' }}>+</button>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                        onClick={handleToggleFullscreen}
                        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${themeStyles.border}`, color: themeStyles.text, padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                        title="To'liq ekran"
                    >
                        {isFullscreen ? '⛶ Kichraytirish' : '⛶'}
                    </button>

                    {/* Reader Auth / Purchase Pill */}
                    {reader ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                            <span style={{ color: '#22c55e', fontWeight: '600' }}>👤 {reader.fullName || reader.phone}</span>
                            <button onClick={handleLogoutReader} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}>Chiqish</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setShowPayModal(true); setAuthStep('phone') }}
                            style={{ padding: '6px 14px', background: 'linear-gradient(135deg, var(--gold) 0%, #b38b2d 100%)', color: '#061d15', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px rgba(201,168,76,0.3)' }}
                        >
                            {book.isPremium ? `⭐ Xarid qilish (${book.price?.toLocaleString()} so'm)` : '🔑 Kirish'}
                        </button>
                    )}
                </div>
            </header>

            {/* MAIN READING STAGE */}
            <main style={{ flex: 1, position: 'relative', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '24px 20px', background: themeStyles.bg }}>
                
                {/* Floating Left Page Arrow */}
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    style={{
                        position: 'fixed',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(14,20,17,0.85)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: currentPage <= 1 ? 'rgba(255,255,255,0.15)' : 'var(--gold)',
                        cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 40,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(6px)',
                        transition: 'all 0.2s'
                    }}
                >
                    ◀
                </button>

                {/* Floating Right Page Arrow */}
                <button
                    onClick={handleNextPage}
                    style={{
                        position: 'fixed',
                        right: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(14,20,17,0.85)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: 'var(--gold)',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 40,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(6px)',
                        transition: 'all 0.2s'
                    }}
                >
                    ▶
                </button>

                {/* LOCKED PAYWALL OVERLAY */}
                {isLocked ? (
                    <div style={{ maxWidth: '520px', margin: 'auto', background: 'linear-gradient(180deg, #101814 0%, #0a0f0d 100%)', border: '2px solid rgba(201,168,76,0.4)', borderRadius: '24px', padding: '48px 36px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.8)', position: 'relative', zIndex: 10 }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 20px', color: 'var(--gold)' }}>
                            🔒
                        </div>
                        <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: '10px' }}>
                            Demo Mutolaa Yakunlandi
                        </h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6', marginBottom: '28px' }}>
                            Siz ushbu manbaning bepul taqdim etilgan <strong>{previewLimit} ta demo sahifasini</strong> o'qib chiqdingiz. Kitobni to'liq, cheklovlarsiz va umrbod o'qish uchun xarid qiling.
                        </p>

                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '20px', marginBottom: '28px', border: '1px solid rgba(201,168,76,0.25)' }}>
                            <div style={{ fontSize: '12px', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>Kitob Narxi</div>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                                {book.price?.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--gold)' }}>SO'M</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={() => { setShowPayModal(true); setAuthStep(reader ? 'pay' : 'phone') }}
                                style={{ padding: '16px 28px', background: 'linear-gradient(135deg, var(--gold) 0%, #b38b2d 100%)', color: '#061d15', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 6px 20px rgba(201,168,76,0.35)', transition: 'transform 0.2s' }}
                            >
                                💳 To'liq kitobni xarid qilish →
                            </button>
                            <button
                                onClick={() => { setCurrentPage(previewLimit); setPageInputValue(String(previewLimit)) }}
                                style={{ padding: '10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer' }}
                            >
                                ← Demo sahifalarga qaytish
                            </button>
                        </div>
                    </div>
                ) : (
                    /* UNLOCKED DOCUMENT CANVAS CONTAINER */
                    <div style={{
                        position: 'relative',
                        width: `${zoom}%`,
                        maxWidth: '960px',
                        background: themeStyles.paperBg,
                        color: themeStyles.paperText,
                        borderRadius: '12px',
                        boxShadow: '0 15px 45px rgba(0,0,0,0.6)',
                        overflow: 'hidden',
                        minHeight: '850px',
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${themeStyles.border}`,
                        transition: 'width 0.2s ease, background 0.3s ease'
                    }}>
                        
                        {/* FORENSIC WATERMARK OVERLAY */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 10,
                            overflow: 'hidden',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignContent: 'space-around',
                            justifyContent: 'space-around',
                            padding: '60px',
                            opacity: 0.12
                        }}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} style={{
                                    transform: 'rotate(-25deg)',
                                    color: theme === 'dark' ? '#ffffff' : '#000000',
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    margin: '40px',
                                    whiteSpace: 'nowrap',
                                    userSelect: 'none'
                                }}>
                                    {watermarkText} · {new Date().toLocaleDateString()}
                                </div>
                            ))}
                        </div>

                        {/* Document Viewer Frame */}
                        {book.fileUrl ? (
                            <iframe
                                key={`${book.fileUrl}-${currentPage}`}
                                src={
                                    book.fileUrl.toLowerCase().includes('.pdf')
                                        ? `${book.fileUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`
                                        : book.fileUrl
                                }
                                style={{
                                    width: '100%',
                                    flex: 1,
                                    minHeight: '920px',
                                    height: '100%',
                                    border: 'none',
                                    background: '#ffffff',
                                    borderRadius: '8px'
                                }}
                                title={book.title}
                            />
                        ) : (
                            <div style={{ padding: '60px 48px', lineHeight: '1.8', fontSize: '17px', background: themeStyles.paperBg, color: themeStyles.paperText, textAlign: 'center' }}>
                                <h1 style={{ fontSize: '28px', fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: '16px', borderBottom: `1px solid ${themeStyles.border}`, paddingBottom: '12px' }}>
                                    {book.title}
                                </h1>
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '32px' }}>
                                    Muallif: {book.author}
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '12px', border: `1px solid ${themeStyles.border}` }}>
                                    <p>Ushbu manbaga fayl biriktirilmagan.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* AUTH & INSTANT PURCHASE MODAL */}
            {showPayModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
                    <div style={{ width: '100%', maxWidth: '440px', background: '#0e1411', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 25px 70px rgba(0,0,0,0.95)', position: 'relative' }}>
                        <button
                            onClick={() => setShowPayModal(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}
                        >
                            ✕
                        </button>

                        {/* STEP 1: PHONE & NAME AUTH */}
                        {authStep === 'phone' && (
                            <div>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(201,168,76,0.15)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>
                                    📱
                                </div>
                                <h3 style={{ fontSize: '18px', color: 'var(--gold)', marginBottom: '6px', fontWeight: '700' }}>
                                    Kitobxon Kirishi
                                </h3>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: '1.5' }}>
                                    Sotib olingan kitob profilingizda doimiy saqlanishi uchun telefon raqamingizni kiriting:
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
                                            style={{ width: '100%', padding: '12px 14px', background: '#080c0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '4px' }}>Ismingiz (Suv belgisi uchun)</label>
                                        <input
                                            type="text"
                                            value={authName}
                                            onChange={e => setAuthName(e.target.value)}
                                            placeholder="Ali Valiyev"
                                            style={{ width: '100%', padding: '12px 14px', background: '#080c0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        style={{ marginTop: '10px', padding: '14px', background: 'var(--gold)', color: '#061d15', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer' }}
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
                                    Xaridor: <strong style={{ color: '#fff' }}>{reader?.fullName || 'Kitobxon'}</strong> ({reader?.phone})
                                </p>

                                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid rgba(201,168,76,0.3)' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--gold)' }}>To'lanadigan summa:</div>
                                    <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>
                                        {book.price?.toLocaleString()} SO'M
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button
                                        onClick={() => handleExecutePayment('CLICK')}
                                        disabled={processingPayment}
                                        style={{ padding: '14px 18px', background: '#008ae6', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <span>🔵 Click orqali to'lash</span>
                                        <span>→</span>
                                    </button>
                                    <button
                                        onClick={() => handleExecutePayment('PAYME')}
                                        disabled={processingPayment}
                                        style={{ padding: '14px 18px', background: '#14b8a6', color: '#061d15', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <span>🟢 Payme orqali to'lash</span>
                                        <span>→</span>
                                    </button>
                                    <button
                                        onClick={() => handleExecutePayment('DEMO')}
                                        disabled={processingPayment}
                                        style={{ padding: '14px 18px', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                                    >
                                        <span>⚡ Tezkor Sinov To'lovi (Demo Test)</span>
                                        <span>✓</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {authStep === 'success' && (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <div style={{ fontSize: '52px', marginBottom: '12px' }}>🎉</div>
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
