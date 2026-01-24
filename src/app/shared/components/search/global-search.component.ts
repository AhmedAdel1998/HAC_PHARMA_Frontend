import { Component, ChangeDetectionStrategy, signal, inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface SearchResult {
    title: string;
    description: string;
    route: string;
    category: 'page' | 'product' | 'service' | 'blog';
}

@Component({
    selector: 'app-global-search',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslateModule],
    template: `
        @if (isOpen()) {
            <div class="search-overlay" (click)="close()">
                <div class="search-modal" (click)="$event.stopPropagation()">
                    <div class="search-header">
                        <div class="search-input-wrapper">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input 
                                type="text"
                                [(ngModel)]="query"
                                (ngModelChange)="search($event)"
                                [placeholder]="'common.search' | translate"
                                autofocus
                            />
                            @if (query) {
                                <button class="clear-btn" (click)="clearSearch()">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            }
                        </div>
                        <button class="close-btn" (click)="close()">
                            <kbd>ESC</kbd>
                        </button>
                    </div>

                    <div class="search-body">
                        @if (!query) {
                            <div class="recent-searches">
                                <h4>{{ 'searchComponent.quickLinks' | translate }}</h4>
                                <div class="quick-links">
                                    <button (click)="navigate('/products')">
                                        <span class="icon">💊</span>
                                        {{ 'common.products' | translate }}
                                    </button>
                                    <button (click)="navigate('/services')">
                                        <span class="icon">🔬</span>
                                        {{ 'common.services' | translate }}
                                    </button>
                                    <button (click)="navigate('/about')">
                                        <span class="icon">ℹ️</span>
                                        {{ 'common.about' | translate }}
                                    </button>
                                    <button (click)="navigate('/contact')">
                                        <span class="icon">📞</span>
                                        {{ 'common.contact' | translate }}
                                    </button>
                                </div>
                            </div>
                        } @else if (results().length > 0) {
                            <div class="search-results">
                                @for (result of results(); track result.route) {
                                    <button class="result-item" (click)="navigate(result.route)">
                                        <span class="result-category">{{ result.category }}</span>
                                        <h5>{{ result.title | translate }}</h5>
                                        <p>{{ result.description | translate }}</p>
                                    </button>
                                }
                            </div>
                        } @else {
                            <div class="no-results">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <line x1="8" y1="8" x2="14" y2="14" />
                                    <line x1="14" y1="8" x2="8" y2="14" />
                                </svg>
                                <p>{{ 'searchComponent.noResults' | translate }} "{{ query }}"</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        }
    `,
    styles: [`
        .search-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 9999;
            display: flex;
            justify-content: center;
            padding-top: 100px;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .search-modal {
            width: 100%;
            max-width: 640px;
            max-height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            animation: slideDown 0.3s ease;
        }

        :host-context(body.dark-theme) .search-modal {
            background: #1E293B;
        }

        @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .search-header {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            border-bottom: 1px solid #E2E8F0;
        }

        :host-context(body.dark-theme) .search-header {
            border-color: #334155;
        }

        .search-input-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #64748B;
        }

        .search-input-wrapper input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 16px;
            background: transparent;
            color: #1E293B;
        }

        :host-context(body.dark-theme) .search-input-wrapper input {
            color: #F1F5F9;
        }

        .search-input-wrapper input::placeholder {
            color: #94A3B8;
        }

        .clear-btn, .close-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            color: #64748B;
            padding: 4px;
            display: flex;
            align-items: center;
            transition: color 0.2s;
        }

        .clear-btn:hover, .close-btn:hover {
            color: #1E293B;
        }

        :host-context(body.dark-theme) .clear-btn:hover,
        :host-context(body.dark-theme) .close-btn:hover {
            color: #F1F5F9;
        }

        .close-btn kbd {
            font-size: 11px;
            padding: 2px 6px;
            background: #F1F5F9;
            border-radius: 4px;
            border: 1px solid #E2E8F0;
        }

        :host-context(body.dark-theme) .close-btn kbd {
            background: #334155;
            border-color: #475569;
            color: #94A3B8;
        }

        .search-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .recent-searches h4 {
            font-size: 12px;
            font-weight: 600;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }

        .quick-links {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        .quick-links button {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            color: #1E293B;
            text-align: left;
        }

        :host-context(body.dark-theme) .quick-links button {
            background: #334155;
            border-color: #475569;
            color: #F1F5F9;
        }

        .quick-links button:hover {
            border-color: #0EA5E9;
            background: rgba(14, 165, 233, 0.05);
        }

        .quick-links .icon {
            font-size: 20px;
        }

        .search-results {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .result-item {
            width: 100%;
            padding: 16px;
            background: transparent;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
        }

        :host-context(body.dark-theme) .result-item {
            border-color: #334155;
        }

        .result-item:hover {
            border-color: #0EA5E9;
            background: rgba(14, 165, 233, 0.05);
        }

        .result-category {
            display: inline-block;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            color: #0EA5E9;
            background: rgba(14, 165, 233, 0.1);
            padding: 2px 8px;
            border-radius: 4px;
            margin-bottom: 8px;
        }

        .result-item h5 {
            font-size: 15px;
            font-weight: 600;
            color: #1E293B;
            margin-bottom: 4px;
        }

        :host-context(body.dark-theme) .result-item h5 {
            color: #F1F5F9;
        }

        .result-item p {
            font-size: 13px;
            color: #64748B;
            line-height: 1.4;
        }

        .no-results {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: #94A3B8;
            text-align: center;
        }

        .no-results svg {
            margin-bottom: 16px;
            opacity: 0.5;
        }
    `],
    host: {
        '(document:keydown.escape)': 'close()',
        '(document:keydown.control.k)': 'handleShortcut($event)',
        '(document:keydown.meta.k)': 'handleShortcut($event)'
    }
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);

    isOpen = signal(false);
    query = '';
    results = signal<SearchResult[]>([]);

    // Searchable content - using translation keys
    private readonly searchableContent: SearchResult[] = [
        { title: 'common.products', description: 'products.hero.subtitle', route: '/products', category: 'page' },
        { title: 'common.services', description: 'services.pageSubtitle', route: '/services', category: 'page' },
        { title: 'common.about', description: 'about.missionText', route: '/about', category: 'page' },
        { title: 'common.contact', description: 'contact.subtitle', route: '/contact', category: 'page' },
        { title: 'common.careers', description: 'careers.hero.subtitle', route: '/careers', category: 'page' },
        { title: 'common.partners', description: 'partnersPage.hero.subtitle', route: '/partners', category: 'page' },
        { title: 'common.team', description: 'team.hero.subtitle', route: '/team', category: 'page' },
        { title: 'common.news', description: 'news.hero.subtitle', route: '/news', category: 'page' },
        { title: 'common.faq', description: 'faq.hero.subtitle', route: '/faq', category: 'page' },
        // Products would ideally be dynamic, but for now we map categories
        { title: 'products.categories.onco', description: 'products.hero.subtitle', route: '/products', category: 'product' },
        { title: 'products.categories.cardio', description: 'products.hero.subtitle', route: '/products', category: 'product' },
        { title: 'products.categories.neuro', description: 'products.hero.subtitle', route: '/products', category: 'product' },
        // Services
        { title: 'services.list.0.title', description: 'services.list.0.description', route: '/services', category: 'service' },
        { title: 'services.list.1.title', description: 'services.list.1.description', route: '/services', category: 'service' },
        { title: 'services.list.2.title', description: 'services.list.2.description', route: '/services', category: 'service' },
    ];

    ngOnInit(): void {
        // Component is initialized, keyboard shortcuts are handled via host listeners
    }

    ngOnDestroy(): void {
        // Cleanup if needed
    }

    handleShortcut(event: Event): void {
        event.preventDefault();
        this.open();
    }

    open(): void {
        this.isOpen.set(true);
        if (isPlatformBrowser(this.platformId)) {
            document.body.style.overflow = 'hidden';
        }
    }

    close(): void {
        this.isOpen.set(false);
        this.query = '';
        this.results.set([]);
        if (isPlatformBrowser(this.platformId)) {
            document.body.style.overflow = '';
        }
    }

    search(query: string): void {
        if (!query.trim()) {
            this.results.set([]);
            return;
        }

        const lowerQuery = query.toLowerCase();

        // We need to search against translated values
        // This is a simple implementation; ideally we'd have a search service
        const results = this.searchableContent.filter(item => {
            const translatedTitle = (this.translate.instant(item.title) as string).toLowerCase();
            const translatedDesc = (this.translate.instant(item.description) as string).toLowerCase();

            return translatedTitle.includes(lowerQuery) || translatedDesc.includes(lowerQuery);
        });

        this.results.set(results);
    }

    clearSearch(): void {
        this.query = '';
        this.results.set([]);
    }

    navigate(route: string): void {
        this.close();
        this.router.navigate([route]);
    }
}
