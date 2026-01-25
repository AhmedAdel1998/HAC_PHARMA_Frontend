import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteSettings } from '../models/cms.models';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private readonly http = inject(HttpClient);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly API_URL = `${environment.apiUrl}/settings/public`;

    // Signal to hold settings
    settings = signal<Partial<SiteSettings> | null>(null);

    constructor() {
        this.loadSettings();
    }

    loadSettings() {
        if (!isPlatformBrowser(this.platformId)) {
            // SSR Default Settings
            this.settings.set({
                siteName: 'HAC Pharma',
                socialLinks: {
                    linkedin: 'https://linkedin.com',
                    twitter: 'https://twitter.com',
                    facebook: 'https://facebook.com',
                    instagram: 'https://instagram.com',
                    youtube: 'https://youtube.com'
                }
            });
            return;
        }

        this.http.get<Partial<SiteSettings>>(this.API_URL).subscribe({
            next: (data) => {
                this.settings.set(data);
                this.updateTitleAndFavicon(data);
            },
            error: (err) => {
                console.error('Failed to load public settings', err);
                // Fallback on error
                this.settings.set({
                    siteName: 'HAC Pharma',
                    socialLinks: {
                        linkedin: 'https://linkedin.com',
                        twitter: 'https://twitter.com',
                        facebook: 'https://facebook.com',
                        instagram: 'https://instagram.com',
                        youtube: 'https://youtube.com'
                    }
                });
            }
        });
    }

    private updateTitleAndFavicon(settings: Partial<SiteSettings>) {
        if (settings.siteName) {
            document.title = settings.siteName;
        }
        if (settings.faviconUrl) {
            const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (link) {
                link.href = settings.faviconUrl;
            }
        }
    }
}
