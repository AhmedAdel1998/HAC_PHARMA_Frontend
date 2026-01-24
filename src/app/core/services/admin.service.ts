import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AnalyticsOverview, SiteSettings, User, PaginatedResponse } from '../models/cms.models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);

    // Analytics
    getAnalytics(): Observable<AnalyticsOverview> {
        return this.http.get<AnalyticsOverview>('/api/analytics/overview');
    }

    // Settings
    getSettings(): Observable<SiteSettings> {
        return this.http.get<SiteSettings>('/api/settings');
    }

    updateSettings(settings: Partial<SiteSettings>): Observable<SiteSettings> {
        return this.http.put<SiteSettings>('/api/settings', settings, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // User Management
    getUsers(): Observable<User[]> {
        return this.http.get<PaginatedResponse<User>>('/api/users').pipe(
            map(response => response.items || [])
        );
    }

    createUser(user: { email: string; password: string; name: string; role: string }): Observable<User> {
        // Split name into First/Last for backend DTO
        const nameParts = user.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const payload = {
            email: user.email,
            password: user.password,
            firstName: firstName,
            lastName: lastName,
            role: user.role
        };
        return this.http.post<User>('/api/users', payload);
    }

    updateUser(id: number, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`/api/users/${id}`, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`/api/users/${id}`);
    }
}
