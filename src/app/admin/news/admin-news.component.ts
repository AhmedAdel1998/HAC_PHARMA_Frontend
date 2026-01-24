import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { DatePipe, NgClass, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NewsService } from '../../core/services/news.service';
import { NewsArticle } from '../../core/models/cms.models';

@Component({
    selector: 'app-admin-news',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, NgClass, ReactiveFormsModule, CommonModule],
    template: `
        <div class="news-container">
            <div class="page-header">
                <div class="header-left">
                    <h1>News & Articles</h1>
                    <p>Manage news articles and press releases</p>
                </div>
                <button class="btn-primary" (click)="openNewsModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add News
                </button>
            </div>

            @if (loading()) {
                <div class="loading">Loading news articles...</div>
            } @else {
                <div class="news-grid">
                    @for (article of news(); track article.id) {
                        <div class="news-card">
                            <div class="news-image">
                                @if (article.image) {
                                    <img [src]="article.image" alt="" />
                                } @else {
                                    <div class="placeholder-image">📰</div>
                                }
                            </div>
                            <div class="news-info">
                                <div class="news-meta">
                                    <span class="badge" [ngClass]="getCategoryClass(article.category)">
                                        {{ getCategoryLabel(article.category) }}
                                    </span>
                                    <span class="date">{{ article.date | date:'mediumDate' }}</span>
                                </div>
                                <h3>{{ article.title }}</h3>
                                <p class="excerpt">{{ article.excerpt }}</p>
                                @if (article.titleAr) {
                                    <p class="arabic-preview" dir="rtl">{{ article.titleAr }}</p>
                                }
                            </div>
                            <div class="news-actions">
                                <button class="btn-icon" (click)="editNews(article)" title="Edit">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </button>
                                <button class="btn-icon danger" (click)="deleteNews(article)" title="Delete">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    }
                </div>
                
                @if (news().length === 0) {
                    <div class="empty-state">
                        <div class="empty-icon">📰</div>
                        <h3>No News Articles</h3>
                        <p>Start by adding your first news article.</p>
                    </div>
                }
            }
        </div>

        <!-- News Modal -->
        @if (showNewsModal()) {
            <div class="modal-backdrop" (click)="closeNewsModal()">
                <div class="modal" (click)="$event.stopPropagation()">
                    <div class="modal-header">
                        <h2>{{ editingNews() ? 'Edit News' : 'Add News' }}</h2>
                        <button class="btn-close" (click)="closeNewsModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <form [formGroup]="newsForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Title (English) *</label>
                                    <input type="text" formControlName="title" placeholder="e.g. New Partnership Announcement" />
                                </div>
                                <div class="form-group">
                                    <label>Title (Arabic)</label>
                                    <input type="text" formControlName="titleAr" placeholder="e.g. إعلان شراكة جديدة" dir="rtl" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Excerpt (English) *</label>
                                <textarea formControlName="excerpt" rows="3" placeholder="Brief summary of the news article..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Excerpt (Arabic)</label>
                                <textarea formControlName="excerptAr" rows="3" placeholder="ملخص مختصر للمقال..." dir="rtl"></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Publish Date *</label>
                                    <input type="date" formControlName="date" />
                                </div>
                                <div class="form-group">
                                    <label>Category *</label>
                                    <select formControlName="category">
                                        <option value="news.categories.company">Company</option>
                                        <option value="news.categories.product">Product Launch</option>
                                        <option value="news.categories.csr">CSR</option>
                                        <option value="news.categories.financial">Financial</option>
                                        <option value="news.categories.events">Events</option>
                                        <option value="news.categories.operations">Operations</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Image URL</label>
                                <input type="url" formControlName="image" placeholder="https://..." />
                            </div>
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" formControlName="isActive" />
                                    Active (visible on website)
                                </label>
                            </div>
                            @if (formError()) {
                                <div class="form-error">{{ formError() }}</div>
                            }
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" (click)="closeNewsModal()">Cancel</button>
                        <button class="btn-primary save-btn" (click)="saveNews()" [disabled]="saving()">
                            {{ buttonText() }}
                        </button>
                    </div>
                </div>
            </div>
        }
    `,
    styles: [`
        .news-container { max-width: 1200px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; font-weight: 700; color: var(--text-primary, #1E293B); margin-bottom: 4px; }
        .page-header p { color: var(--text-muted, #64748B); font-size: 14px; }

        .btn-primary {
            display: inline-flex; align-items: center; gap: 8px; justify-content: center;
            padding: 10px 20px; background: #0EA5E9; color: white;
            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
            min-width: 100px; font-size: 14px; transition: background 0.2s;
        }
        .btn-primary:hover { background: #0284C7; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .save-btn { 
            display: inline-block !important; 
            color: white !important; 
            font-size: 14px !important; 
            line-height: 1.5 !important;
            min-width: 120px;
        }
        .btn-secondary {
            padding: 10px 20px; background: var(--bg-tertiary, #F1F5F9); color: var(--text-secondary, #475569);
            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
        }
        .btn-secondary:hover { background: var(--bg-hover, #E2E8F0); }

        .loading, .empty-state { text-align: center; padding: 60px; color: var(--text-muted, #64748B); }
        .empty-state .empty-icon { font-size: 64px; margin-bottom: 16px; }
        .empty-state h3 { font-size: 20px; color: var(--text-primary, #1E293B); margin-bottom: 8px; }

        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
        
        .news-card {
            background: var(--bg-card, white); border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;
            border: 1px solid var(--border-light, #E2E8F0);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .news-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        
        .news-image {
            height: 160px; background: var(--bg-tertiary, #F1F5F9);
            display: flex; align-items: center; justify-content: center;
            overflow: hidden;
        }
        .news-image img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder-image { font-size: 48px; opacity: 0.5; }

        .news-info { padding: 20px; }
        .news-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .news-info h3 { font-size: 18px; font-weight: 600; color: var(--text-primary, #1E293B); margin-bottom: 8px; line-height: 1.4; }
        .news-info .excerpt { font-size: 14px; color: var(--text-muted, #64748B); line-height: 1.5; margin-bottom: 8px; }
        .news-info .arabic-preview { font-size: 13px; color: var(--text-muted, #94A3B8); font-style: italic; }
        .news-info .date { font-size: 12px; color: var(--text-muted, #94A3B8); }

        .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .badge.company { background: #DBEAFE; color: #1D4ED8; }
        .badge.product { background: #D1FAE5; color: #059669; }
        .badge.csr { background: #FEF3C7; color: #D97706; }
        .badge.financial { background: #E0E7FF; color: #4338CA; }
        .badge.events { background: #FCE7F3; color: #DB2777; }
        .badge.operations { background: #F3E8FF; color: #7C3AED; }

        .news-actions { display: flex; gap: 8px; padding: 0 20px 20px; }
        .btn-icon { 
            padding: 8px; border: none; background: var(--bg-tertiary, #F1F5F9); 
            border-radius: 8px; cursor: pointer; color: var(--text-muted, #64748B);
            transition: all 0.2s;
        }
        .btn-icon:hover { background: var(--bg-hover, #E2E8F0); color: #0EA5E9; }
        .btn-icon.danger:hover { background: #FEE2E2; color: #DC2626; }

        /* Modal Styles */
        .modal-backdrop {
            position: fixed; inset: 0; background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000; backdrop-filter: blur(4px);
        }
        .modal {
            background: var(--bg-card, white); border-radius: 16px; width: 100%; max-width: 600px;
            max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        }
        .modal-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 24px; border-bottom: 1px solid var(--border-light, #E2E8F0);
        }
        .modal-header h2 { font-size: 20px; font-weight: 700; color: var(--text-primary, #1E293B); margin: 0; }
        .btn-close {
            width: 32px; height: 32px; border: none; background: var(--bg-tertiary, #F1F5F9);
            border-radius: 8px; font-size: 20px; cursor: pointer; color: var(--text-muted, #64748B);
        }
        .modal-body { padding: 24px; }
        .modal-footer {
            display: flex; justify-content: flex-end; gap: 12px;
            padding: 20px 24px; border-top: 1px solid var(--border-light, #E2E8F0); 
            background: var(--bg-tertiary, #F8FAFC);
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 14px; font-weight: 600; color: var(--text-secondary, #374151); margin-bottom: 6px; }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%; padding: 10px 12px; border: 1px solid var(--border-light, #D1D5DB);
            border-radius: 8px; font-size: 14px; transition: border-color 0.2s;
            background: var(--bg-input, white); color: var(--text-primary, #1E293B);
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none; border-color: #0EA5E9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
        }
        .checkbox-group { display: flex; align-items: center; }
        .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 0; }
        .checkbox-group input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
        .form-error { background: #FEE2E2; color: #DC2626; padding: 12px; border-radius: 8px; margin-top: 16px; font-size: 14px; }

        @media (max-width: 768px) {
            .news-grid { grid-template-columns: 1fr; }
            .form-row { grid-template-columns: 1fr; }
        }
    `]
})
export class AdminNewsComponent implements OnInit {
    private readonly newsService = inject(NewsService);
    private readonly fb = inject(FormBuilder);

    news = signal<NewsArticle[]>([]);
    loading = signal(true);

    // Modal state
    showNewsModal = signal(false);
    editingNews = signal<NewsArticle | null>(null);
    saving = signal(false);
    formError = signal<string | null>(null);

    // Form Group
    newsForm: FormGroup;

    // Computed
    buttonText = computed(() => {
        if (this.saving()) return 'Saving...';
        return this.editingNews() ? 'Update News' : 'Add News';
    });

    // Category mappings
    private categoryLabels: Record<string, string> = {
        'news.categories.company': 'Company',
        'news.categories.product': 'Product Launch',
        'news.categories.csr': 'CSR',
        'news.categories.financial': 'Financial',
        'news.categories.events': 'Events',
        'news.categories.operations': 'Operations'
    };

    constructor() {
        this.newsForm = this.fb.group({
            title: ['', Validators.required],
            titleAr: [''],
            excerpt: ['', Validators.required],
            excerptAr: [''],
            date: ['', Validators.required],
            category: ['news.categories.company', Validators.required],
            image: [''],
            isActive: [true]
        });
    }

    ngOnInit() {
        this.loadNews();
    }

    loadNews() {
        this.newsService.getAllNews().subscribe({
            next: (data) => {
                this.news.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load news', err);
                this.news.set([]);
                this.loading.set(false);
            }
        });
    }

    getCategoryClass(category: string): string {
        const key = category.split('.').pop() || 'company';
        return key;
    }

    getCategoryLabel(category: string): string {
        return this.categoryLabels[category] || category;
    }

    deleteNews(article: NewsArticle) {
        if (confirm(`Delete news "${article.title}"?`)) {
            this.newsService.deleteNews(article.id).subscribe({
                next: () => this.loadNews(),
                error: (err) => console.error(err)
            });
        }
    }

    openNewsModal(article?: NewsArticle) {
        this.formError.set(null);
        if (article) {
            this.editingNews.set(article);
            this.newsForm.patchValue({
                title: article.title,
                titleAr: article.titleAr || '',
                excerpt: article.excerpt,
                excerptAr: article.excerptAr || '',
                date: article.date,
                category: article.category,
                image: article.image || '',
                isActive: article.isActive
            });
        } else {
            this.editingNews.set(null);
            this.newsForm.reset({
                title: '',
                titleAr: '',
                excerpt: '',
                excerptAr: '',
                date: new Date().toISOString().split('T')[0],
                category: 'news.categories.company',
                image: '',
                isActive: true
            });
        }
        this.showNewsModal.set(true);
    }

    editNews(article: NewsArticle) {
        this.openNewsModal(article);
    }

    closeNewsModal() {
        this.showNewsModal.set(false);
        this.editingNews.set(null);
        this.formError.set(null);
    }

    saveNews() {
        if (this.newsForm.invalid) {
            this.formError.set('Please fill in all required fields');
            return;
        }

        this.saving.set(true);
        this.formError.set(null);

        const formValue = this.newsForm.value;
        const newsData: Partial<NewsArticle> = {
            title: formValue.title.trim(),
            titleAr: formValue.titleAr?.trim() || '',
            excerpt: formValue.excerpt.trim(),
            excerptAr: formValue.excerptAr?.trim() || '',
            date: formValue.date,
            category: formValue.category,
            image: formValue.image?.trim() || '',
            isActive: formValue.isActive
        };

        const editing = this.editingNews();
        const request = editing
            ? this.newsService.updateNews(editing.id, newsData)
            : this.newsService.createNews(newsData);

        request.subscribe({
            next: () => {
                this.saving.set(false);
                this.closeNewsModal();
                this.loadNews();
            },
            error: (err) => {
                this.saving.set(false);
                console.error('Failed to save news', err);
                this.formError.set(err.error?.message || 'Failed to save news. Please try again.');
            }
        });
    }
}
