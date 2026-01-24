import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    image: string;
}

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-team',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'team.hero.label' | translate }}</span>
                    <h1>{{ 'team.hero.title' | translate }}</h1>
                    <p>{{ 'team.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- Leadership Team -->
            <!-- Leadership Team -->
            @defer (on viewport) {
            <section class="team-section">
                <div class="container">
                    <h2 class="section-title fade-in">{{ 'team.leadership.title' | translate }}</h2>
                    <div class="team-grid">
                        @for (member of leadershipTeam; track member.name) {
                            <div class="team-card fade-in">
                                <div class="member-image">
                                    <div class="image-placeholder">{{ getInitials(member.name) }}</div>
                                </div>
                                <div class="member-info">
                                    <h3>{{ member.name }}</h3>
                                    <span class="role">{{ member.role }}</span>
                                    <p>{{ member.bio }}</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="team-section" style="min-height: 500px"></section>
            }

            <!-- Department Heads -->
            <!-- Department Heads -->
            @defer (on viewport) {
            <section class="dept-section">
                <div class="container">
                    <h2 class="section-title fade-in">{{ 'team.departments.title' | translate }}</h2>
                    <div class="dept-grid">
                        @for (member of departmentHeads; track member.name) {
                            <div class="dept-card fade-in">
                                <div class="dept-image">{{ getInitials(member.name) }}</div>
                                <h4>{{ member.name }}</h4>
                                <span class="role">{{ member.role }}</span>
                            </div>
                        }
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="dept-section" style="min-height: 400px"></section>
            }

            <!-- Join CTA -->
            <!-- Join CTA -->
            @defer (on viewport) {
            <section class="cta-section">
                <div class="container">
                    <div class="cta-content fade-in">
                        <h2>{{ 'team.cta.title' | translate }}</h2>
                        <p>{{ 'team.cta.subtitle' | translate }}</p>
                        <a routerLink="/careers" class="btn-cta">{{ 'team.cta.button' | translate }}</a>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="cta-section" style="min-height: 300px"></section>
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

        .hero-section h1 { font-size: 56px; font-weight: 800; margin-bottom: 20px; }
        .hero-section p { font-size: 20px; color: #94A3B8; }

        .team-section { padding: 100px 0; }
        .section-title { font-size: 36px; text-align: center; margin-bottom: 60px; color: #1E293B; }

        .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }

        .team-card {
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #E2E8F0;
            transition: transform 0.3s;
        }

        .team-card:hover { transform: translateY(-8px); }

        .member-image {
            height: 280px;
            background: linear-gradient(135deg, #E0F2FE, #F0FDF4);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-placeholder {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #0EA5E9, #10B981);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            font-weight: 700;
            color: white;
        }

        .member-info { padding: 30px; }
        .member-info h3 { font-size: 22px; color: #1E293B; margin-bottom: 8px; }
        .member-info .role { color: #0EA5E9; font-weight: 600; font-size: 14px; display: block; margin-bottom: 12px; }
        .member-info p { color: #64748B; font-size: 14px; line-height: 1.7; }

        .dept-section { padding: 100px 0; background: #F8FAFC; }
        .dept-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }

        .dept-card {
            background: white;
            padding: 40px 30px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s;
        }

        .dept-card:hover { transform: translateY(-5px); }

        .dept-image {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #E0F2FE, #F0FDF4);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
            font-weight: 700;
            color: #0EA5E9;
        }

        .dept-card h4 { font-size: 18px; color: #1E293B; margin-bottom: 6px; }
        .dept-card .role { color: #64748B; font-size: 14px; }

        .cta-section { padding: 100px 0; background: linear-gradient(135deg, #10B981, #059669); }
        .cta-content { text-align: center; color: white; }
        .cta-content h2 { font-size: 40px; margin-bottom: 16px; }
        .cta-content p { font-size: 18px; opacity: 0.9; margin-bottom: 32px; }

        .btn-cta {
            display: inline-block;
            padding: 16px 40px;
            background: white;
            color: #10B981;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            transition: all 0.3s;
        }

        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }

        @media (max-width: 1024px) {
            .hero-section h1 { font-size: 40px; }
            .team-grid { grid-template-columns: repeat(2, 1fr); }
            .dept-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
            .hero-section h1 { font-size: 32px; }
            .team-grid { grid-template-columns: 1fr; }
            .dept-grid { grid-template-columns: 1fr; }
        }
    `]
})
export class TeamComponent implements OnInit {
    private readonly translate = inject(TranslateService);

    leadershipTeam: TeamMember[] = [];
    departmentHeads: TeamMember[] = [];

    ngOnInit() {
        this.translate.get('team.leadership.list').subscribe(data => this.leadershipTeam = data);
        this.translate.get('team.departments.list').subscribe(data => this.departmentHeads = data);
    }

    getInitials(name: string): string {
        return name ? name.split(' ').map(n => n[0]).join('') : '';
    }
}
