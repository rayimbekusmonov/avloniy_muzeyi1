'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isAuthenticated, removeToken } from '@/lib/api'

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const checkAuth = () => {
            if (!pathname) return
            const isAdminRoute = pathname.includes('/admin')
            const isLoginPage = pathname.endsWith('/admin') || pathname.endsWith('/admin/')

            if (isAdminRoute && !isLoginPage) {
                if (!isAuthenticated()) {
                    removeToken()
                    const localeMatch = pathname.match(/^\/([a-z]{2})\//)
                    const locale = localeMatch ? localeMatch[1] : 'uz'
                    router.push(`/${locale}/admin?sessionExpired=true`)
                }
            }
        }

        // 1. Sahifa ochilganda yoki marshrut o'zgarganda tekshirish
        checkAuth()

        // 2. Foydalanuvchi boshqa tabdan qaytganda (masalan kechadan beri qolgan bo'lsa) darhol tekshirish
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkAuth()
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)

        // 3. Har 30 soniyada tekshirib turish
        const interval = setInterval(checkAuth, 30000)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            clearInterval(interval)
        }
    }, [pathname, router])

    return <>{children}</>
}
