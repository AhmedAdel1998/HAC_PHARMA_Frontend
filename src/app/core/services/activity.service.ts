import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface ActivityItem {
    id: number;
    type: 'page_update' | 'product_add' | 'product_update' | 'rfq_received' | 'user_login' | 'media_upload' | 'settings_change';
    title: string;
    description: string;
    user: string;
    userAvatar?: string;
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);

    getRecentActivities(limit = 10): Observable<ActivityItem[]> {
        return this.http.get<ActivityItem[]>('/api/analytics/activity', {
            headers: this.auth.getAuthHeaders()
        }).pipe(
            map(activities => activities.map(item => ({
                ...item,
                timestamp: new Date(item.timestamp) // Ensure Date objects
            })).slice(0, limit)),
            catchError(() => of([]))
        );
    }

    getActivityIcon(type: ActivityItem['type']): string {
        const icons: Record<ActivityItem['type'], string> = {
            page_update: '📝',
            product_add: '➕',
            product_update: '✏️',
            rfq_received: '📩',
            user_login: '👤',
            media_upload: '🖼️',
            settings_change: '⚙️'
        };
        return icons[type] || '📋';
    }

    getRelativeTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }
}
