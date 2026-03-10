import { api, Page, NewsItem, NewsFormData, GalleryItem, ResourceItem, AuthResponse } from './api';

// Auth
export const authService = {
    login: (username: string, password: string) =>
        api.post<AuthResponse>('/api/auth/login', { username, password }),
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

    // Admin: barcha til maydonlari bilan
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