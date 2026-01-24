// CMS Content Models
export interface ContentBlock {
    [key: string]: string | ContentBlock;
}

export interface PageContent {
    id: number;
    pageKey: string;
    language: 'en' | 'ar';
    content: ContentBlock;
    updatedAt: Date;
    updatedBy: string;
}

// Product Models
export interface Product {
    id: number;
    name: string;
    nameAr: string;
    category: string;
    description: string;
    descriptionAr: string;
    dosage: string;
    stockStatus: 'available' | 'limited' | 'out_of_stock';
    priceSar: number;
    priceUsd: number;
    image: string;
    isActive: boolean;
    createdAt: Date;
}

export interface DrugInteraction {
    drugId: number;
    drugName: string;
    severity: 'low' | 'moderate' | 'high';
    description: string;
}

// User Models
export interface User {
    id: number;
    email: string;
    name: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    createdAt: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
    expiresIn: number;
}

// Media Models
export interface Media {
    id: number;
    filename: string;
    originalFilename?: string;
    url: string;
    type: 'image' | 'video' | 'document';
    size: number;
    uploadedAt: Date;
}



// Job Models
export interface Job {
    id: number;
    title: string;
    titleAr: string;
    department: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    description: string;
    requirements: string[];
    isActive: boolean;
    createdAt: Date;
}

export interface JobApplication {
    id?: number;
    jobId: number;
    jobTitle?: string;
    name: string;
    email: string;
    phone: string;
    coverLetter: string;
    resumeUrl?: string;
    linkedInUrl?: string;
    status?: 'pending' | 'reviewed' | 'interviewed' | 'hired' | 'rejected';
    createdAt?: Date;
}

// Event Models
export interface Event {
    id: number;
    title: string;
    titleAr: string;
    date: Date;
    type: 'webinar' | 'conference' | 'training';
    description: string;
    registrationUrl: string;
    isActive: boolean;
}

// News Models
export interface NewsArticle {
    id: number;
    title: string;
    titleAr: string;
    excerpt: string;
    excerptAr: string;
    date: string;
    category: string;
    image: string;
    isActive: boolean;
}

// Analytics Models
export interface AnalyticsOverview {
    visitors: { today: number; week: number; month: number };
    pageViews: { today: number; week: number; month: number };
    topPages: { page: string; views: number }[];
    contactStats: { new: number; total: number };
    applicationCount: number;
    totalProducts: number;
    activeJobs: number;
    upcomingEvents: number;
}

// Settings Model
export interface SiteSettings {
    siteName: string;
    contactEmail: string;
    contactPhone: string;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
        youtube?: string;
    };
    whatsappNumber: string;
    defaultLanguage: 'en' | 'ar';
    maintenanceMode: boolean;
    maintenanceMessage?: string;
    logoUrl?: string;
    faviconUrl?: string;
    address?: string;
    addressAr?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}
