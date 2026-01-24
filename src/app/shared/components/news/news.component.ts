import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';
import { NewsService } from '../../../core/services/news.service';
import { NewsArticle } from '../../../core/models/cms.models';

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-news',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'news.label' | translate }}</span>
                    <h1>{{ 'news.hero.title' | translate }}</h1>
                    <p>{{ 'news.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- News Grid -->
            <!-- News Grid -->
            @defer (on viewport) {
            <section class="news-section">
                <div class="container">
                    @if (loading()) {
                        <div class="loading-state">
                            <div class="spinner"></div>
                            <p>{{ 'common.loading' | translate }}</p>
                        </div>
                    } @else {
                        <div class="news-grid">
                            @for (item of news(); track item.id) {
                                <article class="news-card fade-in">
                                    <div class="news-image">
                                        <img [src]="item.image || 'assets/placeholder.png'" alt="" loading="lazy" />
                                        <span class="category">{{ getCategoryLabel(item.category) | translate }}</span>
                                    </div>
                                    <div class="news-content">
                                        <span class="date">{{ item.date }}</span>
                                        <h3>{{ item.title }}</h3>
                                        <p>{{ item.excerpt }}</p>
                                        <a href="#" class="read-more">{{ 'common.readMore' | translate }} →</a>
                                    </div>
                                </article>
                            }
                        </div>

                        @if (news().length === 0) {
                            <div class="empty-state">
                                <p>{{ 'news.noArticles' | translate }}</p>
                            </div>
                        }
                    }
                </div>
            </section>
            } @placeholder {
                <section class="news-section" style="min-height: 400px"></section>
            }

            <!-- Newsletter -->
            <!-- Newsletter -->
            @defer (on viewport) {
            <section class="newsletter-section">
                <div class="container">
                    <div class="newsletter-card fade-in">
                        <div class="content">
                            <h2>{{ 'news.newsletter.title' | translate }}</h2>
                            <p>{{ 'news.newsletter.subtitle' | translate }}</p>
                        </div>
                        <form class="newsletter-form">
                            <input type="email" [placeholder]="'news.newsletter.placeholder' | translate" />
                            <button type="submit">{{ 'news.newsletter.button' | translate }}</button>
                        </form>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="newsletter-section" style="min-height: 300px"></section>
            }
        </main>

        <app-footer />
    `,
    styles: [`
        .page-content { padding-top: 80px; }
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

        .hero-section {
            background: linear-gradient(135deg, #0F172A, #1E293B);
            color: white;
            padding: 100px 0;
            text-align: center;
        }

        .hero-section .label {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(14, 165, 233, 0.2);
            color: #0EA5E9;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .hero-section h1 { font-size: 48px; font-weight: 800; margin-bottom: 20px; }
        .hero-section p { font-size: 20px; color: #94A3B8; }

        .news-section { padding: 100px 0; background: #F8FAFC; min-height: 400px; }
        .news-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
        }

        .news-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #E2E8F0;
            transition: transform 0.3s;
        }

        .news-card:hover { transform: translateY(-8px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

        .news-image {
            height: 240px;
            background: #F1F5F9;
            position: relative;
        }

        .news-image img { width: 100%; height: 100%; object-fit: cover; }
        
        .news-image .category {
            position: absolute; top: 20px; left: 20px;
            background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px);
            padding: 6px 12px; border-radius: 50px;
            font-size: 12px; font-weight: 600; color: #0EA5E9;
        }

        .news-content { padding: 30px; }
        .news-content .date { font-size: 13px; color: #94A3B8; display: block; margin-bottom: 12px; }
        .news-content h3 { font-size: 20px; color: #1E293B; margin-bottom: 12px; line-height: 1.4; }
        .news-content p { color: #64748B; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
        
        .read-more {
            color: #0EA5E9; text-decoration: none; font-weight: 600; font-size: 14px;
            display: inline-flex; align-items: center; transition: gap 0.2s;
        }
        .read-more:hover { gap: 4px; }

        .newsletter-section { padding-bottom: 100px; background: #F8FAFC; }
        .newsletter-card {
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            border-radius: 24px; padding: 60px;
            text-align: center; color: white;
            display: flex; flex-direction: column; align-items: center; gap: 40px;
            box-shadow: 0 20px 40px rgba(14, 165, 233, 0.2);
        }

        .newsletter-card h2 { font-size: 32px; margin-bottom: 12px; }
        .newsletter-card p { font-size: 18px; opacity: 0.9; }

        .newsletter-form {
            display: flex; gap: 12px; width: 100%; max-width: 500px;
            background: rgba(255, 255, 255, 0.1); padding: 8px; border-radius: 50px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .newsletter-form input {
            flex: 1; background: transparent; border: none; padding: 0 24px;
            color: white; font-size: 16px; outline: none;
        }
        .newsletter-form input::placeholder { color: rgba(255, 255, 255, 0.8); }

        .newsletter-form button {
            background: white; color: #0EA5E9; border: none; padding: 14px 32px;
            border-radius: 40px; font-weight: 600; cursor: pointer; transition: transform 0.2s;
        }
        .newsletter-form button:hover { transform: scale(1.05); }

        .loading-state, .empty-state {
            text-align: center;
            padding: 60px 0;
            color: #64748B;
        }

        .spinner {
            width: 40px; height: 40px;
            border: 3px solid #E2E8F0;
            border-top-color: #0EA5E9;
            border-radius: 50%;
            margin: 0 auto 20px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
            .news-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
            .news-grid { grid-template-columns: 1fr; }
            .newsletter-form { flex-direction: column; background: transparent; padding: 0; border: none; }
            .newsletter-form input { background: rgba(255, 255, 255, 0.1); padding: 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); }
            .newsletter-form button { width: 100%; }
            .hero-section h1 { font-size: 36px; }
        }
    `]
})
export class NewsComponent implements OnInit {
    private readonly newsService = inject(NewsService);

    news = signal<NewsArticle[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.newsService.getAllNews().subscribe({
            next: (data) => {
                this.news.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading news:', err);
                this.loading.set(false);
            }
        });
    }

    getCategoryLabel(category: string): string {
        // Only return the key if it's a translation key, otherwise return as is
        if (category.startsWith('news.categories.')) {
            return category;
        }
        // Fallback for simple strings (though standardizing is better)
        return category;
    }
}
