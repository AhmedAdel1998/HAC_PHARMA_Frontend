import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of, catchError, switchMap, map, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Custom translation loader that fetches translations from the backend API
 * Falls back to static JSON files if API fails, and merges them if API succeeds but has missing keys.
 */
export class CmsTranslateLoader implements TranslateLoader {
    constructor(
        private http: HttpClient,
        private apiUrl: string = `${environment.apiUrl}/translations`,
        private staticPath: string = '/assets/i18n'
    ) { }

    getTranslation(lang: string): Observable<any> {
        // During SSR, return empty object to avoid HTTP calls
        if (typeof window === 'undefined') {
            return of({});
        }

        // Always load static files as base
        const static$ = this.loadFromStatic(lang);

        // Check API status
        const apiStatus$ = this.http.get<{ initialized: boolean }>(`${this.apiUrl}/status`).pipe(
            catchError(() => of({ initialized: false }))
        );

        return forkJoin([static$, apiStatus$]).pipe(
            switchMap(([staticData, status]) => {
                if (status.initialized) {
                    // Load from API and merge with static
                    return this.loadFromApi(lang).pipe(
                        map(apiData => this.deepMerge(staticData, apiData)),
                        catchError(error => {
                            console.warn(`API translations failed for ${lang}, using static only:`, error);
                            return of(staticData);
                        })
                    );
                } else {
                    // Use static only
                    return of(staticData);
                }
            })
        );
    }

    private loadFromApi(lang: string): Observable<any> {
        return this.http.get<Record<string, any>>(`${this.apiUrl}/${lang}`);
    }

    private loadFromStatic(lang: string): Observable<any> {
        return this.http.get(`${this.staticPath}/${lang}.json`).pipe(
            catchError(error => {
                console.error(`Failed to load static translations for ${lang}:`, error);
                return of({});
            })
        );
    }

    private deepMerge(target: any, source: any): any {
        if (!source) return target;
        if (!target) return source;

        const output = { ...target };

        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
                    output[key] = this.deepMerge(target[key], source[key]);
                } else {
                    output[key] = source[key];
                }
            } else {
                output[key] = source[key];
            }
        });

        return output;
    }
}

/**
 * Factory function to create the CMS translate loader
 */
export function cmsTranslateLoaderFactory(http: HttpClient): TranslateLoader {
    return new CmsTranslateLoader(http);
}
