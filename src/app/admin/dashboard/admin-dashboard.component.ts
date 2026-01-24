import { Component, ChangeDetectionStrategy, signal, inject, OnInit, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AnalyticsOverview } from '../../core/models/cms.models';
import { AuthService } from '../../core/services/auth.service';
import { ActivityTimelineComponent } from './activity-timeline.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
    selector: 'app-admin-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, ActivityTimelineComponent, SkeletonComponent],
    template: `
        <div class="dashboard">
            <!-- Welcome Banner -->
            <div class="welcome-banner">
                <div class="welcome-content">
                    <h1>Welcome back, {{ auth.user()?.name || 'Admin' }}! 👋</h1>
                    <p>Here's what's happening with your site today.</p>
                </div>
                <div class="welcome-time">
                    {{ currentDate }}
                </div>
            </div>

            <!-- Stats Cards with Glassmorphism -->
            @if (loading()) {
                <div class="stats-grid">
                    @for (i of [1,2,3,4]; track i) {
                        <div class="stat-card glass skeleton-card">
                            <app-skeleton width="48px" height="48px" radius="12px" />
                            <div class="skeleton-content">
                                <app-skeleton width="80px" height="14px" />
                                <app-skeleton width="60px" height="32px" />
                                <app-skeleton width="100px" height="12px" />
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <div class="stats-grid">
                    <div class="stat-card glass">
                        <div class="stat-icon visitors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Today's Visitors</span>
                            <span class="stat-value">{{ animatedVisitors() }}</span>
                            <span class="stat-change positive">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                    <polyline points="18 15 12 9 6 15"/>
                                </svg>
                                +12% from yesterday
                            </span>
                        </div>
                    </div>

                    <div class="stat-card glass">
                        <div class="stat-icon views">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Page Views</span>
                            <span class="stat-value">{{ animatedPageViews() }}</span>
                            <span class="stat-change positive">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                    <polyline points="18 15 12 9 6 15"/>
                                </svg>
                                +8% from yesterday
                            </span>
                        </div>
                    </div>

                    <div class="stat-card glass">
                        <div class="stat-icon messages">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">New Messages</span>
                            <span class="stat-value">{{ animatedMessages() }}</span>
                            <a routerLink="/admin/messages" class="stat-link">View all →</a>
                        </div>
                    </div>

                    <div class="stat-card glass">
                        <div class="stat-icon applications">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                            </svg>
                        </div>
                        <div class="stat-content">
                            <span class="stat-label">Job Applications</span>
                            <span class="stat-value">{{ animatedApps() }}</span>
                            <a routerLink="/admin/careers" class="stat-link">View all →</a>
                        </div>
                    </div>
                </div>
            }

            <!-- Main Content Grid -->
            <div class="content-grid">
                <!-- Left Column -->
                <div class="left-column">
                    <!-- Quick Actions -->
                    <div class="section">
                        <h2>Quick Actions</h2>
                        <div class="quick-actions">
                            <a routerLink="/admin/pages" class="action-card">
                                <div class="action-icon">📝</div>
                                <span>Edit Pages</span>
                            </a>
                            <a routerLink="/admin/products/new" class="action-card">
                                <div class="action-icon">💊</div>
                                <span>Add Product</span>
                            </a>
                            <a routerLink="/admin/media" class="action-card">
                                <div class="action-icon">🖼️</div>
                                <span>Upload Media</span>
                            </a>
                            <a routerLink="/admin/events" class="action-card">
                                <div class="action-icon">📅</div>
                                <span>Create Event</span>
                            </a>
                        </div>
                    </div>


                </div>

                <!-- Right Column - Activity Timeline -->
                <div class="right-column">
                    <app-activity-timeline />
                </div>
            </div>
        </div>
    `,
    styles: [`
        .dashboard {
            max-width: 1400px;
        }

        .welcome-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%);
            border-radius: 20px;
            padding: 28px 32px;
            margin-bottom: 28px;
            color: white;
        }

        .welcome-content h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .welcome-content p {
            opacity: 0.9;
            font-size: 15px;
        }

        .welcome-time {
            font-size: 14px;
            opacity: 0.8;
            text-align: right;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            border-radius: 16px;
            padding: 24px;
            display: flex;
            gap: 16px;
            transition: all 0.3s ease;
        }

        .stat-card.glass {
            background: var(--bg-glass, rgba(255, 255, 255, 0.8));
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-light, rgba(255, 255, 255, 0.3));
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }

        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .skeleton-card {
            gap: 16px;
        }

        .skeleton-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .stat-icon {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .stat-icon.visitors { background: linear-gradient(135deg, #DBEAFE, #BFDBFE); color: #1D4ED8; }
        .stat-icon.views { background: linear-gradient(135deg, #D1FAE5, #A7F3D0); color: #047857; }
        .stat-icon.messages { background: linear-gradient(135deg, #FEF3C7, #FDE68A); color: #B45309; }
        .stat-icon.applications { background: linear-gradient(135deg, #EDE9FE, #DDD6FE); color: #6D28D9; }

        .stat-content {
            display: flex;
            flex-direction: column;
        }

        .stat-label {
            font-size: 13px;
            color: var(--text-muted, #64748B);
            margin-bottom: 4px;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: var(--text-primary, #1E293B);
            line-height: 1;
            margin-bottom: 6px;
        }

        .stat-change {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            font-weight: 500;
        }

        .stat-change.positive { color: #059669; }
        .stat-change.negative { color: #DC2626; }

        .stat-link {
            font-size: 13px;
            color: var(--primary-blue, #0EA5E9);
            text-decoration: none;
            font-weight: 500;
        }

        .stat-link:hover {
            text-decoration: underline;
        }

        .content-grid {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 28px;
        }

        .section {
            margin-bottom: 28px;
        }

        h2 {
            font-size: 18px;
            font-weight: 600;
            color: var(--text-primary, #1E293B);
            margin-bottom: 16px;
        }

        .quick-actions {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
        }

        .action-card {
            background: var(--bg-glass, rgba(255, 255, 255, 0.8));
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-light, #E2E8F0);
            border-radius: 14px;
            padding: 24px;
            text-align: center;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .action-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
            border-color: var(--primary-blue, #0EA5E9);
        }

        .action-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .action-card span {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary, #1E293B);
        }

        .table-container.glass {
            background: var(--bg-glass, rgba(255, 255, 255, 0.8));
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-light, #E2E8F0);
            border-radius: 14px;
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 16px 20px;
            text-align: left;
            border-bottom: 1px solid var(--border-light, #E2E8F0);
        }

        th {
            background: var(--bg-tertiary, #F8FAFC);
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted, #64748B);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            font-size: 14px;
            color: var(--text-primary, #1E293B);
        }

        tr:last-child td {
            border-bottom: none;
        }

        .views-badge {
            display: inline-block;
            padding: 4px 12px;
            background: var(--bg-tertiary, #F1F5F9);
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary, #475569);
        }

        @media (max-width: 1200px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            .content-grid {
                grid-template-columns: 1fr;
            }
            .quick-actions {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 640px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            .quick-actions {
                grid-template-columns: 1fr;
            }
            .welcome-banner {
                flex-direction: column;
                text-align: center;
                gap: 12px;
            }
            .welcome-time {
                text-align: center;
            }
        }
    `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly adminService = inject(AdminService);
    readonly auth = inject(AuthService);

    analytics = signal<AnalyticsOverview | null>(null);
    loading = signal(true);

    // Animated counter values
    animatedVisitors = signal(0);
    animatedPageViews = signal(0);
    animatedMessages = signal(0);
    animatedApps = signal(0);

    currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.loadAnalytics();
        }
    }

    ngAfterViewInit(): void {
        // Animations start after view init
    }

    loadAnalytics(): void {
        this.adminService.getAnalytics().subscribe({
            next: (data) => {
                this.analytics.set(data);
                this.loading.set(false);
                this.animateCounters(data);
            },
            error: (err) => {
                console.error('Failed to load analytics', err);
                this.loading.set(false);
                // Do not use demo data. Ensure real connection only.
            }
        });
    }

    private animateCounters(data: AnalyticsOverview): void {
        if (!isPlatformBrowser(this.platformId)) return;

        const duration = 1000;
        const steps = 30;
        const interval = duration / steps;

        const targets = {
            visitors: data.visitors.today,
            pageViews: data.pageViews.today,
            messages: data.contactStats.new,
            apps: data.applicationCount
        };

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            this.animatedVisitors.set(Math.round(targets.visitors * eased));
            this.animatedPageViews.set(Math.round(targets.pageViews * eased));
            this.animatedMessages.set(Math.round(targets.messages * eased));
            this.animatedApps.set(Math.round(targets.apps * eased));

            if (step >= steps) {
                clearInterval(timer);
                // Ensure final values are exact
                this.animatedVisitors.set(targets.visitors);
                this.animatedPageViews.set(targets.pageViews);
                this.animatedMessages.set(targets.messages);
                this.animatedApps.set(targets.apps);
            }
        }, interval);
    }
}
