import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'ar';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly translate = inject(TranslateService);

    private readonly currentLang = signal<Language>('en');

    readonly lang = computed(() => this.currentLang());
    readonly isRtl = computed(() => this.currentLang() === 'ar');
    readonly dir = computed(() => this.isRtl() ? 'rtl' : 'ltr');

    constructor() {
        this.translate.addLangs(['en', 'ar']);
        this.translate.setDefaultLang('en');

        if (isPlatformBrowser(this.platformId)) {
            const savedLang = localStorage.getItem('hac-lang') as Language;
            const browserLang = this.translate.getBrowserLang();
            const defaultLang = savedLang || (browserLang === 'ar' ? 'ar' : 'en');
            this.setLanguage(defaultLang);
        } else {
            this.translate.use('en');
        }
    }

    setLanguage(lang: Language): void {
        this.currentLang.set(lang);
        this.translate.use(lang);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('hac-lang', lang);
            document.documentElement.setAttribute('dir', this.dir());
            document.documentElement.setAttribute('lang', lang);
            document.body.classList.toggle('rtl', this.isRtl());
        }
    }

    toggleLanguage(): void {
        const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
        this.setLanguage(newLang);
    }

    instant(key: string, params?: object): string {
        return this.translate.instant(key, params);
    }
}
