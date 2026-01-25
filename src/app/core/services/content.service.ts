import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { PageContent, ContentBlock } from '../models/cms.models';
import { AuthService } from './auth.service';

import { environment } from '../../../environments/environment';

export interface PageInfo {
    key: string;
    name: string;
    nameAr: string;
    description: string;
    hasEnglish: boolean;
    hasArabic: boolean;
    lastUpdated?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    private readonly CONTENT_API = `${environment.apiUrl}/content`;
    private readonly TRANSLATIONS_API = `${environment.apiUrl}/translations`;

    // Get content for a page (legacy API)
    getPageContent(pageKey: string, lang: string): Observable<PageContent> {
        return this.http.get<PageContent>(`${this.CONTENT_API}/${pageKey}/${lang}`);
    }

    // Update content (admin only) - legacy API
    updatePageContent(pageKey: string, lang: string, content: ContentBlock): Observable<PageContent> {
        return this.http.put<PageContent>(
            `${this.CONTENT_API}/${pageKey}/${lang}`,
            { content }
        );
    }

    // Get all page keys (legacy)
    getPageKeys(): Observable<string[]> {
        return this.http.get<string[]>(`${this.CONTENT_API}/pages`);
    }

    // ========== TRANSLATIONS API ==========

    // Get translations for a specific page
    getPageTranslations(pageKey: string, lang: string): Observable<Record<string, any>> {
        return this.http.get<Record<string, any>>(`${this.TRANSLATIONS_API}/${pageKey}/${lang}`).pipe(
            catchError(() => of({}))
        );
    }

    // Update translations for a page (admin only)
    updatePageTranslations(pageKey: string, lang: string, translations: Record<string, any>): Observable<any> {
        return this.http.put(
            `${this.TRANSLATIONS_API}/${pageKey}/${lang}`,
            translations
        );
    }

    // Get list of all editable pages
    getPages(): Observable<PageInfo[]> {
        return this.http.get<PageInfo[]>(`${this.TRANSLATIONS_API}/pages`).pipe(
            catchError(() => of([]))
        );
    }

    // Seed translations from JSON
    seedTranslations(lang: string, translations: Record<string, any>): Observable<any> {
        return this.http.post(
            `${this.TRANSLATIONS_API}/seed/${lang}`,
            translations
        );
    }

    // Get translation status
    getTranslationStatus(): Observable<{ initialized: boolean; message: string }> {
        return this.http.get<{ initialized: boolean; message: string }>(`${this.TRANSLATIONS_API}/status`);
    }
}
