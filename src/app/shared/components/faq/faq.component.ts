import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

interface FAQ {
    question: string;
    answer: string;
    isOpen: boolean;
}

@Component({
    selector: 'app-faq',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'faq.hero.label' | translate }}</span>
                    <h1>{{ 'faq.hero.title' | translate }}</h1>
                    <p>{{ 'faq.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- FAQ Section -->
            <section class="faq-section">
                <div class="container">
                    <div class="faq-list">
                        @for (faq of faqs(); track faq.question; let i = $index) {
                            <div class="faq-item" [class.open]="faq.isOpen">
                                <button class="faq-question" (click)="toggleFaq(i)">
                                    <span>{{ faq.question }}</span>
                                    <span class="icon">{{ faq.isOpen ? '−' : '+' }}</span>
                                </button>
                                @if (faq.isOpen) {
                                    <div class="faq-answer">
                                        <p>{{ faq.answer }}</p>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </section>

            <!-- CTA -->
            <section class="cta-section">
                <div class="container">
                    <div class="cta-content">
                        <h2>{{ 'faq.cta.title' | translate }}</h2>
                        <p>{{ 'faq.cta.subtitle' | translate }}</p>
                        <a routerLink="/contact" class="btn-cta">{{ 'faq.cta.button' | translate }}</a>
                    </div>
                </div>
            </section>
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

        .faq-section { padding: 100px 0; }
        .faq-list { max-width: 800px; margin: 0 auto; }

        .faq-item {
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            margin-bottom: 16px;
            overflow: hidden;
            transition: all 0.3s;
        }

        .faq-item.open { border-color: #0EA5E9; }

        .faq-question {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 28px;
            background: white;
            border: none;
            cursor: pointer;
            text-align: left;
            font-size: 18px;
            font-weight: 600;
            color: #1E293B;
            transition: background 0.3s;
        }

        .faq-question:hover { background: #F8FAFC; }
        .faq-item.open .faq-question { background: #F0F9FF; }

        .faq-question .icon {
            font-size: 24px;
            color: #0EA5E9;
            font-weight: 300;
        }

        .faq-answer {
            padding: 0 28px 24px;
            background: white;
        }

        .faq-answer p { color: #64748B; line-height: 1.8; margin: 0; }

        .cta-section { padding: 100px 0; background: #F8FAFC; }
        .cta-content { text-align: center; }
        .cta-content h2 { font-size: 36px; margin-bottom: 16px; color: #1E293B; }
        .cta-content p { color: #64748B; margin-bottom: 32px; }
        .btn-cta {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            color: white;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            transition: all 0.3s;
        }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3); }

        @media (max-width: 768px) {
            .hero-section h1 { font-size: 36px; }
            .faq-question { font-size: 16px; padding: 20px; }
        }
    `]
})
export class FAQComponent implements OnInit {
    private readonly translate = inject(TranslateService);

    faqs = signal<FAQ[]>([]);

    ngOnInit() {
        this.translate.get('faq.list').subscribe((data: any[]) => {
            if (Array.isArray(data)) {
                this.faqs.set(data.map(item => ({ ...item, isOpen: false })));
            }
        });
    }

    toggleFaq(index: number): void {
        this.faqs.update(faqs => faqs.map((faq, i) => ({
            ...faq,
            isOpen: i === index ? !faq.isOpen : false
        })));
    }
}
