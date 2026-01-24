import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-newsletter',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslateModule],
    template: `
        <div class="newsletter-widget">
            <div class="newsletter-icon">📧</div>
            <h3>{{ 'footer.newsletter' | translate }}</h3>
            <p class="newsletter-text">Stay updated with the latest news and insights</p>
            
            @if (subscribed()) {
                <div class="success-message">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>{{ 'common.success' | translate }}</span>
                </div>
            } @else {
                <form class="newsletter-form" (ngSubmit)="subscribe()">
                    <div class="input-wrapper">
                        <input 
                            type="email" 
                            [(ngModel)]="email"
                            name="email"
                            [placeholder]="'footer.newsletterPlaceholder' | translate"
                            required
                            [disabled]="loading()"
                        />
                        <button type="submit" [disabled]="loading() || !email">
                            @if (loading()) {
                                <span class="spinner"></span>
                            } @else {
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            }
                        </button>
                    </div>
                    @if (error()) {
                        <p class="error-text">{{ error() }}</p>
                    }
                </form>
            }
        </div>
    `,
    styles: [`
        .newsletter-widget {
            padding: 24px;
            background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(16, 185, 129, 0.1));
            border-radius: 16px;
            text-align: center;
        }

        .newsletter-icon {
            font-size: 32px;
            margin-bottom: 12px;
        }

        h3 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary, #1E293B);
            margin-bottom: 8px;
        }

        :host-context(body.dark-theme) h3 {
            color: #F1F5F9;
        }

        .newsletter-text {
            font-size: 14px;
            color: var(--text-muted, #64748B);
            margin-bottom: 16px;
        }

        .newsletter-form {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .input-wrapper {
            display: flex;
            gap: 8px;
        }

        input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
        }

        :host-context(body.dark-theme) input {
            background: rgba(255, 255, 255, 0.05);
            border-color: #334155;
            color: #F1F5F9;
        }

        input:focus {
            border-color: #0EA5E9;
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        button {
            padding: 12px 16px;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .success-message {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px;
            background: rgba(16, 185, 129, 0.1);
            border-radius: 8px;
            color: #10B981;
            font-weight: 500;
        }

        .error-text {
            color: #EF4444;
            font-size: 13px;
            margin-top: 4px;
        }
    `]
})
export class NewsletterComponent {
    email = '';
    loading = signal(false);
    subscribed = signal(false);
    error = signal('');

    subscribe(): void {
        if (!this.email || !this.isValidEmail(this.email)) {
            this.error.set('Please enter a valid email address');
            return;
        }

        this.loading.set(true);
        this.error.set('');

        // Simulate API call - replace with actual newsletter API
        setTimeout(() => {
            this.loading.set(false);
            this.subscribed.set(true);
            // Store email in localStorage to remember subscription
            localStorage.setItem('newsletter-subscribed', 'true');
        }, 1500);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
