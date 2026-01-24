import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/cms.models';

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-products',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, RouterLink, TranslateModule, FormsModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'common.products' | translate }}</span>
                    <h1>{{ 'products.title' | translate }}</h1>
                    <p>{{ 'products.hero.subtitle' | translate }}</p>
                    
                    <div class="search-container">
                        <div class="search-input">
                            <span class="search-icon">🔍</span>
                            <input 
                                type="text" 
                                [ngModel]="searchQuery()"
                                (ngModelChange)="searchQuery.set($event)"
                                [placeholder]="'products.searchPlaceholder' | translate"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Filters & Grid -->
            <!-- Filters & Grid -->
            @defer (on viewport) {
            <section class="products-section">
                <div class="container">
                    <div class="filters-bar">
                        <div class="categories">
                            <button 
                                class="category-btn" 
                                [class.active]="selectedCategory() === ''"
                                (click)="selectedCategory.set('')">
                                {{ 'products.categories.all' | translate }}
                            </button>
                            @for (category of categories(); track category) {
                                <button 
                                    class="category-btn" 
                                    [class.active]="selectedCategory() === category"
                                    (click)="selectedCategory.set(category)">
                                    {{ category }}
                                </button>
                            }
                        </div>
                        <div class="view-toggle">
                            <button 
                                class="toggle-btn" 
                                [class.active]="viewMode() === 'grid'"
                                (click)="viewMode.set('grid')"
                                [title]="'products.view.grid' | translate">
                                ⊞
                            </button>
                            <button 
                                class="toggle-btn" 
                                [class.active]="viewMode() === 'list'"
                                (click)="viewMode.set('list')"
                                [title]="'products.view.list' | translate">
                                ☰
                            </button>
                        </div>
                    </div>

                    @if (loading()) {
                        <div class="loading-state">
                            <div class="spinner"></div>
                            <p>{{ 'common.loading' | translate }}</p>
                        </div>
                    } @else if (error()) {
                        <div class="error-state">
                            <span class="icon">⚠️</span>
                            <h3>{{ 'common.error' | translate }}</h3>
                            <button class="retry-btn" (click)="loadProducts()">{{ 'common.retry' | translate }}</button>
                        </div>
                    } @else {
                        <div class="products-grid" [class.list-view]="viewMode() === 'list'">
                            @for (product of filteredProducts(); track product.id) {
                                <div class="product-card fade-in">
                                    <div class="card-icon">
                                        @if (product.image) {
                                            <img [src]="product.image" [alt]="getProductName(product)" loading="lazy" width="300" height="300" />
                                        } @else {
                                            💊 
                                        }
                                    </div>
                                    <div class="card-content"> 
                                        <span class="product-category">{{ product.category }}</span>
                                        <h3>{{ getProductName(product) }}</h3>
                                        <p>{{ getProductDescription(product) }}</p>
                                        <div class="product-meta">
                                            @if (product.stockStatus === 'available') {
                                                <span class="stock available">{{ 'products.inStock' | translate }}</span>
                                            } @else if (product.stockStatus === 'limited') {
                                                <span class="stock limited">{{ 'products.limitedStock' | translate }}</span>
                                            } @else {
                                                <span class="stock out">{{ 'products.outOfStock' | translate }}</span>
                                            }
                                        </div>
                                        <a [routerLink]="['/products', product.id]" class="view-btn">
                                            {{ 'common.viewDetails' | translate }}
                                        </a>
                                    </div>
                                </div>
                            }
                        </div>

                        @if (filteredProducts().length === 0 && !loading()) {
                            <div class="no-results">
                                <span class="icon">🔍</span>
                                <h3>{{ 'products.noProducts' | translate }}</h3>
                                <button class="reset-btn" (click)="resetFilters()">{{ 'products.viewAll' | translate }}</button>
                            </div>
                        }
                    }
                </div>
            </section>
            } @placeholder {
                <section class="products-section" style="min-height: 800px"></section>
            }
        </main>

        <app-footer />
    `,
    styles: [`
        .page-content { padding-top: 80px; }
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

        /* Hero */
        .hero-section {
            background: linear-gradient(135deg, #0F172A, #1E293B);
            color: white;
            padding: 80px 0 120px;
            text-align: center;
        }

        .label {
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
        .hero-section p { font-size: 20px; color: #94A3B8; margin-bottom: 40px; }

        .search-container { max-width: 600px; margin: 0 auto; }
        .search-input {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            padding: 8px 24px;
            display: flex; align-items: center; gap: 16px;
        }
        .search-icon { font-size: 20px; opacity: 0.6; }
        .search-input input {
            background: transparent; border: none; width: 100%;
            color: white; font-size: 16px; outline: none; padding: 12px 0;
        }
        .search-input input::placeholder { color: rgba(255, 255, 255, 0.5); }

        /* Products Filter Bar */
        .products-section {
            margin-top: -60px;
            padding-bottom: 100px;
        }

        .filters-bar {
            background: white;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            flex-wrap: wrap;
            gap: 20px;
        }

        .categories { display: flex; gap: 8px; flex-wrap: wrap; }
        .category-btn {
            padding: 8px 16px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            color: #64748B;
            cursor: pointer;
            transition: all 0.2s;
        }
        .category-btn:hover { background: #F8FAFC; color: #1E293B; }
        .category-btn.active { background: #0EA5E9; color: white; }

        .view-toggle { display: flex; gap: 4px; background: #F1F5F9; padding: 4px; border-radius: 8px; }
        .toggle-btn {
            width: 32px; height: 32px;
            border: none; background: transparent;
            border-radius: 6px; cursor: pointer;
            color: #64748B; font-size: 18px;
            display: flex; align-items: center; justify-content: center;
        }
        .toggle-btn.active { background: white; color: #0EA5E9; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

        /* Grid */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .products-grid.list-view { grid-template-columns: 1fr; }
        
        .product-card {
            background: white; border: 1px solid #E2E8F0; border-radius: 20px;
            padding: 30px; transition: all 0.3s;
            display: flex; flex-direction: column; gap: 20px;
            align-items: flex-start;
        }

        .list-view .product-card { flex-direction: row; align-items: center; }

        .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-color: #0EA5E9; }

        .card-icon {
            width: 60px; height: 60px;
            background: #F0F9FF; border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
            font-size: 30px; flex-shrink: 0;
            overflow: hidden;
        }
        .card-icon img { width: 100%; height: 100%; object-fit: cover; }

        .card-content { flex: 1; width: 100%; }
        .product-category {
            font-size: 12px; font-weight: 600; color: #0EA5E9;
            text-transform: uppercase; margin-bottom: 8px; display: block;
        }

        .product-card h3 { font-size: 20px; color: #1E293B; margin-bottom: 12px; }
        .product-card p { font-size: 14px; color: #64748B; line-height: 1.6; margin-bottom: 16px; }

        .product-meta { margin-bottom: 16px; }
        .stock {
            font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 50px;
        }
        .stock.available { background: #D1FAE5; color: #059669; }
        .stock.limited { background: #FEF3C7; color: #D97706; }
        .stock.out { background: #FEE2E2; color: #DC2626; }

        .view-btn {
            display: inline-block;
            padding: 10px 20px;
            background: #F8FAFC;
            color: #1E293B;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s;
        }
        .view-btn:hover { background: #0EA5E9; color: white; }

        .no-results, .loading-state, .error-state {
            text-align: center; padding: 60px;
            color: #64748B;
        }
        .no-results .icon, .error-state .icon { font-size: 48px; opacity: 0.5; display: block; margin-bottom: 16px; }
        .reset-btn, .retry-btn {
            margin-top: 20px;
            padding: 10px 24px;
            background: #0EA5E9; color: white;
            border: none; border-radius: 50px;
            font-weight: 600; cursor: pointer;
        }

        .loading-state .spinner {
            width: 40px; height: 40px; margin: 0 auto 16px;
            border: 3px solid #E2E8F0; border-top-color: #0EA5E9;
            border-radius: 50%; animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
            .hero-section h1 { font-size: 32px; }
            .hero-section { padding: 60px 0 100px; }
        }
    `]
})
export class ProductsComponent implements OnInit {
    private readonly translate = inject(TranslateService);
    private readonly productService = inject(ProductService);
    private readonly platformId = inject(PLATFORM_ID);

    selectedCategory = signal('');
    searchQuery = signal('');
    viewMode = signal<'grid' | 'list'>('grid');

    products = signal<Product[]>([]);
    categories = signal<string[]>([]);
    loading = signal(true);
    error = signal(false);

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.loadProducts();
            this.loadCategories();
        } else {
            this.loading.set(false);
        }
    }

    loadProducts() {
        this.loading.set(true);
        this.error.set(false);

        this.productService.getProducts({ limit: 100 }).subscribe({
            next: (response) => {
                this.products.set(response.items || []);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load products', err);
                this.error.set(true);
                this.loading.set(false);
            }
        });
    }

    loadCategories() {
        this.productService.getCategories().subscribe({
            next: (cats) => {
                // Handle if categories come as array of strings or array of objects
                if (cats.length > 0 && typeof cats[0] === 'string') {
                    this.categories.set(cats as string[]);
                } else {
                    // If it's an object with name property
                    this.categories.set((cats as any[]).map(c => c.name || c));
                }
            },
            error: (err) => console.error('Failed to load categories', err)
        });
    }

    filteredProducts = computed(() => {
        let result = this.products();
        const currentCategory = this.selectedCategory();
        const query = this.searchQuery().toLowerCase();

        // Filter by Category
        if (currentCategory) {
            result = result.filter(p => p.category === currentCategory);
        }

        // Filter by Search Query
        if (query) {
            result = result.filter(p => {
                const name = this.getProductName(p).toLowerCase();
                const desc = this.getProductDescription(p).toLowerCase();
                const cat = (p.category || '').toLowerCase();

                return name.includes(query) || desc.includes(query) || cat.includes(query);
            });
        }

        return result;
    });

    getProductName(product: Product): string {
        const lang = this.translate.currentLang || 'en';
        return lang === 'ar' && product.nameAr ? product.nameAr : product.name;
    }

    getProductDescription(product: Product): string {
        const lang = this.translate.currentLang || 'en';
        return lang === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
    }

    resetFilters() {
        this.selectedCategory.set('');
        this.searchQuery.set('');
    }
}

