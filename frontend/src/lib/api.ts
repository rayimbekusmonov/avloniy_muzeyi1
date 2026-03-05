const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Token management
export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Base fetch wrapper
async function request<T>(
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
        const error = await response.json().catch(() => ({ message: 'Xato yuz berdi' }));
        throw new Error(error.message || `HTTP error: ${response.status}`);
    }

    // 204 No Content
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
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    imageUrl: string;
    category: 'KORGAZMA' | 'TADBIR' | 'YANGILIK' | 'BAYRAM';
    published: boolean;
    publishedAt: string;
    authorUsername: string;
    createdAt: string;
    updatedAt: string;
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
    resourceType: 'EBOOK' | 'ARTICLE' | 'RESEARCH';
    publishedYear: number;
    pageCount: number;
    createdAt: string;
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
