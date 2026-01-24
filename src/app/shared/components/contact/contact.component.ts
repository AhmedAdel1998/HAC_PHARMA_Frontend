import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';
import { ActivatedRoute } from '@angular/router';
import { ContactService, SubmitContactDTO } from '../../../core/services/contact.service';

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-contact',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'common.contact' | translate }}</span>
                    <h1>{{ 'contact.title' | translate }}</h1>
                    <p>{{ 'contact.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- Contact Content -->
            <!-- Contact Content -->
            @defer (on viewport) {
            <section class="contact-section">
                <div class="container">
                    <div class="contact-grid">
                        <!-- Contact Form -->
                        <div class="contact-form-container fade-in">
                            <h2>{{ 'contact.sendMessage' | translate }}</h2>
                            
                            @if (successMessage()) {
                                <div class="success-message">
                                    <div class="icon">✅</div>
                                    <p>{{ successMessage() | translate }}</p>
                                    <button class="btn-reset" (click)="resetForm()">{{ 'common.send' | translate }} another message</button>
                                </div>
                            } @else {
                                <form class="contact-form" (ngSubmit)="onSubmit()">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="name">{{ 'contact.namePlaceholder' | translate }}</label>
                                            <input type="text" id="name" [(ngModel)]="formData.name" name="name" required [disabled]="submitting()">
                                        </div>
                                        <div class="form-group">
                                            <label for="email">{{ 'contact.emailPlaceholder' | translate }}</label>
                                            <input type="email" id="email" [(ngModel)]="formData.email" name="email" required [disabled]="submitting()">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="subject">{{ 'contact.subject' | translate }}</label>
                                        <select id="subject" [(ngModel)]="formData.subject" name="subject" required [disabled]="submitting()">
                                            <option value="">{{ 'contact.topics.select' | translate }}</option>
                                            <option value="Partnership">{{ 'contact.topics.partnership' | translate }}</option>
                                            <option value="Products">{{ 'contact.topics.products' | translate }}</option>
                                            <option value="Careers">{{ 'contact.topics.careers' | translate }}</option>
                                            <option value="General">{{ 'contact.topics.general' | translate }}</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="message">{{ 'contact.messagePlaceholder' | translate }}</label>
                                        <textarea id="message" [(ngModel)]="formData.message" name="message" rows="5" required [disabled]="submitting()"></textarea>
                                    </div>
                                    
                                    @if (errorMessage()) {
                                        <div class="error-message">{{ errorMessage() | translate }}</div>
                                    }

                                    <button type="submit" class="btn-submit" [disabled]="submitting()">
                                        @if (submitting()) {
                                            {{ 'contact.sending' | translate }}
                                        } @else {
                                            {{ 'contact.sendMessage' | translate }}
                                        }
                                    </button>
                                </form>
                            }
                        </div>

                        <!-- Contact Info -->
                        <div class="contact-info fade-in">
                            <div class="info-card">
                                <h3>{{ 'footer.contactInfo' | translate }}</h3>
                                <div class="info-item">
                                    <span class="icon">📍</span>
                                    <div>
                                        <strong>{{ 'contact.location' | translate }}</strong>
                                        <p>{{ 'contact.riyadh' | translate }}</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <span class="icon">📧</span>
                                    <div>
                                        <strong>{{ 'contact.email' | translate }}</strong>
                                        <p>info&#64;hac-pharma.com</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <span class="icon">📞</span>
                                    <div>
                                        <strong>{{ 'contact.phoneLabel' | translate }}</strong>
                                        <p>+966 11 123 4567</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <span class="icon">🕐</span>
                                    <div>
                                        <strong>{{ 'contact.businessHoursLabel' | translate }}</strong>
                                        <p>{{ 'contact.businessHoursValue' | translate }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="office-card">
                                <h3>{{ 'about.globalPresence' | translate }}</h3>
                                <div class="offices-list">
                                    <div class="office">🇺🇸 {{ 'about.countries.usa' | translate }}</div>
                                    <div class="office">🇫🇷 {{ 'about.countries.france' | translate }}</div>
                                    <div class="office">🇪🇬 {{ 'about.countries.egypt' | translate }}</div>
                                    <div class="office">🇮🇳 {{ 'about.countries.india' | translate }}</div>
                                    <div class="office">🇨🇳 {{ 'about.countries.china' | translate }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="contact-section" style="min-height: 500px"></section>
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

        .contact-section { padding: 100px 0; }
        .contact-grid { display: grid; grid-template-columns: 1fr 400px; gap: 60px; }

        .contact-form-container h2 { font-size: 28px; margin-bottom: 32px; color: #1E293B; }

        .contact-form { display: flex; flex-direction: column; gap: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-weight: 600; color: #1E293B; }
        .form-group input, .form-group select, .form-group textarea {
            padding: 14px 18px;
            border: 2px solid #E2E8F0;
            border-radius: 12px;
            font-size: 16px;
            transition: border-color 0.3s;
            background-color: white !important;
            color: #1E293B !important;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none;
            border-color: #0EA5E9;
            background-color: white !important;
        }
        
        .form-group input:disabled, .form-group select:disabled, .form-group textarea:disabled {
            background: #F1F5F9;
            cursor: not-allowed;
        }

        .btn-submit {
            padding: 16px 32px;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            align-self: flex-start;
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3); }
        .btn-submit:disabled { opacity: 0.7; cursor: wait; }

        .contact-info { display: flex; flex-direction: column; gap: 24px; }

        .info-card, .office-card {
            background: #F8FAFC;
            padding: 32px;
            border-radius: 20px;
        }

        .info-card h3, .office-card h3 { font-size: 20px; margin-bottom: 24px; color: #1E293B; }

        .info-item { display: flex; gap: 16px; margin-bottom: 20px; }
        .info-item .icon { font-size: 24px; }
        .info-item strong { display: block; color: #1E293B; margin-bottom: 4px; }
        .info-item p { color: #64748B; margin: 0; font-size: 14px; }

        .offices-list { display: flex; flex-wrap: wrap; gap: 12px; }
        .office {
            padding: 10px 16px;
            background: white;
            border-radius: 10px;
            font-size: 14px;
            color: #1E293B;
        }

        .success-message {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            padding: 32px;
            border-radius: 16px;
            text-align: center;
        }
        .success-message .icon { font-size: 48px; margin-bottom: 16px; }
        .success-message p { font-size: 18px; color: #15803D; margin-bottom: 24px; }
        
        .error-message {
            color: #DC2626;
            background: #FEF2F2;
            padding: 12px;
            border-radius: 8px;
            font-size: 14px;
        }
        
        .btn-reset {
            background: none;
            border: 1px solid #15803D;
            color: #15803D;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }
        .btn-reset:hover { background: #DCFCE7; }

        @media (max-width: 1024px) {
            .hero-section h1 { font-size: 40px; }
            .contact-grid { grid-template-columns: 1fr; }
            .form-row { grid-template-columns: 1fr; }
        }
    `]
})
export class ContactComponent {
    private readonly contactService = inject(ContactService);
    private readonly route = inject(ActivatedRoute);
    private readonly translate = inject(TranslateService);

    formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    submitting = signal(false);
    successMessage = signal('');
    errorMessage = signal('');

    constructor() {
        this.route.queryParams.subscribe(params => {
            if (params['subject']) {
                const subject = params['subject'];
                this.formData.subject = subject.charAt(0).toUpperCase() + subject.slice(1);
            }
        });
    }

    onSubmit(): void {
        this.submitting.set(true);
        this.errorMessage.set('');

        this.contactService.submitContact(this.formData).subscribe({
            next: () => {
                this.submitting.set(false);
                this.successMessage.set('contact.messageSent');
                this.formData = { name: '', email: '', subject: '', message: '' };
            },
            error: (err) => {
                this.submitting.set(false);
                console.error('Submit error', err);
                this.errorMessage.set('contact.messageError');
            }
        });
    }

    resetForm() {
        this.successMessage.set('');
        this.errorMessage.set('');
    }
}
