import { Component, ChangeDetectionStrategy, signal, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../../../core/services/i18n.service';
import { ThemeService } from '../../../core/services/theme.service';

import { SettingsService } from '../../../core/services/settings.service';

@Component({
    selector: 'app-header',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, TranslateModule, NgOptimizedImage],
    template: `
        <header class="header" [class.scrolled]="isScrolled()">
            <div class="header-container">
                <a routerLink="/" class="logo">
                     @if (settings()?.logoUrl) {
                        <img [src]="settings()?.logoUrl" width="40" height="40" [alt]="settings()?.siteName || 'Logo'">
                    } @else {
                        <img ngSrc="assets/logo.png" width="40" height="40" alt="HAC Pharma Logo" priority>
                    }
                    
                    <div class="logo-text">
                        @if (settings()?.siteName) {
                            <span>{{ settings()?.siteName }}</span>
                        } @else {
                            <span>HAC</span>
                            <span class="green">Pharma</span>
                        }
                    </div>
                </a>

                <button class="menu-toggle" 
                        [class.open]="menuOpen()" 
                        (click)="toggleMenu()"
                        [attr.aria-label]="(menuOpen() ? 'header.aria.closeMenu' : 'header.aria.openMenu') | translate"
                        [attr.aria-expanded]="menuOpen()">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav class="nav" [class.open]="menuOpen()" role="navigation">
                    <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">{{ 'common.home' | translate }}</a>
                    <a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">{{ 'common.about' | translate }}</a>
                    <a routerLink="/services" routerLinkActive="active" (click)="closeMenu()">{{ 'common.services' | translate }}</a>
                    <a routerLink="/products" routerLinkActive="active" (click)="closeMenu()">{{ 'common.products' | translate }}</a>
                    <a routerLink="/team" routerLinkActive="active" (click)="closeMenu()">{{ 'common.team' | translate }}</a>
                    <a routerLink="/partners" routerLinkActive="active" (click)="closeMenu()">{{ 'common.partners' | translate }}</a>
                    <a routerLink="/careers" routerLinkActive="active" (click)="closeMenu()">{{ 'common.careers' | translate }}</a>
                    <a routerLink="/events" routerLinkActive="active" (click)="closeMenu()">{{ 'common.events' | translate }}</a>
                    <a routerLink="/news" routerLinkActive="active" (click)="closeMenu()">{{ 'common.news' | translate }}</a>
                    
                    <div class="nav-controls">
                        <!-- Language Toggle -->
                        <button class="control-btn lang-btn" 
                                (click)="toggleLanguage()"
                                [attr.aria-label]="'header.aria.switchLanguage' | translate">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <span>{{ 'common.switchLanguage' | translate }}</span>
                        </button>

                        <!-- Theme Toggle -->
                        <button class="control-btn theme-btn" 
                                (click)="toggleTheme()"
                                [attr.aria-label]="(themeService.isDark() ? 'header.aria.switchLight' : 'header.aria.switchDark') | translate">
                            @if (themeService.isDark()) {
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            } @else {
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            }
                        </button>
                    </div>

                    <a routerLink="/contact" class="btn-contact" (click)="closeMenu()">{{ 'common.contact' | translate }}</a>
                </nav>
            </div>
        </header>
    `,
    styles: [`
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 20px 0;
            transition: all 0.3s ease;
        }

        .header.scrolled {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            padding: 12px 0;
        }

        :host-context(body.dark-theme) .header.scrolled {
            background: rgba(15, 23, 42, 0.95);
        }

        .header-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            z-index: 1001;
            transition: all 0.3s ease;
        }

        .logo img {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.2));
        }

        .logo:hover img {
            transform: scale(1.1) rotate(5deg);
            filter: drop-shadow(0 0 15px rgba(14, 165, 233, 0.5));
        }

        .logo:hover .logo-text {
            letter-spacing: 0.5px;
        }

        .logo-text {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, #0EA5E9 0%, #10B981 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            transition: all 0.3s ease;
            margin-inline-start: 12px;
        }

        .logo-text .green {
            color: #10B981;
        }

        .nav {
            display: flex;
            align-items: center;
            gap: 28px;
        }

        .nav a {
            color: #1E293B;
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
            transition: color 0.3s;
            position: relative;
        }

        :host-context(body.dark-theme) .nav a {
            color: #F1F5F9;
        }

        .nav a:not(.btn-contact)::after {
            content: '';
            position: absolute;
            bottom: -4px;
            inset-inline-start: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #0EA5E9, #10B981);
            transition: width 0.3s;
        }

        .nav a:not(.btn-contact):hover::after,
        .nav a:not(.btn-contact).active::after {
            width: 100%;
        }

        .nav a:hover {
            color: #0EA5E9;
        }

        .nav-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .control-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            background: transparent;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            color: #64748B;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }

        :host-context(body.dark-theme) .control-btn {
            border-color: #334155;
            color: #94A3B8;
        }

        .control-btn:hover {
            border-color: #0EA5E9;
            color: #0EA5E9;
            background: rgba(14, 165, 233, 0.05);
        }

        .theme-btn {
            padding: 8px;
        }

        .btn-contact {
            padding: 10px 24px;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            color: white !important;
            border-radius: 50px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
            transition: all 0.3s;
        }

        .btn-contact:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
        }

        .btn-contact::after {
            display: none !important;
        }

        .menu-toggle {
            display: none;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            cursor: pointer;
            z-index: 1001;
            padding: 5px;
        }

        .menu-toggle span {
            width: 25px;
            height: 3px;
            background: #1E293B;
            border-radius: 3px;
            transition: all 0.3s;
        }

        :host-context(body.dark-theme) .menu-toggle span {
            background: #F1F5F9;
        }

        .menu-toggle.open span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }

        .menu-toggle.open span:nth-child(2) {
            opacity: 0;
        }

        .menu-toggle.open span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }

        @media (max-width: 1200px) {
            .nav {
                gap: 20px;
            }
            .lang-btn span {
                display: none;
            }
            .lang-btn {
                padding: 8px;
            }
        }

        @media (max-width: 1024px) {
            .menu-toggle {
                display: flex;
            }

            .nav {
                position: fixed;
                top: 0;
                right: -100%;
                width: 100%;
                height: 100vh;
                background: white;
                flex-direction: column;
                justify-content: center;
                gap: 24px;
                transition: right 0.4s ease;
            }

            :host-context(body.dark-theme) .nav {
                background: #0F172A;
            }

            .nav.open {
                right: 0;
            }

            .nav a {
                font-size: 20px;
            }

            .nav-controls {
                margin-top: 20px;
            }

            .lang-btn span {
                display: inline;
            }
            .lang-btn {
                padding: 8px 12px;
            }
        }
    `],
    host: {
        '(window:scroll)': 'onScroll()'
    }
})
export class HeaderComponent {
    private platformId = inject(PLATFORM_ID);
    readonly settingsService = inject(SettingsService);
    readonly settings = this.settingsService.settings;

    readonly i18nService = inject(I18nService);
    readonly themeService = inject(ThemeService);

    isScrolled = signal(false);
    menuOpen = signal(false);

    onScroll(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.isScrolled.set(window.scrollY > 50);
        }
    }

    toggleMenu(): void {
        this.menuOpen.update(v => !v);
    }

    closeMenu(): void {
        this.menuOpen.set(false);
    }

    toggleLanguage(): void {
        this.i18nService.toggleLanguage();
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
