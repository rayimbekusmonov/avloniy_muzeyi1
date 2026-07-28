'use client'

import { useTheme } from './ThemeProvider'
import { useLocale } from 'next-intl'

export default function ThemeToggle({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  const { theme, toggleTheme } = useTheme()
  const locale = useLocale()

  const label = theme === 'dark'
    ? (locale === 'ru' ? 'Светлый режим' : locale === 'en' ? 'Light mode' : 'Yorug\' rejim')
    : (locale === 'ru' ? 'Тёмный режим' : locale === 'en' ? 'Dark mode' : 'Tungi rejim')

  return (
    <button
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(201,168,76,0.4)',
        background: 'rgba(201,168,76,0.12)',
        color: '#C9A84C',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        fontWeight: '600',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        ...style
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.25)'
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.12)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {theme === 'dark' ? (
        <>
          {/* Sun Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e4c068" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.4s ease', transform: 'rotate(0deg)' }}>
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <span style={{ display: 'inline-block' }}>Light</span>
        </>
      ) : (
        <>
          {/* Moon Icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.4s ease' }}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span style={{ display: 'inline-block' }}>Dark</span>
        </>
      )}
    </button>
  )
}
