import { api, Page, NewsItem, NewsFormData, GalleryItem, ResourceItem, AuthResponse, HistoricalFigure, SiteSetting, FaqItem, ReaderProfile, BookAccessInfo, BookPurchaseItem } from './api';
import { getLocalizedJadids, MOCK_JADIDS } from './mockJadids';

export const normalizeFigure = (item: HistoricalFigure): HistoricalFigure => {
    let timeline = item.timeline || [];
    if ((!timeline || timeline.length === 0) && item.timelineJson) {
        try {
            timeline = JSON.parse(item.timelineJson);
        } catch {}
    }
    let galleryPhotos = item.galleryPhotos || [];
    if ((!galleryPhotos || galleryPhotos.length === 0) && item.galleryPhotosJson) {
        try {
            galleryPhotos = JSON.parse(item.galleryPhotosJson);
        } catch {}
    }
    const name = item.name || item.nameUz || item.nameRu || item.nameEn || '';
    const title = item.title || item.titleUz || item.titleRu || item.titleEn || '';
    const bio = item.bio || item.bioUz || item.bioRu || item.bioEn || '';
    return {
        ...item,
        name,
        title,
        bio,
        timeline,
        galleryPhotos
    };
};

// Auth
export const authService = {
    login: (username: string, password: string) =>
        api.post<AuthResponse>('/api/auth/login', { username, password }),

    setup: (username: string, password: string) =>
        api.post<{ message: string }>('/api/auth/setup', { username, password }),
    getStatus: () =>
        api.get<{ hasAdmin: boolean }>('/api/auth/status'),
};

// News
export const newsService = {
    getAll: (page = 0, size = 10, category?: string, locale = 'uz') => {
        const params = new URLSearchParams({ page: String(page), size: String(size), locale });
        if (category) params.append('category', category);
        return api.get<Page<NewsItem>>(`/api/news?${params}`);
    },

    getBySlug: (slug: string, locale = 'uz') =>
        api.get<NewsItem>(`/api/news/${slug}?locale=${locale}`),

    getAllForAdmin: (page = 0, size = 50) =>
        api.get<Page<NewsItem>>(`/api/news/all?page=${page}&size=${size}`),

    create: (data: NewsFormData) =>
        api.post<NewsItem>('/api/news', data),

    update: (id: number, data: NewsFormData) =>
        api.put<NewsItem>(`/api/news/${id}`, data),

    delete: (id: number) =>
        api.delete<void>(`/api/news/${id}`),
};

// Gallery
export const galleryService = {
    getAll: (page = 0, size = 12, mediaType?: string) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (mediaType) params.append('mediaType', mediaType);
        return api.get<Page<GalleryItem>>(`/api/gallery?${params}`);
    },
    getById: (id: number) =>
        api.get<GalleryItem>(`/api/gallery/${id}`),
    create: (data: { title: string; fileUrl: string; thumbnailUrl: string; description: string; mediaType: string }) =>
        api.post<GalleryItem>('/api/gallery', data),
    update: (id: number, data: { title: string; fileUrl: string; thumbnailUrl: string; description: string; mediaType: string }) =>
        api.put<GalleryItem>(`/api/gallery/${id}`, data),
    delete: (id: number) =>
        api.delete<void>(`/api/gallery/${id}`),
};

// Resources
export const resourceService = {
    getAll: (page = 0, size = 10, type?: string, search?: string) => {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (type) params.append('type', type);
        if (search) params.append('search', search);
        return api.get<Page<ResourceItem>>(`/api/resources?${params}`);
    },
    getById: (id: number) =>
        api.get<ResourceItem>(`/api/resources/${id}`),
    create: (data: Partial<ResourceItem>) =>
        api.post<ResourceItem>('/api/resources', data),
    update: (id: number, data: Partial<ResourceItem>) =>
        api.put<ResourceItem>(`/api/resources/${id}`, data),
    delete: (id: number) =>
        api.delete<void>(`/api/resources/${id}`),
};

// Reader Service (Kitobxon va To'lovlar)
export const readerService = {
    auth: (phone: string, fullName?: string, telegramUsername?: string) =>
        api.post<ReaderProfile>('/api/reader/auth', { phone, fullName, telegramUsername }),

    checkAccess: (resourceId: number, phone?: string) => {
        const params = phone ? `?phone=${encodeURIComponent(phone)}` : '';
        return api.get<BookAccessInfo>(`/api/reader/access/${resourceId}${params}`);
    },

    purchase: (resourceId: number, phone: string, readerName?: string, provider = 'DEMO') =>
        api.post<{ success: boolean; purchaseId: number; amount: number; title: string }>(`/api/reader/purchase/${resourceId}`, { phone, readerName, provider }),

    getMyBooks: (phone: string) =>
        api.get<BookPurchaseItem[]>(`/api/reader/my-books?phone=${encodeURIComponent(phone)}`),
};

// Contact
export const contactService = {
    send: (data: { name: string; phone: string; telegram: string; subject: string; message: string }) =>
        api.post<{ message: string }>('/api/contact', data),
};

// Historical Figures (Jadidlar)
export const figureService = {
    getAll: async (locale = 'uz'): Promise<HistoricalFigure[]> => {
        try {
            const apiData = await api.get<HistoricalFigure[]>(`/api/figures?locale=${locale}`);
            if (apiData && apiData.length > 0) {
                return apiData.map(item => {
                    const normalized = normalizeFigure(item);
                    const mockMatch = MOCK_JADIDS.find(m => m.id === item.id || (item.nameUz && m.nameUz.toLowerCase().includes(item.nameUz.toLowerCase())));
                    if (mockMatch) {
                        return {
                            ...mockMatch,
                            ...normalized,
                            timeline: normalized.timeline && normalized.timeline.length > 0 ? normalized.timeline : mockMatch.timeline,
                            galleryPhotos: normalized.galleryPhotos && normalized.galleryPhotos.length > 0 ? normalized.galleryPhotos : mockMatch.galleryPhotos,
                        };
                    }
                    return normalized;
                });
            }
            return getLocalizedJadids(locale);
        } catch {
            return getLocalizedJadids(locale);
        }
    },

    getById: async (id: number, locale = 'uz'): Promise<HistoricalFigure> => {
        try {
            const apiItem = await api.get<HistoricalFigure>(`/api/figures/${id}?locale=${locale}`);
            if (apiItem) {
                const normalized = normalizeFigure(apiItem);
                const mockMatch = MOCK_JADIDS.find(m => m.id === id || m.id === Number(id));
                if (mockMatch) {
                    return {
                        ...mockMatch,
                        ...normalized,
                        timeline: normalized.timeline && normalized.timeline.length > 0 ? normalized.timeline : mockMatch.timeline,
                        galleryPhotos: normalized.galleryPhotos && normalized.galleryPhotos.length > 0 ? normalized.galleryPhotos : mockMatch.galleryPhotos,
                    };
                }
                return normalized;
            }
            throw new Error("Figure not found");
        } catch {
            const mockMatch = MOCK_JADIDS.find(m => m.id === id || m.id === Number(id)) || MOCK_JADIDS[0];
            const name = locale === 'ru' ? mockMatch.nameRu || mockMatch.nameUz : locale === 'en' ? mockMatch.nameEn || mockMatch.nameUz : mockMatch.nameUz;
            const title = locale === 'ru' ? mockMatch.titleRu || mockMatch.titleUz : locale === 'en' ? mockMatch.titleEn || mockMatch.titleUz : mockMatch.titleUz;
            const bio = locale === 'ru' ? mockMatch.bioRu || mockMatch.bioUz : locale === 'en' ? mockMatch.bioEn || mockMatch.bioUz : mockMatch.bioUz;
            return { ...mockMatch, name, title, bio };
        }
    },

    getAllForAdmin: async (): Promise<HistoricalFigure[]> => {
        const data = await api.get<HistoricalFigure[]>('/api/figures/all');
        return data.map(normalizeFigure);
    },

    create: (data: Omit<HistoricalFigure, 'id' | 'name' | 'title' | 'bio' | 'createdAt'>) =>
        api.post<HistoricalFigure>('/api/figures', data),

    update: (id: number, data: Omit<HistoricalFigure, 'id' | 'name' | 'title' | 'bio' | 'createdAt'>) =>
        api.put<HistoricalFigure>(`/api/figures/${id}`, data),

    delete: (id: number) =>
        api.delete<void>(`/api/figures/${id}`),

    addWork: (figureId: number, data: { title: string; year?: number; pdfUrl: string; sortOrder?: number }) =>
        api.post<any>(`/api/figures/${figureId}/works`, data),

    deleteWork: (workId: number) =>
        api.delete<void>(`/api/figures/works/${workId}`),
};

// Site Settings
export const settingService = {
    get: (locale = 'uz'): Promise<SiteSetting> =>
        api.get<SiteSetting>(`/api/settings?locale=${locale}`),

    update: (data: SiteSetting): Promise<SiteSetting> =>
        api.put<SiteSetting>('/api/settings', data),
};

// FAQ
export const faqService = {
    getAll: (locale = 'uz'): Promise<FaqItem[]> =>
        api.get<FaqItem[]>(`/api/faqs?locale=${locale}`),

    getAllForAdmin: (): Promise<FaqItem[]> =>
        api.get<FaqItem[]>('/api/faqs/all'),

    getById: (id: number): Promise<FaqItem> =>
        api.get<FaqItem>(`/api/faqs/${id}`),

    create: (data: Partial<FaqItem>): Promise<FaqItem> =>
        api.post<FaqItem>('/api/faqs', data),

    update: (id: number, data: Partial<FaqItem>): Promise<FaqItem> =>
        api.put<FaqItem>(`/api/faqs/${id}`, data),

    delete: (id: number): Promise<void> =>
        api.delete<void>(`/api/faqs/${id}`),
};
