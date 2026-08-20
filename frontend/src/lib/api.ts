const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Token management
export const isTokenExpired = (token: string): boolean => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;

        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const payload = JSON.parse(jsonPayload);
        if (!payload.exp) return false;

        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
};

export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        return null;
    }
    return token;
};

export const setToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
};

export const removeToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Reader (Kitobxon) session management
export const getReaderSession = (): ReaderProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('reader_session');
    if (!data) return null;
    try {
        return JSON.parse(data) as ReaderProfile;
    } catch {
        localStorage.removeItem('reader_session');
        return null;
    }
};

export const setReaderSession = (profile: ReaderProfile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('reader_session', JSON.stringify(profile));
};

export const removeReaderSession = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('reader_session');
};

// Base fetch wrapper
export async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            removeToken();
            if (typeof window !== 'undefined') {
                const path = window.location.pathname;
                if (path.includes('/admin') && !path.endsWith('/admin') && !path.endsWith('/admin/')) {
                    const localeMatch = path.match(/^\/([a-z]{2})\//);
                    const locale = localeMatch ? localeMatch[1] : 'uz';
                    window.location.href = `/${locale}/admin?sessionExpired=true`;
                }
            }
        }
        const error = await response.json().catch(() => ({ message: 'Xato yuz berdi' }));
        throw new Error(error.message || `HTTP error: ${response.status}`);
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}

// HTTP methods
export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint),
    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) =>
        request<T>(endpoint, { method: 'DELETE' }),
};

// Types
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface NewsItem {
    id: number;
    slug: string;
    imageUrl: string;
    galleryPhotosJson?: string;
    galleryPhotos?: Array<{ url: string; caption?: string }>;
    category: 'YANGILIK' | 'TADBIR' | 'FOTOGALEREYA' | 'ELON' | 'KORGAZMA' | 'BAYRAM';
    published: boolean;
    publishedAt: string;
    authorUsername: string;
    createdAt: string;
    updatedAt: string;

    // Locale bo'yicha qaytariladigan maydonlar (frontend uchun)
    title: string;
    content: string;
    excerpt: string;

    // Admin uchun barcha til maydonlari
    titleUz: string;
    contentUz: string;
    excerptUz: string;
    titleRu: string;
    contentRu: string;
    excerptRu: string;
    titleEn: string;
    contentEn: string;
    excerptEn: string;
}

export interface NewsFormData {
    titleUz: string;
    contentUz: string;
    excerptUz?: string;
    titleRu?: string;
    contentRu?: string;
    excerptRu?: string;
    titleEn?: string;
    contentEn?: string;
    excerptEn?: string;
    imageUrl?: string;
    galleryPhotosJson?: string;
    category?: string;
    published?: boolean;
    createdAt?: string;
}

export interface GalleryItem {
    id: number;
    title: string;
    fileUrl: string;
    thumbnailUrl: string;
    description: string;
    mediaType: 'PHOTO' | 'VIDEO' | 'AUDIO';
    createdAt: string;
}

export interface ResourceItem {
    id: number;
    title: string;
    author: string;
    description: string;
    fileUrl: string;
    coverUrl: string;
    resourceType: 'EBOOK' | 'ARTICLE' | 'RESEARCH' | 'DOCUMENT';
    publishedYear: number;
    pageCount: number;
    isPremium?: boolean;
    price?: number;
    previewPagesCount?: number;
    allowDownload?: boolean;
    createdAt: string;
}

export interface ReaderProfile {
    id: number;
    phone: string;
    fullName: string;
    telegramUsername?: string;
    readerToken: string;
}

export interface BookAccessInfo {
    resourceId: number;
    title: string;
    author: string;
    coverUrl?: string;
    fileUrl: string;
    isPremium?: boolean;
    price?: number;
    previewPagesCount?: number;
    allowDownload?: boolean;
    hasFullAccess: boolean;
    reason: 'FREE' | 'PURCHASED' | 'PAYWALL';
}

export interface BookPurchaseItem {
    purchaseId: number;
    purchasedAt: string;
    amount: number;
    resourceId: number;
    title: string;
    author: string;
    coverUrl: string;
    fileUrl: string;
    resourceType: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    role: string;
}

export interface ContactResponse {
    id: number;
    name: string;
    phone: string;
    telegram: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface HistoricalFigure {
    id: number;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    titleUz: string;
    titleRu: string;
    titleEn: string;
    bioUz: string;
    bioRu: string;
    bioEn: string;
    name: string;
    title: string;
    bio: string;
    years: string;
    imageUrl: string;
    works: string;
    pdfUrl: string;
    featured: boolean;
    sortOrder: number;
    createdAt: string;
    region?: string; // e.g. "Toshkent", "Samarqand", "Buxoro", "Farg'ona"
    category?: string; // e.g. "Ta'lim", "Matbuot", "Adabiyot", "Teatr"
    quote?: string;
    timelineJson?: string;
    galleryPhotosJson?: string;
    timeline?: { year: string; title: string; desc: string }[];
    galleryPhotos?: { title: string; url: string }[];
    figureWorks?: {
        id: number;
        title: string;
        year: number | null;
        pdfUrl: string;
        sortOrder: number;
    }[];
}

export interface HeroQuoteItem {
    text: string;
    author: string;
    role: string;
}

export interface FooterLinkItem {
    id: string;
    labelUz: string;
    labelRu?: string;
    labelEn?: string;
    href: string;
}

export interface SiteSetting {
    id?: number;
    museumNameUz?: string;
    museumNameRu?: string;
    museumNameEn?: string;
    phone?: string;
    email?: string;
    telegram?: string;
    addressUz?: string;
    addressRu?: string;
    addressEn?: string;
    workingHoursUz?: string;
    workingHoursRu?: string;
    workingHoursEn?: string;
    telegramUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    facebookUrl?: string;
    statsExhibits?: string;
    statsFigures?: string;
    statsResources?: string;
    statsPhotos?: string;
    heroTitleUz?: string;
    heroTitleRu?: string;
    heroTitleEn?: string;
    heroSubtitleUz?: string;
    heroSubtitleRu?: string;
    heroSubtitleEn?: string;
    quoteTextUz?: string;
    quoteTextRu?: string;
    quoteTextEn?: string;
    heroQuotesJson?: string;
    heroQuotes?: HeroQuoteItem[];
    // Footer fields
    footerTaglineUz?: string;
    footerTaglineRu?: string;
    footerTaglineEn?: string;
    footerCopyrightUz?: string;
    footerCopyrightRu?: string;
    footerCopyrightEn?: string;
    footerLinksJson?: string;
    footerLinks?: FooterLinkItem[];
    // Telegram Bot Notifications
    telegramBotToken?: string;
    telegramChatId?: string;
    telegramNotificationsEnabled?: boolean;
    // Localized fields for UI
    museumName?: string;
    address?: string;
    workingHours?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    quoteText?: string;
    footerTagline?: string;
    footerCopyright?: string;
}

export interface FaqItem {
    id: number;
    questionUz: string;
    questionRu: string;
    questionEn: string;
    answerUz: string;
    answerRu: string;
    answerEn: string;
    question: string;
    answer: string;
    category: string;
    sortOrder: number;
    createdAt?: string;
}