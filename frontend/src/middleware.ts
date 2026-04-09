// frontend/src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
    locales: ['uz', 'ru', 'en'],
    defaultLocale: 'uz',
});

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Eski /admin yo'llarini bloklash — 404 sahifaga yo'naltirish
    // /uz/admin, /ru/admin, /en/admin, /admin — barchasi bloklanadi
    const adminPathPattern = /^(\/(?:uz|ru|en))?\/admin(\/|$)/;

    // Yangi secret-based admin yo'lini ruxsat berish
    // /uz/avloniy-panel, /ru/avloniy-panel, /en/avloniy-panel
    const newAdminPattern = /^(\/(?:uz|ru|en))?\/avloniy-panel(\/|$)/;

    // Agar eski /admin yo'li bo'lsa va yangi yo'l EMAS bo'lsa — 404
    if (adminPathPattern.test(pathname) && !newAdminPattern.test(pathname)) {
        // 404 sahifasiga yo'naltirish
        const url = request.nextUrl.clone();
        url.pathname = '/not-found';
        return NextResponse.rewrite(url);
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};