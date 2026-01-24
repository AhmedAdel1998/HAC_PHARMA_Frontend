import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, tap, shareReplay } from 'rxjs';

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
export class CmsService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/translations';

  // Cache for translations
  private translationsCache: Map<string, Observable<Record<string, any>>> = new Map();

  /**
   * Get all translations for a language
   * Used by the translation loader
   */
  getTranslations(lang: string): Observable<Record<string, any>> {
    const cacheKey = `all_${lang}`;
    
    if (!this.translationsCache.has(cacheKey)) {
      const request = this.http.get<Record<string, any>>(`${this.API_URL}/${lang}`).pipe(
        catchError(error => {
          console.error(`Failed to load translations for ${lang}:`, error);
          // Return empty object on error - fallback to static files will be handled by loader
          return of({});
        }),
        shareReplay(1)
      );
      this.translationsCache.set(cacheKey, request);
    }
    
    return this.translationsCache.get(cacheKey)!;
  }

  /**
   * Get translations for a specific page
   */
  getPageTranslations(pageKey: string, lang: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.API_URL}/${pageKey}/${lang}`);
  }

  /**
   * Update translations for a specific page (Admin only)
   */
  updatePageTranslations(pageKey: string, lang: string, translations: Record<string, any>): Observable<any> {
    // Clear cache when updating
    this.translationsCache.clear();
    return this.http.put(`${this.API_URL}/${pageKey}/${lang}`, translations);
  }

  /**
   * Get list of all editable pages (Admin only)
   */
  getPages(): Observable<PageInfo[]> {
    return this.http.get<PageInfo[]>(`${this.API_URL}/pages`);
  }

  /**
   * Check if translations are initialized in database
   */
  getStatus(): Observable<{ initialized: boolean; message: string }> {
    return this.http.get<{ initialized: boolean; message: string }>(`${this.API_URL}/status`);
  }

  /**
   * Seed translations from JSON data (Admin only)
   */
  seedTranslations(lang: string, translations: Record<string, any>): Observable<any> {
    return this.http.post(`${this.API_URL}/seed/${lang}`, translations);
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.translationsCache.clear();
  }
}
