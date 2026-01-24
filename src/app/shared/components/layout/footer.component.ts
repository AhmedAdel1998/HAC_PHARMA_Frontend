import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
    selector: 'app-footer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, NgOptimizedImage, TranslateModule],
    template: `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-grid">
                    <!-- Company Info -->
                    <div class="footer-section">
                        <div class="footer-logo">
                            @if (settings()?.logoUrl) {
                                <img [src]="settings()?.logoUrl" width="40" height="40" [alt]="settings()?.siteName || 'Logo'">
                            } @else {
                                <img ngSrc="assets/logo.png" width="40" height="40" alt="HAC Pharma Logo">
                            }
                            
                            <span class="logo-text">
                                @if (settings()?.siteName) {
                                    {{ settings()?.siteName }}
                                } @else {
                                    HAC<span class="green">Pharma</span>
                                }
                            </span>
                        </div>
                        <p class="footer-desc">
                            {{ 'footer.description' | translate }}
                        </p>
                        <div class="social-links">
                            @if (settings()?.socialLinks?.linkedin || 'https://linkedin.com'; as url) {
                                <a [href]="url" target="_blank" rel="noopener" aria-label="LinkedIn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                            }
                            @if (settings()?.socialLinks?.twitter || 'https://twitter.com'; as url) {
                                <a [href]="url" target="_blank" rel="noopener" aria-label="Twitter">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>
                            }
                            @if (settings()?.socialLinks?.facebook || 'https://facebook.com'; as url) {
                                <a [href]="url" target="_blank" rel="noopener" aria-label="Facebook">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                            }
                            @if (settings()?.socialLinks?.instagram || 'https://instagram.com'; as url) {
                                <a [href]="url" target="_blank" rel="noopener" aria-label="Instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                            }
                            @if (settings()?.socialLinks?.youtube || 'https://youtube.com'; as url) {
                                <a [href]="url" target="_blank" rel="noopener" aria-label="YouTube">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                </a>
                            }
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="footer-section">
                        <h4>{{ 'footer.quickLinks' | translate }}</h4>
                        <ul>
                            <li><a routerLink="/about">{{ 'common.about' | translate }}</a></li>
                            <li><a routerLink="/services">{{ 'common.services' | translate }}</a></li>
                            <li><a routerLink="/products">{{ 'common.products' | translate }}</a></li>
                            <li><a routerLink="/team">{{ 'common.team' | translate }}</a></li>
                            <li><a routerLink="/careers">{{ 'common.careers' | translate }}</a></li>
                        </ul>
                    </div>

                    <!-- Services -->
                    <div class="footer-section">
                        <h4>{{ 'footer.servicesTitle' | translate }}</h4>
                        <ul>
                            <li><a routerLink="/services">{{ 'footer.serviceLinks.distribution' | translate }}</a></li>
                            <li><a routerLink="/services">{{ 'footer.serviceLinks.regulatory' | translate }}</a></li>
                            <li><a routerLink="/services">{{ 'footer.serviceLinks.business' | translate }}</a></li>
                            <li><a routerLink="/services">{{ 'footer.serviceLinks.partnerships' | translate }}</a></li>
                        </ul>
                    </div>

                    <!-- Contact Info -->
                    <div class="footer-section">
                        <h4>{{ 'common.contact' | translate }}</h4>
                        <ul class="contact-list">
                            <li>
                                <span class="icon">📍</span>
                                <span>{{ settings()?.address || ('contact.riyadh' | translate) }}</span>
                            </li>
                            @if (settings()?.contactEmail) {
                                <li>
                                    <span class="icon">📧</span>
                                    <a [href]="'mailto:' + settings()?.contactEmail">{{ settings()?.contactEmail }}</a>
                                </li>
                            }
                            @if (settings()?.contactPhone) {
                                <li>
                                    <span class="icon">📞</span>
                                    <a [href]="'tel:' + settings()?.contactPhone">{{ settings()?.contactPhone }}</a>
                                </li>
                            }
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; {{ currentYear }} {{ settings()?.siteName || 'HAC Pharma' }}. {{ 'footer.rights' | translate }}</p>
                    <div class="footer-links">
                        <a routerLink="/privacy">{{ 'common.privacy' | translate }}</a>
                        <a routerLink="/faq">{{ 'common.faq' | translate }}</a>
                    </div>
                </div>
            </div>
        </footer>
    `,
    styles: [`
        .footer {
            background: linear-gradient(135deg, #0F172A, #1E293B);
            color: white;
            padding: 80px 0 30px;
        }

        .footer-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 60px;
            padding-bottom: 50px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            cursor: default;
        }

        .footer-logo img {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.2));
        }

        .footer-logo:hover img {
            transform: scale(1.1) rotate(5deg);
            filter: drop-shadow(0 0 15px rgba(14, 165, 233, 0.5));
        }

        .logo-text {
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(135deg, #0EA5E9, #10B981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .footer-desc {
            color: #94A3B8;
            line-height: 1.7;
            margin-bottom: 24px;
        }

        .social-links {
            display: flex;
            gap: 12px;
        }

        .social-links a {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s;
        }

        .social-links a:hover {
            background: #0EA5E9;
            transform: translateY(-3px);
        }

        .footer-section h4 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            color: white;
        }

        .footer-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-section ul li {
            margin-bottom: 12px;
        }

        .footer-section ul a {
            color: #94A3B8;
            text-decoration: none;
            transition: color 0.3s;
        }

        .footer-section ul a:hover {
            color: #0EA5E9;
        }

        .contact-list li {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #94A3B8;
        }
        
        .contact-list li a {
            color: #94A3B8;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .contact-list li a:hover {
            color: #0EA5E9;
        }

        .contact-list .icon {
            font-size: 16px;
        }

        .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 30px;
        }

        .footer-bottom p {
            color: #64748B;
            font-size: 14px;
        }

        .footer-links {
            display: flex;
            gap: 24px;
        }

        .footer-links a {
            color: #64748B;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s;
        }

        .footer-links a:hover {
            color: #0EA5E9;
        }

        @media (max-width: 1024px) {
            .footer-grid {
                grid-template-columns: 1fr 1fr;
                gap: 40px;
            }
        }

        @media (max-width: 640px) {
            .footer-grid {
                grid-template-columns: 1fr;
                gap: 40px;

            }

            .footer-bottom {
                flex-direction: column;
                gap: 16px;
                text-align: center;
            }
        }
    `]
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
    readonly settingsService = inject(SettingsService);
    readonly settings = this.settingsService.settings;
}
