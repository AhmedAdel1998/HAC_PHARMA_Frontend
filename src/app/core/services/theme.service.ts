import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly platformId = inject(PLATFORM_ID);

    private readonly currentTheme = signal<Theme>('light');

    readonly theme = computed(() => this.currentTheme());
    readonly isDark = computed(() => this.currentTheme() === 'dark');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem('hac-theme') as Theme;
            // Force default to light if no saved theme, ignoring system preference for now as per user request
            const defaultTheme = savedTheme || 'light';
            this.setTheme(defaultTheme);

            // Listen for system theme changes (Optional: keep or remove depending on strictness)
            // For now, we'll respect manual toggles over system changes to ensure stability
        }
    }

    setTheme(theme: Theme): void {
        this.currentTheme.set(theme);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('hac-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            document.body.classList.toggle('dark-theme', theme === 'dark');
        }
    }

    toggleTheme(): void {
        const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}
