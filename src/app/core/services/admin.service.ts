import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AnalyticsOverview, SiteSettings, User, PaginatedResponse } from '../models/cms.models';
import { AuthService } from './auth.service';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);

    // Analytics
    getAnalytics(): Observable<AnalyticsOverview> {
        return this.http.get<AnalyticsOverview>(`${environment.apiUrl}/analytics/overview`);
    }

    // Settings
    getSettings(): Observable<SiteSettings> {
        return this.http.get<SiteSettings>(`${environment.apiUrl}/settings`);
    }

    updateSettings(settings: Partial<SiteSettings>): Observable<SiteSettings> {
        return this.http.put<SiteSettings>(`${environment.apiUrl}/settings`, settings, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // User Management
    getUsers(): Observable<User[]> {
        return this.http.get<PaginatedResponse<User>>(`${environment.apiUrl}/users`).pipe(
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
        return this.http.post<User>(`${environment.apiUrl}/users`, payload);
    }

    updateUser(id: number, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${environment.apiUrl}/users/${id}`, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
    }
}
