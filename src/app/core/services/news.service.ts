import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map, of, switchMap, catchError } from 'rxjs';
import { NewsArticle } from '../models/cms.models';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);

    /**
     * Get all news articles from both English and Arabic translation files
     * Merges data from both files
     */
    getNews(): Observable<NewsArticle[]> {
        return this.http.get<any>('/assets/i18n/en.json').pipe(
            map(data => {
                const newsList = data?.news?.list || [];
                return newsList.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    titleAr: '', // Will be filled from ar.json
                    excerpt: item.excerpt,
                    excerptAr: '',
                    date: item.date,
                    category: item.category,
                    image: item.image || '',
                    isActive: item.isActive !== false
                }));
            }),
            switchMap(enNews => {
                return this.http.get<any>('/assets/i18n/ar.json').pipe(
                    map(arData => {
                        const arNewsList = arData?.news?.list || [];
                        return enNews.map((enItem: NewsArticle) => {
                            const arItem = arNewsList.find((ar: any) => ar.id === enItem.id);
                            return {
                                ...enItem,
                                titleAr: arItem?.title || enItem.title,
                                excerptAr: arItem?.excerpt || enItem.excerpt
                            };
                        });
                    }),
                    catchError(() => of(enNews))
                );
            }),
            catchError(() => of([]))
        );
    }

    /**
     * Create a new news article
     * Updates both en.json and ar.json translation files via API
     */
    createNews(news: Partial<NewsArticle>): Observable<NewsArticle> {
        // Generate a new ID
        return this.getNews().pipe(
            map(existingNews => {
                const maxId = existingNews.reduce((max, n) => Math.max(max, n.id), 0);
                return {
                    id: maxId + 1,
                    title: news.title || '',
                    titleAr: news.titleAr || '',
                    excerpt: news.excerpt || '',
                    excerptAr: news.excerptAr || '',
                    date: news.date || new Date().toISOString().split('T')[0],
                    category: news.category || 'news.categories.company',
                    image: news.image || '',
                    isActive: news.isActive !== false
                } as NewsArticle;
            }),
            switchMap(newArticle => {
                // For now, we'll store in localStorage as a simple solution
                // A proper backend API would persist this to the database
                if (isPlatformBrowser(this.platformId)) {
                    const stored = localStorage.getItem('hacpharma_news') || '[]';
                    const articles = JSON.parse(stored);
                    articles.push(newArticle);
                    localStorage.setItem('hacpharma_news', JSON.stringify(articles));
                }
                return of(newArticle);
            })
        );
    }

    /**
     * Update an existing news article
     */
    updateNews(id: number, news: Partial<NewsArticle>): Observable<NewsArticle> {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem('hacpharma_news') || '[]';
            const articles: NewsArticle[] = JSON.parse(stored);
            const index = articles.findIndex(a => a.id === id);

            if (index !== -1) {
                articles[index] = { ...articles[index], ...news };
                localStorage.setItem('hacpharma_news', JSON.stringify(articles));
                return of(articles[index]);
            }
        }

        // If not in localStorage, create a copy with updates
        return this.getNews().pipe(
            map(allNews => {
                const original = allNews.find(n => n.id === id);
                const updated = { ...original, ...news } as NewsArticle;

                if (isPlatformBrowser(this.platformId)) {
                    const freshStored = localStorage.getItem('hacpharma_news') || '[]';
                    const freshArticles: NewsArticle[] = JSON.parse(freshStored);
                    freshArticles.push(updated);
                    localStorage.setItem('hacpharma_news', JSON.stringify(freshArticles));
                }
                return updated;
            })
        );
    }

    /**
     * Delete a news article
     */
    deleteNews(id: number): Observable<void> {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem('hacpharma_news') || '[]';
            const articles: NewsArticle[] = JSON.parse(stored);
            const filtered = articles.filter(a => a.id !== id);
            localStorage.setItem('hacpharma_news', JSON.stringify(filtered));

            // Also track deleted IDs from the translation files
            const deletedIds = JSON.parse(localStorage.getItem('hacpharma_deleted_news') || '[]');
            if (!deletedIds.includes(id)) {
                deletedIds.push(id);
                localStorage.setItem('hacpharma_deleted_news', JSON.stringify(deletedIds));
            }
        }

        return of(void 0);
    }

    /**
     * Get all news (merged from translation files and localStorage)
     */
    getAllNews(): Observable<NewsArticle[]> {
        return this.getNews().pipe(
            map(translationNews => {
                let localNews: NewsArticle[] = [];
                let deletedIds: number[] = [];

                if (isPlatformBrowser(this.platformId)) {
                    const stored = localStorage.getItem('hacpharma_news') || '[]';
                    localNews = JSON.parse(stored);
                    deletedIds = JSON.parse(localStorage.getItem('hacpharma_deleted_news') || '[]');
                }

                // Merge: translation news + local news, excluding deleted
                const mergedMap = new Map<number, NewsArticle>();

                translationNews.forEach(n => {
                    if (!deletedIds.includes(n.id)) {
                        mergedMap.set(n.id, n);
                    }
                });

                localNews.forEach(n => {
                    if (!deletedIds.includes(n.id)) {
                        mergedMap.set(n.id, n);
                    }
                });

                return Array.from(mergedMap.values()).sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            })
        );
    }
}
