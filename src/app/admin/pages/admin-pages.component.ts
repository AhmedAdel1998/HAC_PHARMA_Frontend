import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ContentService, PageInfo } from '../../core/services/content.service';

@Component({
    selector: 'app-admin-pages',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    template: `
        <div class="pages-container">
            <div class="page-header">
                <div class="header-content">
                    <div>
                        <h1>📄 Page Management</h1>
                        <p>Edit content for all website pages in English and Arabic</p>
                    </div>
                    <button class="btn-sync" (click)="syncTranslations()" [disabled]="syncing() || loading()">
                        @if (syncing()) {
                            <span class="spinner"></span> Syncing...
                        } @else {
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                <path d="M3 3v5h5"/>
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                                <path d="M16 21h5v-5"/>
                            </svg>
                            Sync from Files
                        }
                    </button>
                </div>
            </div>

            @if (loading()) {
                <div class="loading">Loading pages...</div>
            } @else {
                <div class="groups-container">
                    @for (group of groupedPages(); track group.title) {
                        <div class="group-section">
                            <div class="group-header">
                                <h2>{{ group.title }}</h2>
                                <p>{{ group.description }}</p>
                            </div>
                            
                            <div class="pages-grid">
                                @for (page of group.pages; track page.key) {
                                    <div class="page-card">
                                        <div class="page-info">
                                            <h3>{{ page.name }}</h3>
                                            <p class="name-ar">{{ page.nameAr }}</p>
                                            <p class="description">{{ page.description }}</p>
                                            <div class="status-badges">
                                                <span class="badge" [class.active]="page.hasEnglish">EN</span>
                                                <span class="badge" [class.active]="page.hasArabic">AR</span>
                                            </div>
                                        </div>
                                        <div class="page-actions">
                                            <a [routerLink]="['/admin/pages', page.key, 'edit']" [queryParams]="{lang: 'en'}" class="btn-edit">
                                                Edit English
                                            </a>
                                            <a [routerLink]="['/admin/pages', page.key, 'edit']" [queryParams]="{lang: 'ar'}" class="btn-edit ar">
                                                Edit العربية
                                            </a>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    `,
    styles: [`
        .pages-container {
            max-width: 1200px;
        }

        .page-header {
            margin-bottom: 32px;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
        }

        .page-header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1E293B;
            margin-bottom: 8px;
        }

        .page-header p {
            color: #64748B;
        }

        .btn-sync {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: #F1F5F9;
            color: #475569;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-sync:hover:not(:disabled) {
            background: white;
            border-color: #CBD5E1;
            color: #334155;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .btn-sync:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid rgba(71, 85, 105, 0.3);
            border-radius: 50%;
            border-top-color: #475569;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .loading {
            text-align: center;
            padding: 60px;
            color: #64748B;
        }

        /* Group Styles */
        .groups-container {
            display: flex;
            flex-direction: column;
            gap: 40px;
        }

        .group-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .group-header h2 {
            font-size: 20px;
            font-weight: 700;
            color: #0F172A;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .group-header h2::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 20px;
            background: #0EA5E9;
            border-radius: 4px;
        }

        .group-header p {
            font-size: 14px;
            color: #64748B;
            margin-left: 14px;
        }

        .pages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        .page-card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid #F1F5F9;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .page-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            border-color: #E2E8F0;
        }

        .page-info h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1E293B;
            margin-bottom: 4px;
        }

        .page-info .name-ar {
            font-size: 14px;
            color: #64748B;
            margin-bottom: 8px;
            font-family: 'Noto Sans Arabic', sans-serif;
        }

        .page-info .description {
            font-size: 13px;
            color: #94A3B8;
            margin-bottom: 12px;
            line-height: 1.5;
        }

        .status-badges {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
        }

        .badge {
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 600;
            border-radius: 50px;
            background: #F1F5F9;
            color: #94A3B8;
        }

        .badge.active {
            background: #E0F2FE;
            color: #0369A1;
        }

        /* Update Arabic badge color */
        .badge.active + .badge.active {
            background: #DCFCE7;
            color: #15803D;
        }

        .page-actions {
            display: flex;
            gap: 10px;
        }

        .btn-edit {
            flex: 1;
            padding: 10px;
            text-align: center;
            background: white;
            color: #0EA5E9;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .btn-edit:hover {
            background: #0EA5E9;
            color: white;
            border-color: #0EA5E9;
        }

        .btn-edit.ar {
            color: #10B981;
        }

        .btn-edit.ar:hover {
            background: #10B981;
            color: white;
            border-color: #10B981;
        }

    `]
})
export class AdminPagesComponent implements OnInit {
    private readonly contentService = inject(ContentService);

    private readonly http = inject(HttpClient); // Inject HttpClient

    // structured groups for better organization
    readonly PAGE_GROUPS = [
        {
            title: 'Global Settings',
            description: 'Content that appears across the entire site',
            keys: ['common', 'header', 'footer', 'theme', 'accessibility']
        },
        {
            title: 'Home Page Sections',
            description: 'Sections visible on the landing page',
            keys: ['hero', 'home_stats', 'foundation', 'customers', 'roadmap', 'testimonials', 'case_studies']
        },
        {
            title: 'Main Pages',
            description: 'Primary website pages',
            keys: ['about', 'services', 'products', 'blog', 'news', 'partners', 'team', 'careers', 'contact', 'scheduler']
        },
        {
            title: 'Legal & Support',
            description: 'Support resources and legal documents',
            keys: ['faq', 'privacy', 'downloads', 'portal', 'chat']
        }
    ];

    pages = signal<PageInfo[]>([]);

    // Grouped pages computed signal
    groupedPages = computed(() => {
        const allPages = this.pages();
        const groups = this.PAGE_GROUPS.map(group => ({
            ...group,
            pages: allPages.filter(p => group.keys.includes(p.key))
        }));

        // Find pages that didn't fit in any group
        const usedKeys = new Set(this.PAGE_GROUPS.flatMap(g => g.keys));
        const otherPages = allPages.filter(p => !usedKeys.has(p.key));

        if (otherPages.length > 0) {
            groups.push({
                title: 'Other Sections',
                description: 'Miscellaneous content sections',
                keys: [],
                pages: otherPages
            });
        }

        return groups.filter(g => g.pages.length > 0);
    });

    loading = signal(true);
    syncing = signal(false);

    ngOnInit(): void {
        this.loadPages();
    }

    loadPages(): void {
        this.loading.set(true);
        this.contentService.getPages().subscribe({
            next: (data) => {
                this.pages.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load pages', err);
                this.loading.set(false);
            }
        });
    }

    syncTranslations(): void {
        if (confirm('This will populate the database with translations from the static JSON files. Continue?')) {
            this.syncing.set(true);

            // Sync English
            this.http.get<any>('/assets/i18n/en.json').subscribe({
                next: (enData) => {
                    this.contentService.seedTranslations('en', enData).subscribe({
                        next: () => {
                            // Sync Arabic
                            this.http.get<any>('/assets/i18n/ar.json').subscribe({
                                next: (arData) => {
                                    this.contentService.seedTranslations('ar', arData).subscribe({
                                        next: () => {
                                            alert('Translations synced successfully!');
                                            this.syncing.set(false);
                                            this.loadPages(); // Reload to see changes
                                        },
                                        error: () => this.handleSyncError('Arabic')
                                    });
                                },
                                error: () => this.handleSyncError('Arabic JSON')
                            });
                        },
                        error: () => this.handleSyncError('English')
                    });
                },
                error: () => this.handleSyncError('English JSON')
            });
        }
    }

    private handleSyncError(stage: string): void {
        alert(`Failed to sync ${stage}. Please check console for details.`);
        this.syncing.set(false);
    }
}

