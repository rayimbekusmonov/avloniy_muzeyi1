'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const locale = useLocale()
    const t = useTranslations('nav')

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const changeLocale = (newLocale: string) => {
        const segments = pathname.split('/')
        segments[1] = newLocale
        router.push(segments.join('/'))
    }

    const navLinks = [
        { href: `/${locale}`, label: t('home') },
        { href: `/${locale}/about`, label: t('about') },
        { href: `/${locale}/gallery`, label: t('gallery') },
        { href: `/${locale}/resources`, label: t('resources') },
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
                ? 'rgba(17, 37, 72, 0.97)'
                : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
            padding: scrolled ? '10px 0' : '16px 0',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo */}
                <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '2px solid rgba(201,168,76,0.4)',
                        background: '#fff',
                    }}>
                        <Image
                            src="/logo.jpg"
                            alt="Avloniy Muzeyi Logo"
                            width={48}
                            height={48}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </div>
                    <div>
                        <div style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: '700',
                            fontSize: '16px',
                            color: '#fff',
                            lineHeight: 1.1,
                        }}>Abdulla Avloniy</div>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: 'rgba(201,168,76,0.8)',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                        }}>Muzeyi</div>
                    </div>
                </Link>

                {/* Desktop Links */}
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

                {/* Locale switcher + Mobile burger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Locale switcher */}
                    <div style={{ display: 'flex', gap: '4px' }} className="locale-switcher">
                        {['uz', 'ru', 'en'].map(loc => (
                            <button
                                key={loc}
                                onClick={() => changeLocale(loc)}
                                style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid',
                                    borderColor: locale === loc ? '#C9A84C' : 'rgba(255,255,255,0.15)',
                                    background: locale === loc ? 'rgba(201,168,76,0.15)' : 'transparent',
                                    color: locale === loc ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>

                    {/* Mobile burger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="burger-btn"
                        style={{
                            display: 'none',
                            flexDirection: 'column',
                            gap: '5px',
                            padding: '8px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {[0, 1, 2].map(i => (
                            <span key={i} style={{
                                display: 'block',
                                width: '24px',
                                height: '2px',
                                background: '#C9A84C',
                                borderRadius: '2px',
                                transition: 'all 0.3s',
                            }} />
                        ))}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    background: 'rgba(17,37,72,0.98)',
                    borderTop: '1px solid rgba(201,168,76,0.2)',
                    padding: '20px 24px',
                }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                display: 'block',
                                padding: '12px 0',
                                fontFamily: 'var(--font-body)',
                                fontSize: '17px',
                                color: pathname === link.href ? '#C9A84C' : 'rgba(255,255,255,0.85)',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                textDecoration: 'none',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {/* Mobile locale switcher */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                        {['uz', 'ru', 'en'].map(loc => (
                            <button
                                key={loc}
                                onClick={() => { changeLocale(loc); setMenuOpen(false) }}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid',
                                    borderColor: locale === loc ? '#C9A84C' : 'rgba(255,255,255,0.15)',
                                    background: locale === loc ? 'rgba(201,168,76,0.15)' : 'transparent',
                                    color: locale === loc ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}