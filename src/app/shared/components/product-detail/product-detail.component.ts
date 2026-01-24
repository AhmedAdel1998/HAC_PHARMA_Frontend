import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    icon: string;
    fullDescription: string;
    indications: string[];
    dosage: string;
}

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-product-detail',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, RouterLink, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            @if (product(); as prod) {
                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="container">
                        <a routerLink="/products" class="back-link">← {{ 'productDetail.back' | translate }}</a>
                        <div class="hero-content">
                            <div class="product-icon">{{ prod.icon }}</div>
                            <span class="label">{{ prod.category | translate }}</span>
                            <h1>{{ prod.name | translate }}</h1>
                            <p>{{ prod.description | translate }}</p>
                        </div>
                    </div>
                </section>

                <!-- Product Details -->
                <!-- Product Details -->
                @defer (on viewport) {
                <section class="details-section">
                    <div class="container">
                        <div class="details-grid fade-in">
                            <div class="main-content">
                                <h2>{{ 'productDetail.about' | translate }}</h2>
                                <p>{{ prod.fullDescription | translate }}</p>

                                <h3>{{ 'productDetail.indications' | translate }}</h3>
                                <ul class="indications-list">
                                    @for (indication of prod.indications; track indication) {
                                        <li>{{ indication | translate }}</li>
                                    }
                                </ul>

                                <h3>{{ 'productDetail.dosage' | translate }}</h3>
                                <p>{{ prod.dosage | translate }}</p>
                            </div>

                            <div class="sidebar">
                                <div class="info-card">
                                    <h4>{{ 'productDetail.info.title' | translate }}</h4>
                                    <div class="info-row">
                                        <span class="label">{{ 'productDetail.info.category' | translate }}</span>
                                        <span class="value">{{ prod.category | translate }}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="label">{{ 'productDetail.info.availability' | translate }}</span>
                                        <span class="value status">{{ 'productDetail.info.available' | translate }}</span>
                                    </div>
                                </div>

                                <div class="contact-card">
                                    <h4>{{ 'productDetail.contact.title' | translate }}</h4>
                                    <p>{{ 'productDetail.contact.text' | translate }}</p>
                                    <a routerLink="/contact" class="btn-contact">{{ 'productDetail.contact.button' | translate }}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                } @placeholder {
                    <section class="details-section" style="min-height: 500px"></section>
                }
            }
        </main>

        <app-footer />
    `,
    styles: [`
        .page-content {
            padding-top: 80px;
        }

        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
        }

        .hero-section {
            background: linear-gradient(135deg, #0F172A, #1E293B);
            color: white;
            padding: 80px 0 100px;
        }

        .back-link {
            color: #94A3B8;
            text-decoration: none;
            font-size: 14px;
            display: inline-block;
            margin-bottom: 40px;
            transition: color 0.3s;
        }

        .back-link:hover {
            color: white;
        }

        .hero-content {
            text-align: center;
        }

        .product-icon {
            font-size: 80px;
            margin-bottom: 24px;
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

        .hero-section h1 {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 16px;
        }

        .hero-section p {
            font-size: 20px;
            color: #94A3B8;
        }

        .details-section {
            padding: 80px 0 120px;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 60px;
        }

        .main-content h2 {
            font-size: 28px;
            margin-bottom: 16px;
            color: #1E293B;
        }

        .main-content h3 {
            font-size: 22px;
            margin: 32px 0 16px;
            color: #1E293B;
        }

        .main-content p {
            color: #64748B;
            line-height: 1.8;
        }

        .indications-list {
            padding-left: 20px;
        }

        .indications-list li {
            color: #64748B;
            line-height: 2;
        }

        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .info-card, .contact-card {
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            padding: 28px;
        }

        .info-card h4, .contact-card h4 {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1E293B;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #F1F5F9;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-row .label {
            color: #64748B;
        }

        .info-row .value {
            font-weight: 600;
            color: #1E293B;
        }

        .info-row .status {
            color: #10B981;
        }

        .contact-card p {
            color: #64748B;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .btn-contact {
            display: block;
            text-align: center;
            padding: 14px;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn-contact:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(14, 165, 233, 0.3);
        }

        @media (max-width: 1024px) {
            .details-grid {
                grid-template-columns: 1fr;
            }
        }
    `]
})
export class ProductDetailComponent {
    private allProducts: Product[] = [
        {
            id: 1,
            name: 'products.list.cardioPlus.name',
            category: 'products.categories.cardio',
            description: 'products.list.cardioPlus.desc',
            icon: '❤️',
            fullDescription: 'productDetail.p1.fullDesc',
            indications: ['productDetail.p1.indications.0', 'productDetail.p1.indications.1', 'productDetail.p1.indications.2'],
            dosage: 'productDetail.p1.dosage'
        },
        {
            id: 2,
            name: 'products.list.oncoDefend.name',
            category: 'products.categories.onco',
            description: 'products.list.oncoDefend.desc',
            icon: '🔬',
            fullDescription: 'productDetail.p2.fullDesc',
            indications: ['productDetail.p2.indications.0', 'productDetail.p2.indications.1', 'productDetail.p2.indications.2'],
            dosage: 'productDetail.p2.dosage'
        },
        {
            id: 3,
            name: 'products.list.neuroCalm.name',
            category: 'products.categories.neuro',
            description: 'products.list.neuroCalm.desc',
            icon: '🧠',
            fullDescription: 'productDetail.p3.fullDesc',
            indications: ['productDetail.p3.indications.0', 'productDetail.p3.indications.1', 'productDetail.p3.indications.2'],
            dosage: 'productDetail.p3.dosage'
        },
        {
            id: 4,
            name: 'products.list.diabControl.name',
            category: 'products.categories.diabetes',
            description: 'products.list.diabControl.desc',
            icon: '💉',
            fullDescription: 'productDetail.p4.fullDesc',
            indications: ['productDetail.p4.indications.0', 'productDetail.p4.indications.1', 'productDetail.p4.indications.2'],
            dosage: 'productDetail.p4.dosage'
        },
        {
            id: 5,
            name: 'products.list.dermaCare.name',
            category: 'products.categories.derma',
            description: 'products.list.dermaCare.desc',
            icon: '✨',
            fullDescription: 'productDetail.p5.fullDesc',
            indications: ['productDetail.p5.indications.0', 'productDetail.p5.indications.1', 'productDetail.p5.indications.2'],
            dosage: 'productDetail.p5.dosage'
        },
        {
            id: 6,
            name: 'products.list.cardioMax.name',
            category: 'products.categories.cardio',
            description: 'products.list.cardioMax.desc',
            icon: '💓',
            fullDescription: 'productDetail.p6.fullDesc',
            indications: ['productDetail.p6.indications.0', 'productDetail.p6.indications.1', 'productDetail.p6.indications.2'],
            dosage: 'productDetail.p6.dosage'
        },
        {
            id: 7,
            name: 'products.list.oncoShield.name',
            category: 'products.categories.onco',
            description: 'products.list.oncoShield.desc',
            icon: '🛡️',
            fullDescription: 'productDetail.p7.fullDesc',
            indications: ['productDetail.p7.indications.0', 'productDetail.p7.indications.1', 'productDetail.p7.indications.2'],
            dosage: 'productDetail.p7.dosage'
        },
        {
            id: 8,
            name: 'products.list.neuroFlex.name',
            category: 'products.categories.neuro',
            description: 'products.list.neuroFlex.desc',
            icon: '⚡',
            fullDescription: 'productDetail.p8.fullDesc',
            indications: ['productDetail.p8.indications.0', 'productDetail.p8.indications.1', 'productDetail.p8.indications.2'],
            dosage: 'productDetail.p8.dosage'
        },
    ];

    product = signal<Product | undefined>(undefined);

    constructor(private route: ActivatedRoute) {
        const id = Number(this.route.snapshot.params['id']);
        this.product.set(this.allProducts.find(p => p.id === id));
    }
}
