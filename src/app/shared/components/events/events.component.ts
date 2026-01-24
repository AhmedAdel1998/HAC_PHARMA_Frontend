import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/cms.models';

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-events',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, HeaderComponent, FooterComponent, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'events.label' | translate }}</span>
                    <h1>{{ 'events.hero.title' | translate }}</h1>
                    <p>{{ 'events.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- Events Grid -->
            <!-- Events Grid -->
            @defer (on viewport) {
            <section class="events-section">
                <div class="container">
                    @if (loading()) {
                        <div class="loading-state">
                            <div class="spinner"></div>
                            <p>{{ 'common.loading' | translate }}</p>
                        </div>
                    } @else if (events().length === 0) {
                        <div class="empty-state">
                            <span style="font-size: 48px; display: block; margin-bottom: 16px;">📅</span>
                            <h3>{{ 'events.empty.title' | translate }}</h3>
                            <p>{{ 'events.empty.subtitle' | translate }}</p>
                        </div>
                    } @else {
                        <div class="events-grid">
                            @for (event of events(); track event.id) {
                                <article class="event-card fade-in">
                                    <div class="card-header">
                                        <div class="date-badge">
                                            <span class="month">{{ event.date | date:'MMM' }}</span>
                                            <span class="day">{{ event.date | date:'dd' }}</span>
                                        </div>
                                        <span class="type-badge" [class]="event.type">
                                            {{ 'events.types.' + event.type | translate }}
                                        </span>
                                    </div>
                                    
                                    <div class="card-content">
                                        <div class="time-location">
                                            <span class="time">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                {{ event.date | date:'shortTime' }}
                                            </span>
                                        </div>

                                        <h3>{{ isArabic() ? event.titleAr || event.title : event.title }}</h3>
                                        <p>{{ event.description }}</p>

                                        @if (event.registrationUrl) {
                                            <a [href]="event.registrationUrl" target="_blank" class="btn-register">
                                                {{ 'events.register' | translate }}
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                    <polyline points="15 3 21 3 21 9"></polyline>
                                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                                </svg>
                                            </a>
                                        }
                                    </div>
                                </article>
                            }
                        </div>
                    }
                </div>
            </section>
            } @placeholder {
                <section class="events-section" style="min-height: 500px"></section>
            }
        </main>

        <app-footer />
    `,
    styles: [`
        .page-content { padding-top: 80px; }
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

        .hero-section {
            background: linear-gradient(135deg, #0F172A, #1E293B);
            color: white;
            padding: 100px 0;
            text-align: center;
        }

        .hero-section .label {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(14, 165, 233, 0.2);
            color: #0EA5E9;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .hero-section h1 { font-size: 48px; font-weight: 800; margin-bottom: 20px; }
        .hero-section p { font-size: 20px; color: #94A3B8; max-width: 600px; margin: 0 auto; }

        .events-section { padding: 80px 0; background: #F8FAFC; min-height: 500px; }

        .loading-state, .empty-state {
            text-align: center;
            padding: 60px;
            color: #64748B;
        }

        .empty-state h3 { color: #1E293B; font-size: 24px; margin-bottom: 8px; }

        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
        }

        .event-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #E2E8F0;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
        }

        .event-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
            border-color: #0EA5E9;
        }

        .card-header {
            padding: 24px;
            border-bottom: 1px solid #F1F5F9;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .date-badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            width: 64px;
            height: 64px;
        }

        .date-badge .month {
            font-size: 12px;
            font-weight: 700;
            color: #EF4444;
            text-transform: uppercase;
        }

        .date-badge .day {
            font-size: 24px;
            font-weight: 800;
            color: #1E293B;
            line-height: 1;
        }

        .type-badge {
            padding: 6px 12px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .type-badge.webinar { background: #E0E7FF; color: #4338CA; }
        .type-badge.conference { background: #FAE8FF; color: #86198F; }
        .type-badge.training { background: #DCFCE7; color: #16A34A; }

        .card-content { padding: 24px; flex: 1; display: flex; flex-direction: column; }

        .time-location {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            color: #64748B;
            font-size: 14px;
        }

        .time { display: flex; align-items: center; gap: 6px; }

        .card-content h3 {
            font-size: 20px;
            font-weight: 700;
            color: #1E293B;
            margin-bottom: 12px;
            line-height: 1.4;
        }

        .card-content p {
            color: #64748B;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 24px;
            flex: 1;
        }

        .btn-register {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #0EA5E9;
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
        }

        .btn-register:hover {
            background: #0284C7;
            transform: translateY(-2px);
        }

        @media (max-width: 640px) {
            .events-grid { grid-template-columns: 1fr; }
            .hero-section h1 { font-size: 32px; }
        }
    `]
})
export class EventsComponent implements OnInit {
    private readonly eventService = inject(EventService);
    private readonly translate = inject(TranslateService);

    events = signal<Event[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.eventService.getUpcomingEvents().subscribe({
            next: (data) => {
                this.events.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load events', err);
                this.loading.set(false);
            }
        });
    }

    isArabic(): boolean {
        return this.translate.currentLang === 'ar';
    }
}
