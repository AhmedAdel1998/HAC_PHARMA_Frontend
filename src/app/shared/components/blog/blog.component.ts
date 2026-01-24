import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: Date | string;
    readTime: number;
}

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-blog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, RouterLink, DatePipe, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'blog.label' | translate }}</span>
                    <h1>{{ 'blog.hero.title' | translate }}</h1>
                    <p>{{ 'blog.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <div class="container content-grid">
                <!-- Blog Listing -->
                @defer (on viewport) {
                <div class="blog-list">
                    @if (featuredPost(); as post) {
                        <div class="featured-post fade-in">
                            <div class="post-image">
                                <img [src]="post.image || 'assets/blog/featured.jpg'" alt="" loading="lazy" />
                            </div>
                            <div class="post-content">
                                <span class="featured-badge">{{ 'blog.featured' | translate }}</span>
                                <div class="post-meta">
                                    <span class="category">{{ post.category | translate }}</span>
                                    <span class="date">{{ post.date | date:'mediumDate' }}</span>
                                </div>
                                <h2>{{ post.title | translate }}</h2>
                                <p>{{ post.excerpt | translate }}</p>
                                <a [routerLink]="['/blog', post.id]" class="read-more">{{ 'common.readMore' | translate }}</a>
                            </div>
                        </div>
                    }

                    <div class="recent-posts-grid">
                        @for (post of recentPosts(); track post.id) {
                            <div class="blog-card fade-in">
                                <div class="card-image">
                                    <img [src]="post.image || 'assets/placeholder.png'" alt="" loading="lazy" />
                                </div>
                                <div class="card-content">
                                    <div class="post-meta">
                                        <span class="category">{{ post.category | translate }}</span>
                                        <span class="read-time">{{ post.readTime }} {{ 'blog.readTime' | translate }}</span>
                                    </div>
                                    <h3>{{ post.title | translate }}</h3>
                                    <p>{{ post.excerpt | translate }}</p>
                                    <a [routerLink]="['/blog', post.id]" class="read-more">{{ 'common.readMore' | translate }} →</a>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                } @placeholder {
                    <div class="blog-list" style="min-height: 800px"></div>
                }

                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="widget">
                        <h3>{{ 'blog.categories.all' | translate }}</h3>
                        <ul class="categories-list">
                            @for (cat of categories; track cat) {
                                <li>
                                    <a href="javascript:void(0)">{{ cat | translate }}</a>
                                </li>
                            }
                        </ul>
                    </div>

                    <div class="widget newsletter-widget">
                        <h3>{{ 'news.newsletter.title' | translate }}</h3>
                        <p>{{ 'news.newsletter.subtitle' | translate }}</p>
                    </div>
                </aside>
            </div>
        </main>

        <app-footer />
    `,
    styles: [`
        .page-content { padding-top: 80px; padding-bottom: 100px; }
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
        
        .hero-section {
            text-align: center;
            padding: 80px 0;
            background: linear-gradient(135deg, #0F172A, #1E293B);
            color: white;
            margin-bottom: 60px;
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

        .hero-section h1 { font-size: 48px; margin-bottom: 16px; }
        .hero-section p { color: #94A3B8; font-size: 20px; }

        .content-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 60px;
        }

        .featured-post {
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            margin-bottom: 60px;
            border: 1px solid #E2E8F0;
        }

        .post-image { height: 400px; background: #F1F5F9; }
        .post-image img { width: 100%; height: 100%; object-fit: cover; }

        .post-content { padding: 40px; }
        .featured-badge {
            display: inline-block;
            padding: 6px 12px;
            background: #0EA5E9;
            color: white;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 16px;
        }

        .post-meta {
            display: flex;
            gap: 16px;
            color: #64748B;
            font-size: 14px;
            margin-bottom: 12px;
        }

        .post-meta .category { color: #0EA5E9; font-weight: 600; }

        .post-content h2 { font-size: 32px; color: #1E293B; margin-bottom: 16px; }
        .post-content p { color: #64748B; line-height: 1.8; margin-bottom: 24px; }

        .recent-posts-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
        }

        .blog-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #E2E8F0;
            transition: transform 0.3s;
        }

        .blog-card:hover { transform: translateY(-5px); }
        
        .card-image { height: 240px; background: #F1F5F9; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; }
        .card-content { padding: 24px; }
        .card-content h3 { font-size: 20px; color: #1E293B; margin-bottom: 12px; }

        .sidebar {  }
        
        .widget {
            background: white;
            padding: 30px;
            border-radius: 16px;
            border: 1px solid #E2E8F0;
            margin-bottom: 30px;
        }

        .widget h3 { font-size: 18px; color: #1E293B; margin-bottom: 20px; }

        .categories-list { list-style: none; padding: 0; margin: 0; }
        .categories-list li { margin-bottom: 12px; }
        .categories-list a {
            color: #64748B; text-decoration: none; transition: color 0.2s;
            display: block; padding: 8px 12px; border-radius: 8px;
        }
        .categories-list a:hover { background: #F8FAFC; color: #0EA5E9; }

        @media (max-width: 1024px) {
            .content-grid { grid-template-columns: 1fr; }
            .sidebar { max-width: 400px; margin: 0 auto; }
        }

        @media (max-width: 640px) {
            .recent-posts-grid { grid-template-columns: 1fr; }
            .hero-section h1 { font-size: 32px; }
            .post-content h2 { font-size: 24px; }
        }
    `]
})
export class BlogComponent implements OnInit {
    private readonly translate = inject(TranslateService);

    featuredPost = signal<BlogPost | null>(null);
    recentPosts = signal<BlogPost[]>([]);

    categories = [
        'blog.categories.all',
        'blog.categories.industry',
        'blog.categories.regulations',
        'blog.categories.research',
        'blog.categories.company'
    ];

    ngOnInit() {
        this.loadPosts();

        this.translate.onLangChange.subscribe(() => {
            this.loadPosts();
        });
    }

    private loadPosts() {
        this.translate.get('blog.list').subscribe((res: any[]) => {
            if (Array.isArray(res) && res.length > 0) {
                // First post is featured
                this.featuredPost.set(res[0]);
                // Rest are recent
                this.recentPosts.set(res.slice(1));
            } else {
                this.featuredPost.set(null);
                this.recentPosts.set([]);
            }
        });
    }
}
