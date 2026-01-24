import { Component, ChangeDetectionStrategy, signal, inject, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
    selector: 'app-notification-dropdown',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="notification-wrapper">
            <button class="notification-btn" (click)="toggleDropdown()" [class.has-unread]="notificationService.unreadCount() > 0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                @if (notificationService.unreadCount() > 0) {
                    <span class="badge">{{ notificationService.unreadCount() }}</span>
                }
            </button>

            @if (isOpen()) {
                <div class="dropdown">
                    <div class="dropdown-header">
                        <span>Notifications</span>
                        @if (notificationService.unreadCount() > 0) {
                            <button class="mark-all-btn" (click)="notificationService.markAllAsRead()">
                                Mark all read
                            </button>
                        }
                    </div>

                    <div class="dropdown-content">
                        @for (notification of notificationService.notifications(); track notification.id) {
                            <div 
                                class="notification-item" 
                                [class.unread]="!notification.read"
                                (click)="handleClick(notification)"
                            >
                                <div class="notification-icon" [attr.data-type]="notification.type">
                                    {{ notificationService.getNotificationIcon(notification.type) }}
                                </div>
                                <div class="notification-content">
                                    <div class="notification-title">{{ notification.title }}</div>
                                    <div class="notification-message">{{ notification.message }}</div>
                                    <div class="notification-time">{{ notificationService.getRelativeTime(notification.timestamp) }}</div>
                                </div>
                                @if (!notification.read) {
                                    <div class="unread-dot"></div>
                                }
                            </div>
                        } @empty {
                            <div class="empty-state">
                                <span class="empty-icon">🔔</span>
                                <p>No notifications</p>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    `,
    styles: [`
        .notification-wrapper {
            position: relative;
        }

        .notification-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-tertiary, #F1F5F9);
            border: none;
            border-radius: 10px;
            color: var(--text-muted, #64748B);
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .notification-btn:hover {
            background: var(--primary-blue, #0EA5E9);
            color: white;
        }

        .notification-btn.has-unread {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
            50% { box-shadow: 0 0 0 8px rgba(14, 165, 233, 0); }
        }

        .badge {
            position: absolute;
            top: -4px;
            right: -4px;
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            background: #EF4444;
            color: white;
            font-size: 11px;
            font-weight: 600;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            width: 360px;
            background: var(--bg-card, rgba(255, 255, 255, 0.98));
            backdrop-filter: blur(12px);
            border-radius: 16px;
            box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-light, #E2E8F0);
            overflow: hidden;
            animation: slideDown 0.2s ease;
            z-index: 1000;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-light, #E2E8F0);
        }

        .dropdown-header span {
            font-size: 15px;
            font-weight: 600;
            color: var(--text-primary, #1E293B);
        }

        .mark-all-btn {
            background: none;
            border: none;
            color: var(--primary-blue, #0EA5E9);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
        }

        .mark-all-btn:hover {
            text-decoration: underline;
        }

        .dropdown-content {
            max-height: 360px;
            overflow-y: auto;
        }

        .notification-item {
            display: flex;
            gap: 12px;
            padding: 14px 20px;
            cursor: pointer;
            transition: background 0.2s;
            position: relative;
        }

        .notification-item:hover {
            background: var(--bg-tertiary, #F1F5F9);
        }

        .notification-item.unread {
            background: rgba(14, 165, 233, 0.05);
        }

        .notification-icon {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            background: var(--bg-tertiary, #F1F5F9);
            flex-shrink: 0;
        }

        .notification-content {
            flex: 1;
            min-width: 0;
        }

        .notification-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary, #1E293B);
            margin-bottom: 2px;
        }

        .notification-message {
            font-size: 13px;
            color: var(--text-secondary, #475569);
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .notification-time {
            font-size: 12px;
            color: var(--text-muted, #64748B);
        }

        .unread-dot {
            width: 8px;
            height: 8px;
            background: var(--primary-blue, #0EA5E9);
            border-radius: 50%;
            flex-shrink: 0;
            margin-top: 6px;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-muted, #64748B);
        }

        .empty-icon {
            font-size: 32px;
            display: block;
            margin-bottom: 8px;
            opacity: 0.5;
        }
    `]
})
export class NotificationDropdownComponent {
    private readonly elementRef = inject(ElementRef);
    private readonly router = inject(Router);
    readonly notificationService = inject(NotificationService);

    readonly isOpen = signal(false);

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }

    toggleDropdown(): void {
        this.isOpen.update(v => !v);
    }

    handleClick(notification: Notification): void {
        this.notificationService.markAsRead(notification.id);
        if (notification.link) {
            this.router.navigate([notification.link]);
            this.isOpen.set(false);
        }
    }
}
