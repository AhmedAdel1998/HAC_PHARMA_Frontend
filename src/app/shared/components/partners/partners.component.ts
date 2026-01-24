import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-partners',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'partnersPage.hero.label' | translate }}</span>
                    <h1>{{ 'partnersPage.hero.title' | translate }}</h1>
                    <p>{{ 'partnersPage.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- Partnership Types -->
            <!-- Partnership Types -->
            @defer (on viewport) {
            <section class="types-section">
                <div class="container">
                    <div class="types-grid">
                        @for (type of types; track type.title) {
                            <div class="type-card fade-in">
                                <div class="icon">{{ type.icon }}</div>
                                <h3>{{ type.title }}</h3>
                                <p>{{ type.description }}</p>
                            </div>
                        }
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="types-section" style="min-height: 400px"></section>
            }

            <!-- Why Partner -->
            <!-- Why Partner -->
            @defer (on viewport) {
            <section class="why-section">
                <div class="container">
                    <div class="why-grid">
                        <div class="why-content fade-in">
                            <h2>{{ 'partnersPage.why.title' | translate }}</h2>
                            <ul class="benefits-list">
                                @for (benefit of benefits; track benefit.title) {
                                    <li>
                                        <span class="check">✓</span>
                                        <div>
                                            <strong>{{ benefit.title }}</strong>
                                            <p>{{ benefit.description }}</p>
                                        </div>
                                    </li>
                                }
                            </ul>
                        </div>
                        <div class="why-visual fade-in">
                            <div class="stats-grid">
                                @for (stat of stats; track stat.label) {
                                    <div class="stat">
                                        <span class="number">{{ stat.value }}</span>
                                        <span class="label">{{ stat.label }}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="why-section" style="min-height: 500px"></section>
            }

            <!-- CTA -->
            <!-- CTA -->
            @defer (on viewport) {
            <section class="cta-section">
                <div class="container">
                    <div class="cta-content fade-in">
                        <h2>{{ 'partnersPage.cta.title' | translate }}</h2>
                        <p>{{ 'partnersPage.cta.subtitle' | translate }}</p>
                        <a routerLink="/contact" class="btn-cta">{{ 'partnersPage.cta.button' | translate }}</a>
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

        .hero-section h1 { font-size: 56px; font-weight: 800; margin-bottom: 20px; }
        .hero-section p { font-size: 20px; color: #94A3B8; }

        .types-section { padding: 100px 0; }
        .types-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }

        .type-card {
            text-align: center;
            padding: 50px 40px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #E2E8F0;
            transition: transform 0.3s;
        }

        .type-card:hover { transform: translateY(-8px); }
        .type-card .icon { font-size: 56px; margin-bottom: 24px; }
        .type-card h3 { font-size: 24px; color: #1E293B; margin-bottom: 16px; }
        .type-card p { color: #64748B; line-height: 1.7; }

        .why-section { padding: 100px 0; background: #F8FAFC; }
        .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .why-content h2 { font-size: 36px; margin-bottom: 32px; color: #1E293B; }

        .benefits-list { list-style: none; padding: 0; margin: 0; }
        .benefits-list li { display: flex; gap: 16px; margin-bottom: 24px; }
        .benefits-list .check {
            width: 32px;
            height: 32px;
            background: #10B981;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .benefits-list strong { display: block; color: #1E293B; margin-bottom: 4px; }
        .benefits-list p { color: #64748B; font-size: 14px; margin: 0; }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .stat {
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .stat .number {
            display: block;
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(135deg, #0EA5E9, #10B981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
        }
        .stat .label { color: #64748B; font-size: 14px; }

        .cta-section { padding: 100px 0; background: linear-gradient(135deg, #0EA5E9, #0284C7); }
        .cta-content { text-align: center; color: white; }
        .cta-content h2 { font-size: 40px; margin-bottom: 16px; }
        .cta-content p { font-size: 18px; opacity: 0.9; margin-bottom: 32px; }
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
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }

        @media (max-width: 1024px) {
            .hero-section h1 { font-size: 40px; }
            .types-grid { grid-template-columns: 1fr; }
            .why-grid { grid-template-columns: 1fr; }
        }
    `]
})
export class PartnersComponent implements OnInit {
    private readonly translate = inject(TranslateService);

    types: any[] = [];
    benefits: any[] = [];
    stats: any[] = [];

    ngOnInit() {
        this.translate.get('partnersPage.types').subscribe(data => this.types = data);
        this.translate.get('partnersPage.why.benefits').subscribe(data => this.benefits = data);
        this.translate.get('partnersPage.why.stats').subscribe(data => this.stats = data);
    }
}
