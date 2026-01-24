import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { ActivityService, ActivityItem } from '../../core/services/activity.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
    selector: 'app-activity-timeline',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SkeletonComponent],
    template: `
        <div class="timeline-container">
            <div class="timeline-header">
                <h3>Recent Activity</h3>
                <button class="btn-refresh" (click)="loadActivities()" [disabled]="loading()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.spinning]="loading()">
                        <polyline points="23 4 23 10 17 10"/>
                        <polyline points="1 20 1 14 7 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                </button>
            </div>

            @if (loading()) {
                <div class="timeline-skeleton">
                    @for (i of [1,2,3,4]; track i) {
                        <div class="skeleton-item">
                            <app-skeleton width="40px" height="40px" [circle]="true" />
                            <div class="skeleton-content">
                                <app-skeleton width="60%" height="14px" />
                                <app-skeleton width="80%" height="12px" />
                                <app-skeleton width="40%" height="10px" />
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <div class="timeline">
                    @for (activity of activities(); track activity.id; let last = $last) {
                        <div class="timeline-item" [class.last]="last">
                            <div class="timeline-icon" [attr.data-type]="activity.type">
                                {{ activityService.getActivityIcon(activity.type) }}
                            </div>
                            <div class="timeline-line"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">{{ activity.title }}</div>
                                <div class="timeline-description">{{ activity.description }}</div>
                                <div class="timeline-meta">
                                    <span class="timeline-user">{{ activity.user }}</span>
                                    <span class="timeline-dot">•</span>
                                    <span class="timeline-time">{{ activityService.getRelativeTime(activity.timestamp) }}</span>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }

            @if (!loading() && activities().length === 0) {
                <div class="empty-state">
                    <span class="empty-icon">📋</span>
                    <p>No recent activity</p>
                </div>
            }
        </div>
    `,
    styles: [`
        .timeline-container {
            background: var(--bg-card, rgba(255, 255, 255, 0.9));
            backdrop-filter: blur(12px);
            border-radius: 16px;
            padding: 20px;
            box-shadow: var(--card-shadow, 0 10px 30px -5px rgba(0, 0, 0, 0.1));
            border: 1px solid var(--border-light, #E2E8F0);
        }

        .timeline-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .timeline-header h3 {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary, #1E293B);
        }

        .btn-refresh {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-tertiary, #F1F5F9);
            border: none;
            border-radius: 8px;
            color: var(--text-muted, #64748B);
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-refresh:hover {
            background: var(--primary-blue, #0EA5E9);
            color: white;
        }

        .btn-refresh:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .spinning {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .timeline-skeleton {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .skeleton-item {
            display: flex;
            gap: 12px;
        }

        .skeleton-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .timeline {
            display: flex;
            flex-direction: column;
        }

        .timeline-item {
            display: flex;
            gap: 12px;
            position: relative;
            padding-bottom: 20px;
        }

        .timeline-item.last {
            padding-bottom: 0;
        }

        .timeline-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            background: var(--bg-tertiary, #F1F5F9);
            z-index: 1;
        }

        .timeline-line {
            position: absolute;
            left: 19px;
            top: 44px;
            bottom: 0;
            width: 2px;
            background: var(--border-light, #E2E8F0);
        }

        .timeline-item.last .timeline-line {
            display: none;
        }

        .timeline-content {
            flex: 1;
            padding-top: 2px;
        }

        .timeline-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary, #1E293B);
            margin-bottom: 4px;
        }

        .timeline-description {
            font-size: 13px;
            color: var(--text-secondary, #475569);
            margin-bottom: 6px;
        }

        .timeline-meta {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: var(--text-muted, #64748B);
        }

        .timeline-dot {
            font-size: 8px;
        }

        .empty-state {
            text-align: center;
            padding: 32px;
            color: var(--text-muted, #64748B);
        }

        .empty-icon {
            font-size: 32px;
            display: block;
            margin-bottom: 8px;
        }
    `]
})
export class ActivityTimelineComponent implements OnInit {
    readonly activityService = inject(ActivityService);

    readonly activities = signal<ActivityItem[]>([]);
    readonly loading = signal(true);

    ngOnInit(): void {
        this.loadActivities();
    }

    loadActivities(): void {
        this.loading.set(true);
        this.activityService.getRecentActivities(6).subscribe({
            next: (data) => {
                this.activities.set(data);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }
}
