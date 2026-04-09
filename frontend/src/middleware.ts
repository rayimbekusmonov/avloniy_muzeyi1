// frontend/src/middleware.ts
import createMiddleware from 'next-intl/middleware';

// Faqat til (locale) middleware — admin bloklanmaydi.
// Admin sahifaning o'zi token tekshiradi va token noto'g'ri bo'lsa 404 ko'rsatadi.
export default createMiddleware({
    locales: ['uz', 'ru', 'en'],
    defaultLocale: 'uz',
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};