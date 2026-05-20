export interface WorkItem {
    id: number;
    workType: 'OWN_WORK' | 'ABOUT_WORK';
    title: string;
    description?: string;
    year?: number;
    pdfUrl?: string;
    sortOrder: number;
}

export interface HistoricalFigure {
    id: number;
    name: string;
    title?: string;
    region?: string;
    motto?: string;
    bio: string;
    years: string;
    imageUrl?: string;
    featured: boolean;
    sortOrder: number;
    createdAt: string;
    figureWorks: WorkItem[];
}