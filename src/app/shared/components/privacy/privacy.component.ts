import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-privacy',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'privacy.label' | translate }}</span>
                    <h1>{{ 'privacy.hero.title' | translate }}</h1>
                    <p>{{ 'privacy.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- Privacy Content -->
            <section class="content-section">
                <div class="container">
                    <div class="policy-content">
                        <!-- Introduction -->
                        <div class="policy-block">
                            <h2>{{ 'privacy.sections.intro.title' | translate }}</h2>
                            <p>{{ 'privacy.sections.intro.text' | translate }}</p>
                        </div>

                        <!-- Information Collection -->
                        <div class="policy-block">
                            <h2>{{ 'privacy.sections.collect.title' | translate }}</h2>
                            <p>{{ 'privacy.sections.collect.intro' | translate }}</p>
                            <ul>
                                <li>{{ 'privacy.sections.collect.items.0' | translate }}</li>
                                <li>{{ 'privacy.sections.collect.items.1' | translate }}</li>
                                <li>{{ 'privacy.sections.collect.items.2' | translate }}</li>
                                <li>{{ 'privacy.sections.collect.items.3' | translate }}</li>
                            </ul>
                        </div>

                        <!-- Information Usage -->
                        <div class="policy-block">
                            <h2>{{ 'privacy.sections.use.title' | translate }}</h2>
                            <p>{{ 'privacy.sections.use.intro' | translate }}</p>
                            <ul>
                                <li>{{ 'privacy.sections.use.items.0' | translate }}</li>
                                <li>{{ 'privacy.sections.use.items.1' | translate }}</li>
                                <li>{{ 'privacy.sections.use.items.2' | translate }}</li>
                                <li>{{ 'privacy.sections.use.items.3' | translate }}</li>
                            </ul>
                        </div>

                        <!-- Data Security -->
                        <div class="policy-block">
                            <h2>{{ 'privacy.sections.security.title' | translate }}</h2>
                            <p>{{ 'privacy.sections.security.text' | translate }}</p>
                        </div>

                        <!-- User Rights -->
                        <div class="policy-block">
                            <h2>{{ 'privacy.sections.rights.title' | translate }}</h2>
                            <p>{{ 'privacy.sections.rights.text' | translate }}</p>
                        </div>

                        <!-- Contact -->
                        <div class="policy-block contact-block">
                            <h2>{{ 'privacy.sections.contact.title' | translate }}</h2>
                            <p>{{ 'privacy.sections.contact.text' | translate }}</p>
                            <div class="contact-details">
                                <div class="detail-item">
                                    <strong>{{ 'privacy.sections.contact.emailLabel' | translate }}</strong>
                                    <span>privacy@hacpharma.com</span>
                                </div>
                                <div class="detail-item">
                                    <strong>{{ 'privacy.sections.contact.addressLabel' | translate }}</strong>
                                    <span>{{ 'privacy.sections.contact.addressValue' | translate }}</span>
                                </div>
                            </div>
                        </div>
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

        .hero-section h1 { font-size: 48px; font-weight: 800; margin-bottom: 20px; }
        .hero-section p { font-size: 20px; color: #94A3B8; max-width: 600px; margin: 0 auto; }

        .content-section { padding: 80px 0; background: #F8FAFC; }
        
        .policy-content {
            background: white;
            padding: 60px;
            border-radius: 24px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #E2E8F0;
            max-width: 900px;
            margin: 0 auto;
        }

        .policy-block { margin-bottom: 48px; }
        .policy-block:last-child { margin-bottom: 0; }

        .policy-block h2 {
            font-size: 24px;
            color: #1E293B;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #E2E8F0;
        }

        .policy-block p {
            color: #64748B;
            line-height: 1.8;
            margin-bottom: 16px;
        }

        .policy-block ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .policy-block ul li {
            position: relative;
            padding-left: 24px;
            color: #64748B;
            line-height: 1.8;
            margin-bottom: 12px;
        }

        .policy-block ul li::before {
            content: "•";
            color: #0EA5E9;
            font-weight: bold;
            position: absolute;
            left: 0;
        }

        .contact-block {
            background: #F0F9FF;
            padding: 32px;
            border-radius: 16px;
            border: 1px solid #BAE6FD;
            margin-top: 60px;
        }

        .contact-block h2 { border-bottom-color: #BAE6FD; }

        .contact-details {
            margin-top: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .detail-item { display: flex; gap: 8px; color: #1E293B; }
        .detail-item strong { min-width: 80px; }

        @media (max-width: 768px) {
            .policy-content { padding: 30px; }
            .hero-section h1 { font-size: 36px; }
        }
    `]
})
export class PrivacyComponent { }
