import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

@Component({
    selector: 'app-scheduler',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'scheduler.label' | translate }}</span>
                    <h1>{{ 'scheduler.hero.title' | translate }}</h1>
                    <p>{{ 'scheduler.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- Scheduler Interface -->
            <section class="scheduler-section">
                <div class="container">
                    <div class="scheduler-card">
                        <div class="meeting-types">
                            <h3>{{ 'scheduler.selectType' | translate }}</h3>
                            <div class="types-grid">
                                @for (type of meetingTypes; track type.id) {
                                    <button class="type-card">
                                        <span class="icon">{{ type.icon }}</span>
                                        <div class="type-info">
                                            <h4>{{ type.title | translate }}</h4>
                                            <span class="duration">{{ type.duration }}</span>
                                        </div>
                                        <p>{{ type.description | translate }}</p>
                                    </button>
                                }
                            </div>
                        </div>

                        <div class="calendar-view">
                            <div class="placeholder-content">
                                <div class="calendly-logo">C</div>
                                <h4>{{ 'scheduler.calendly.title' | translate }}</h4>
                                <p>{{ 'scheduler.calendly.subtitle' | translate }}</p>
                                <div class="mock-calendar">
                                    <div class="mock-header"></div>
                                    <div class="mock-grid"></div>
                                </div>
                                <p class="helper-text">{{ 'scheduler.prompt' | translate }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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

        .scheduler-section { padding: 80px 0; background: #F8FAFC; }

        .scheduler-card {
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.05);
            border: 1px solid #E2E8F0;
            display: grid;
            grid-template-columns: 350px 1fr;
            min-height: 600px;
            overflow: hidden;
        }

        .meeting-types {
            padding: 30px;
            border-right: 1px solid #E2E8F0;
            background: #fff;
        }

        .meeting-types h3 {
            font-size: 18px;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 24px;
        }

        .types-grid { display: flex; flex-direction: column; gap: 16px; }

        .type-card {
            text-align: left;
            padding: 20px;
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
        }

        .type-card:hover { border-color: #0EA5E9; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1); }

        .type-card .icon { font-size: 24px; margin-bottom: 12px; display: block; }
        
        .type-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .type-info h4 { color: #1E293B; font-size: 16px; }
        .type-info .duration { font-size: 13px; color: #64748B; background: #F1F5F9; padding: 2px 8px; border-radius: 4px; }
        
        .type-card p { color: #64748B; font-size: 13px; line-height: 1.5; margin: 0; }

        .calendar-view {
            padding: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F8FAFC;
        }

        .placeholder-content { text-align: center; max-width: 400px; }
        
        .calendly-logo {
            width: 60px; height: 60px; background: #006BFF; color: white;
            font-size: 32px; font-weight: bold; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
        }

        .placeholder-content h4 { font-size: 24px; color: #1E293B; margin-bottom: 12px; }
        .placeholder-content p { color: #64748B; margin-bottom: 32px; }
        .helper-text { font-size: 14px; color: #94A3B8; margin-top: 24px; }

        .mock-calendar {
            background: white; border: 1px solid #E2E8F0; border-radius: 12px;
            height: 200px; width: 300px; margin: 0 auto; padding: 16px; opacity: 0.5;
        }
        .mock-header { height: 20px; background: #F1F5F9; border-radius: 4px; margin-bottom: 16px; }
        .mock-grid { height: 140px; background: #F8FAFC; border-radius: 4px; border: 2px dashed #E2E8F0; }

        @media (max-width: 1024px) {
            .scheduler-card { grid-template-columns: 1fr; }
            .meeting-types { border-right: none; border-bottom: 1px solid #E2E8F0; }
        }
    `]
})
export class SchedulerComponent {
    meetingTypes = [
        {
            id: 'intro',
            title: 'scheduler.types.intro.title',
            duration: '15 min',
            description: 'scheduler.types.intro.desc',
            icon: '👋'
        },
        {
            id: 'partnership',
            title: 'scheduler.types.partnership.title',
            duration: '30 min',
            description: 'scheduler.types.partnership.desc',
            icon: '🤝'
        },
        {
            id: 'product',
            title: 'scheduler.types.product.title',
            duration: '45 min',
            description: 'scheduler.types.product.desc',
            icon: '💊'
        },
        {
            id: 'regulatory',
            title: 'scheduler.types.regulatory.title',
            duration: '60 min',
            description: 'scheduler.types.regulatory.desc',
            icon: '📋'
        }
    ];
}
