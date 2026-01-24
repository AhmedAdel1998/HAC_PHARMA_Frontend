import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

interface Service {
    icon: string;
    title: string;
    description: string;
    features: string[];
}

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-services',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'services.title' | translate }}</span>
                    <h1>{{ 'services.pageTitle' | translate }}</h1>
                    <p>{{ 'services.pageSubtitle' | translate }}</p>
                </div>
            </section>

            <!-- Services Grid -->
            <!-- Services Grid -->
            @defer (on viewport) {
            <section class="services-section">
                <div class="container">
                    <div class="services-grid">
                        <!-- Service 1: Regulatory -->
                        <div class="service-card fade-in">
                            <div class="service-icon">✓</div>
                            <h3>{{ 'services.list.0.title' | translate }}</h3>
                            <p>{{ 'services.list.0.description' | translate }}</p>
                        </div>
                        
                        <!-- Service 2: Logistics -->
                        <div class="service-card fade-in">
                            <div class="service-icon">📦</div>
                            <h3>{{ 'services.list.1.title' | translate }}</h3>
                            <p>{{ 'services.list.1.description' | translate }}</p>
                        </div>

                        <!-- Service 3: Market Access -->
                        <div class="service-card fade-in">
                            <div class="service-icon">📈</div>
                            <h3>{{ 'services.list.2.title' | translate }}</h3>
                            <p>{{ 'services.list.2.description' | translate }}</p>
                        </div>

                        <!-- Service 4: Medical Affairs -->
                        <div class="service-card fade-in">
                            <div class="service-icon">🔬</div>
                            <h3>{{ 'services.list.3.title' | translate }}</h3>
                            <p>{{ 'services.list.3.description' | translate }}</p>
                        </div>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="services-section" style="min-height: 500px"></section>
            }

            <!-- CTA Section -->
            <!-- CTA Section -->
            @defer (on viewport) {
            <section class="cta-section">
                <div class="container">
                    <div class="cta-content fade-in">
                        <h2>{{ 'contact.title' | translate }}</h2>
                        <p>{{ 'contact.subtitle' | translate }}</p>
                        <a routerLink="/contact" class="btn-cta">{{ 'common.contact' | translate }}</a>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="cta-section" style="min-height: 300px"></section>
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

        .hero-section h1 {
            font-size: 56px;
            font-weight: 800;
            margin-bottom: 20px;
        }

        .hero-section p {
            font-size: 20px;
            color: #94A3B8;
        }

        .services-section {
            padding: 100px 0;
        }

        .services-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
        }

        .service-card {
            background: white;
            padding: 50px;
            border-radius: 24px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #E2E8F0;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(to bottom, #0EA5E9, #10B981);
        }

        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .service-icon {
            font-size: 48px;
            margin-bottom: 24px;
        }

        .service-card h3 {
            font-size: 24px;
            color: #1E293B;
            margin-bottom: 16px;
        }

        .service-card p {
            color: #64748B;
            line-height: 1.7;
            margin-bottom: 24px;
        }

        .features {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .features li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 0;
            color: #64748B;
            font-size: 14px;
        }

        .features .check {
            color: #10B981;
            font-weight: bold;
        }

        .cta-section {
            padding: 100px 0;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
        }

        .cta-content {
            text-align: center;
            color: white;
        }

        .cta-content h2 {
            font-size: 40px;
            margin-bottom: 16px;
        }

        .cta-content p {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 32px;
        }

        .btn-cta {
            display: inline-block;
            padding: 16px 40px;
            background: white;
            color: #0EA5E9;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            transition: all 0.3s;
        }

        .btn-cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 1024px) {
            .hero-section h1 { font-size: 40px; }
            .services-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
            .hero-section h1 { font-size: 32px; }
            .service-card { padding: 30px; }
        }
    `]
})
export class ServicesComponent { }
