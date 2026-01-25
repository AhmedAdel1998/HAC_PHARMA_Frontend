import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, LoginRequest, AuthResponse } from '../models/cms.models';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly API_URL = `${environment.apiUrl}/auth`;

    private readonly currentUser = signal<User | null>(null);
    private readonly token = signal<string | null>(null);

    readonly user = computed(() => this.currentUser());
    readonly isAuthenticated = computed(() => !!this.token());
    readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');
    readonly isEditor = computed(() => ['Admin', 'Editor'].includes(this.currentUser()?.role || ''));

    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = signal(false);

    constructor() {
        // Check platform and update signal
        if (isPlatformBrowser(this.platformId)) {
            this.isBrowser.set(true);
            this.loadStoredAuth();
        }
    }

    private loadStoredAuth(): void {
        if (!this.isBrowser()) return;

        try {
            const storedToken = localStorage.getItem('hac_token');
            const storedUser = localStorage.getItem('hac_user');

            if (storedToken && storedToken !== 'null' && storedUser && storedUser !== 'null') {
                const user = JSON.parse(storedUser);
                this.token.set(storedToken);
                this.currentUser.set(user);
                console.log('AuthService: Session restored successfully', { role: user.role });
            } else {
                console.log('AuthService: No stored session found');
            }
        } catch (e) {
            console.error('AuthService: Error restoring session', e);
            this.logout();
        }
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
            tap(response => {
                this.token.set(response.token);
                this.currentUser.set(response.user);
                localStorage.setItem('hac_token', response.token);
                localStorage.setItem('hac_refresh_token', response.refreshToken);
                localStorage.setItem('hac_user', JSON.stringify(response.user));
                console.log('AuthService: Login successful, session stored', { role: response.user.role });
            })
        );
    }

    logout(): void {
        this.token.set(null);
        this.currentUser.set(null);
        localStorage.removeItem('hac_token');
        localStorage.removeItem('hac_refresh_token');
        localStorage.removeItem('hac_user');
        this.router.navigate(['/admin/login']);
    }

    refreshToken(): Observable<AuthResponse | null> {
        const refreshToken = localStorage.getItem('hac_refresh_token');
        if (!refreshToken) return of(null);

        return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
            tap(response => {
                this.token.set(response.token);
                localStorage.setItem('hac_token', response.token);
            }),
            catchError(() => {
                this.logout();
                return of(null);
            })
        );
    }

    getAuthHeaders(): HttpHeaders {
        const token = this.token();
        if (!token) {
            console.warn('AuthService: Requesting headers but NO TOKEN available');
        }
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getToken(): string | null {
        return this.token();
    }
}
