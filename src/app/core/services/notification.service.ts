import { Injectable, signal, inject, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignalRService } from './signalr.service';

export interface Notification {
    id: number;
    type: 'rfq' | 'application' | 'system' | 'alert';
    title: string;
    message: string;
    timestamp: Date; // mapped from CreatedAt
    createdAt: Date;
    read: boolean;   // mapped from IsRead
    isRead: boolean;
    link?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    private signalRService = inject(SignalRService);
    private platformId = inject(PLATFORM_ID);
    private apiUrl = `${environment.apiUrl}/Notifications`;

    readonly notifications = signal<Notification[]>([]);
    readonly unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.initialize();
        }
    }

    private initialize() {
        this.loadNotifications();

        // Start SignalR connection
        this.signalRService.startConnection();

        // Listen for new notifications
        this.signalRService.addListener('ReceiveNotification', (notification: any) => {
            this.handleNewNotification(this.mapNotification(notification));
        });
    }

    private loadNotifications(): void {
        this.http.get<Notification[]>(this.apiUrl).subscribe({
            next: (data) => {
                const mapped = data.map(n => this.mapNotification(n));
                this.notifications.set(mapped);
            },
            error: (err) => console.error('Failed to load notifications', err)
        });
    }

    private handleNewNotification(notification: Notification) {
        // Add to top of list
        this.notifications.update(current => [notification, ...current]);

        // Optional: Play sound or show toast here
    }

    private mapNotification(n: any): Notification {
        // Map backend properties to frontend interface if needed
        // Assuming backend returns PascalCase or matching camelCase, but handling both just in case
        return {
            ...n,
            timestamp: new Date(n.createdAt || n.CreatedAt),
            read: n.isRead || n.IsRead,
            isRead: n.isRead || n.IsRead,
            // Ensure type is lowercase for icon mapping
            type: n.type?.toLowerCase() || n.Type?.toLowerCase() || 'system'
        };
    }

    markAsRead(id: number): void {
        // Optimistic update
        this.notifications.update(notifications =>
            notifications.map(n =>
                n.id === id ? { ...n, read: true, isRead: true } : n
            )
        );

        this.http.post(`${this.apiUrl}/${id}/read`, {}).subscribe({
            error: (err) => {
                console.error('Failed to mark as read', err);
                // Revert if needed, but usually not critical for read status
            }
        });
    }

    markAllAsRead(): void {
        // Optimistic update
        this.notifications.update(notifications =>
            notifications.map(n => ({ ...n, read: true, isRead: true }))
        );

        this.http.post(`${this.apiUrl}/read-all`, {}).subscribe({
            error: (err) => console.error('Failed to mark all as read', err)
        });
    }

    getNotificationIcon(type: Notification['type']): string {
        const icons: Record<string, string> = {
            rfq: '📩',
            application: '💼',
            system: '🔧',
            alert: '⚠️'
        };
        return icons[type] || '🔍';
    }

    getRelativeTime(date: Date): string {
        if (!date) return '';
        const now = new Date();
        const diffMs = now.getTime() - new Date(date).getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(date).toLocaleDateString();
    }
}
