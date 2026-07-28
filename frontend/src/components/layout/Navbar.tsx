'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import ThemeToggle from '@/components/theme/ThemeToggle'

// Modern Vector SVG Country Flag Icons (100% Cross-Platform Compatible for Windows, iOS, Android, Mac, Linux)
const FlagUZ = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
        <rect width="32" height="32" fill="#0099B5"/>
        <rect y="10.5" width="32" height="11" fill="#FFFFFF"/>
        <rect y="21" width="32" height="11" fill="#1EB53A"/>
        <rect y="10" width="32" height="1" fill="#CE1126"/>
        <rect y="21" width="32" height="1" fill="#CE1126"/>
        <circle cx="7" cy="5.5" r="3" fill="#FFFFFF"/>
        <circle cx="8" cy="5.5" r="2.5" fill="#0099B5"/>
    </svg>
)

const FlagRU = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
        <rect width="32" height="10.6" fill="#FFFFFF"/>
        <rect y="10.6" width="32" height="10.7" fill="#0039A6"/>
        <rect y="21.3" width="32" height="10.7" fill="#D52B1E"/>
    </svg>
)

const FlagEN = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" style={{ borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
        <rect width="32" height="32" fill="#00247D"/>
        <path d="M0 0 L32 32 M32 0 L0 32" stroke="#FFFFFF" strokeWidth="4"/>
        <path d="M0 0 L32 32 M32 0 L0 32" stroke="#CF142B" strokeWidth="2"/>
        <path d="M16 0 V32 M0 16 H32" stroke="#FFFFFF" strokeWidth="6"/>
        <path d="M16 0 V32 M0 16 H32" stroke="#CF142B" strokeWidth="3.5"/>
    </svg>
)

const LANGUAGES = [
    { code: 'uz', name: "O'zbekcha", flagComponent: <FlagUZ />, short: 'UZ' },
    { code: 'ru', name: 'Русский', flagComponent: <FlagRU />, short: 'RU' },
    { code: 'en', name: 'English', flagComponent: <FlagEN />, short: 'EN' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [langDropdownOpen, setLangDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const pathname = usePathname()
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations('nav')

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setLangDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const changeLocale = (newLocale: string) => {
        const segments = pathname.split('/')
        segments[1] = newLocale
        router.push(segments.join('/'))
        setLangDropdownOpen(false)
        setMenuOpen(false)
    }

    const currentLang = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0]

    const jadidlarLabel = locale === 'ru' ? 'Джадиды' : locale === 'en' ? 'Jadids' : 'Jadidlar'
    const historyLabel = locale === 'ru' ? 'История движения' : locale === 'en' ? 'History' : 'Harakat Tarixi'
    const libraryLabel = locale === 'ru' ? 'Библиотека' : locale === 'en' ? 'Library' : 'Kutubxona'

    const navLinks = [
        { href: `/${locale}`, label: t('home') },
        { href: `/${locale}/jadidlar`, label: jadidlarLabel },
        { href: `/${locale}/about`, label: historyLabel },
        { href: `/${locale}/resources`, label: libraryLabel },
        { href: `/${locale}/gallery`, label: t('gallery') },
        { href: `/${locale}/news`, label: t('news') },
        { href: `/${locale}/faq`, label: t('faq') },
        { href: `/${locale}/contact`, label: t('contact') },
    ]

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            transition: 'all 0.4s ease',
            background: scrolled
                ? 'rgba(6, 29, 21, 0.97)'
                : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
            padding: scrolled ? '10px 0' : '16px 0',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo */}
                <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minWidth: 0, flexShrink: 1 }}>
                    <div className="brand-logo-wrapper" style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '2px solid #C9A84C',
                        boxShadow: '0 0 16px rgba(201,168,76,0.4)',
                        background: '#060d17',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Image
                            src="/logo.png"
                            alt="O'zbekiston Jadidlari Logo"
                            width={64}
                            height={64}
                            style={{
                                objectFit: 'cover',
                                transform: 'scale(1.4)',
                                transformOrigin: 'center center'
                            }}
                        />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div className="brand-title" style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: '800',
                            fontSize: '17px',
                            color: '#fff',
                            lineHeight: 1.1,
                            letterSpacing: '0.4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>O&apos;zbekiston Jadidlari</div>
                        <div className="brand-subtitle" style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: '#C9A84C',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>Ma&apos;rifat Portali</div>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="nav-links">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '15px',
                                fontWeight: '500',
                                color: pathname === link.href ? '#C9A84C' : 'rgba(255,255,255,0.85)',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                transition: 'all 0.2s',
                                background: pathname === link.href ? 'rgba(201,168,76,0.12)' : 'transparent',
                                borderBottom: pathname === link.href ? '2px solid #C9A84C' : '2px solid transparent',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Action Bar: Theme Toggle + SVG Flag Language Dropdown + Mobile Burger */}
                <div className="nav-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    
                    {/* Theme Toggle Button */}
                    <ThemeToggle />

                    {/* LANGUAGE DROPDOWN (Stays on main bar on mobile) */}
                    <div ref={dropdownRef} style={{ position: 'relative' }} className="locale-dropdown">
                        <button
                            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                            className="lang-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: '1px solid rgba(201,168,76,0.4)',
                                background: 'rgba(201,168,76,0.15)',
                                color: '#C9A84C',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                flexShrink: 0
                            }}
                        >
                            {currentLang.flagComponent}
                            <span className="lang-code-text">{currentLang.short}</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s ease', transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {langDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                width: '155px',
                                background: 'rgba(6,29,21,0.98)',
                                border: '1px solid rgba(201,168,76,0.35)',
                                borderRadius: '10px',
                                padding: '6px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(16px)',
                                zIndex: 1100,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                            }}>
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLocale(lang.code)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: locale === lang.code ? 'rgba(201,168,76,0.2)' : 'transparent',
                                            color: locale === lang.code ? '#C9A84C' : 'rgba(255,255,255,0.85)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '13px',
                                            fontWeight: locale === lang.code ? '700' : '500',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={e => {
                                            if (locale !== lang.code) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                                                e.currentTarget.style.color = '#fff'
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (locale !== lang.code) {
                                                e.currentTarget.style.background = 'transparent'
                                                e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {lang.flagComponent}
                                            <span>{lang.name}</span>
                                        </div>
                                        {locale === lang.code && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Toggle Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="burger-btn"
                        style={{
                            display: 'none',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '8px',
                            background: 'rgba(201,168,76,0.12)',
                            border: '1px solid rgba(201,168,76,0.3)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            width: '40px',
                            height: '36px',
                            flexShrink: 0
                        }}
                        aria-label="Toggle navigation menu"
                    >
                        <span style={{
                            display: 'block',
                            width: '20px',
                            height: '2px',
                            background: '#C9A84C',
                            borderRadius: '2px',
                            transition: 'all 0.3s',
                            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                        }} />
                        <span style={{
                            display: 'block',
                            width: '20px',
                            height: '2px',
                            background: '#C9A84C',
                            borderRadius: '2px',
                            opacity: menuOpen ? 0 : 1,
                            transition: 'all 0.3s'
                        }} />
                        <span style={{
                            display: 'block',
                            width: '20px',
                            height: '2px',
                            background: '#C9A84C',
                            borderRadius: '2px',
                            transition: 'all 0.3s',
                            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
                        }} />
                    </button>
                </div>
            </div>

            {/* Mobile Hamburger Menu Drawer */}
            {menuOpen && (
                <div style={{
                    background: 'rgba(6,29,21,0.98)',
                    borderTop: '1px solid rgba(201,168,76,0.25)',
                    padding: '16px 20px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    maxHeight: 'calc(100vh - 70px)',
                    overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    display: 'block',
                                    padding: '12px 14px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '17px',
                                    fontWeight: pathname === link.href ? '700' : '500',
                                    color: pathname === link.href ? '#C9A84C' : 'rgba(255,255,255,0.9)',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '6px',
                                    background: pathname === link.href ? 'rgba(201,168,76,0.12)' : 'transparent',
                                    textDecoration: 'none',
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}