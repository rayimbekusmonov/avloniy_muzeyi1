import { api, Page, NewsItem, NewsFormData, GalleryItem, ResourceItem, AuthResponse, HistoricalFigure } from './api';

// Auth
export const authService = {
    login: (username: string, password: string) =>
        api.post<AuthResponse>('/api/auth/login', { username, password }),

    setup: (username: string, password: string) =>
        api.post<{ message: string }>('/api/auth/setup', { username, password }),
};

// News
export const newsService = {
    // Frontend: locale parametr bilan (uz/ru/en)
    getAll: (page = 0, size = 10, category?: string, locale = 'uz') => {
        const params = new URLSearchParams({ page: String(page), size: String(size), locale });
        if (category) params.append('category', category);
        return api.get<Page<NewsItem>>(`/api/news?${params}`);
    },

    getBySlug: (slug: string, locale = 'uz') =>
        api.get<NewsItem>(`/api/news/${slug}?locale=${locale}`),

    // Admin: barcha til maydonlari bilan — TO'G'RI ENDPOINT!
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
    create: (data: { title: string; author: string; description: string; fileUrl: string; coverUrl: string; resourceType: string; publishedYear: number; pageCount: number }) =>
        api.post<ResourceItem>('/api/resources', data),
    update: (id: number, data: { title: string; author: string; description: string; fileUrl: string; coverUrl: string; resourceType: string; publishedYear: number; pageCount: number }) =>
        api.put<ResourceItem>(`/api/resources/${id}`, data),
    delete: (id: number) =>
        api.delete<void>(`/api/resources/${id}`),
};

export const contactService = {
    send: (data: { name: string; phone: string; telegram: string; subject: string; message: string }) =>
        api.post<{ message: string }>('/api/contact', data),
};

export const figureService = {
    // Frontend uchun: Tanlangan til (locale) bo'yicha ma'lumotlarni olish
    getAll: (locale = 'uz') =>
        api.get<HistoricalFigure[]>(`/api/figures?locale=${locale}`),

    getById: (id: number, locale = 'uz') =>
        api.get<HistoricalFigure>(`/api/figures/${id}?locale=${locale}`),

    // Admin panel uchun: Barcha tillardagi maydonlar bilan birga olish
    getAllForAdmin: () =>
        api.get<HistoricalFigure[]>('/api/figures/all'),

    // Yangi jadid yaratish (Request DTO ga mos maydonlar bilan)
    create: (data: {
        nameUz: string; nameRu?: string; nameEn?: string;
        titleUz?: string; titleRu?: string; titleEn?: string;
        regionUz?: string; regionRu?: string; regionEn?: string;
        mottoUz?: string; mottoRu?: string; mottoEn?: string;
        bioUz: string; bioRu?: string; bioEn?: string;
        years: string; imageUrl?: string;
        featured?: boolean; sortOrder?: number;
    }) =>
        api.post<HistoricalFigure>('/api/figures', data),

    // Jadid ma'lumotlarini yangilash
    update: (id: number, data: {
        nameUz: string; nameRu?: string; nameEn?: string;
        titleUz?: string; titleRu?: string; titleEn?: string;
        regionUz?: string; regionRu?: string; regionEn?: string;
        mottoUz?: string; mottoRu?: string; mottoEn?: string;
        bioUz: string; bioRu?: string; bioEn?: string;
        years: string; imageUrl?: string;
        featured?: boolean; sortOrder?: number;
    }) =>
        api.put<HistoricalFigure>(`/api/figures/${id}`, data),

    // Jadidni o'chirish
    delete: (id: number) =>
        api.delete<void>(`/api/figures/${id}`),

    // --- JADID ASARLARI (WORKS) BILAN ISHLASH ---

    // Jadidning barcha asarlarini olish
    getWorks: (figureId: number, locale = 'uz') =>
        api.get<HistoricalFigure['figureWorks']>(`/api/figures/${figureId}/works?locale=${locale}`),

    // Yangi asar qo'shish (Toifa ajratilgan: OWN_WORK / ABOUT_WORK)
    addWork: (figureId: number, data: {
        workType: 'OWN_WORK' | 'ABOUT_WORK';
        titleUz: string; titleRu?: string; titleEn?: string;
        descriptionUz?: string; descriptionRu?: string; descriptionEn?: string;
        year?: number; pdfUrl?: string; sortOrder?: number;
    }) =>
        api.post<any>(`/api/figures/${figureId}/works`, data),

    // Asarni o'chirish
    deleteWork: (workId: number) =>
        api.delete<void>(`/api/figures/works/${workId}`),
};

