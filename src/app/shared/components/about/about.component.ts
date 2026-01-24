import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-about',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule, NgOptimizedImage, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'about.sectionLabel' | translate }}</span>
                    <h1>{{ 'about.title' | translate }}</h1>
                    <p>{{ 'about.globalVision' | translate }}</p>
                </div>
            </section>

            <!-- About Content -->
            <!-- About Content -->
            @defer (on viewport) {
            <section class="content-section">
                <div class="container">
                    <div class="about-grid">
                        <div class="about-content fade-in">
                            <h2>{{ 'about.philosophyTitle' | translate }}</h2>
                            <p>{{ 'about.description1' | translate }}</p>
                            <p>{{ 'about.description2' | translate }}</p>
                            <div class="philosophy-list">
                                <p><strong>{{ 'about.philosophyDescription' | translate }}</strong></p>
                                <ul>
                                    <li>{{ 'about.bridgingGaps' | translate }}</li>
                                    <li>{{ 'about.enhancingQuality' | translate }}</li>
                                    <li>{{ 'about.empoweringHealthcare' | translate }}</li>
                                    <li>{{ 'about.collaboratingGlobally' | translate }}</li>
                                </ul>
                            </div>
                        </div>
                        <div class="about-image fade-in">
                            <img ngSrc="assets/AboutUs.png" 
                                 width="600" 
                                 height="400" 
                                 alt="HAC Pharma Philosophy"
                                 class="about-img" 
                                 priority />
                        </div>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="content-section" style="min-height: 500px"></section>
            }

            <!-- Mission & Vision -->
            <!-- Mission & Vision -->
            @defer (on viewport) {
            <section class="mv-section">
                <div class="container">
                    <div class="mv-grid">
                        <div class="mv-card mission fade-in">
                            <div class="icon">🎯</div>
                            <h3>{{ 'about.missionTitle' | translate }}</h3>
                            <p>{{ 'about.missionText' | translate }}</p>
                        </div>
                        <div class="mv-card vision fade-in">
                            <div class="icon">👁️</div>
                            <h3>{{ 'about.visionTitle' | translate }}</h3>
                            <p>{{ 'about.visionText' | translate }}</p>
                        </div>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="mv-section" style="min-height: 400px"></section>
            }

            <!-- Values -->
            <!-- Values -->
            @defer (on viewport) {
            <section class="values-section">
                <div class="container">
                    <h2 class="section-title fade-in">{{ 'about.philosophyTitle' | translate }}</h2> 
                    <div class="values-grid">
                        <div class="value-card fade-in">
                            <div class="value-icon">💊</div>
                            <h4>{{ 'about.bridgingGaps' | translate }}</h4>
                            <p>{{ 'about.bridgingGaps' | translate }}</p> 
                        </div>
                        <div class="value-card fade-in">
                            <div class="value-icon">✨</div>
                            <h4>{{ 'about.enhancingQuality' | translate }}</h4>
                            <p>{{ 'about.enhancingQuality' | translate }}</p>
                        </div>
                        <div class="value-card fade-in">
                            <div class="value-icon">🤝</div>
                            <h4>{{ 'about.empoweringHealthcare' | translate }}</h4>
                            <p>{{ 'about.empoweringHealthcare' | translate }}</p>
                        </div>
                        <div class="value-card fade-in">
                            <div class="value-icon">🚀</div>
                            <h4>{{ 'about.collaboratingGlobally' | translate }}</h4>
                            <p>{{ 'about.collaboratingGlobally' | translate }}</p>
                        </div>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="values-section" style="min-height: 400px"></section>
            }

            <!-- Global Presence -->
            <!-- Global Presence -->
            @defer (on viewport) {
            <section class="presence-section">
                <div class="container">
                    <h2 class="section-title fade-in">{{ 'about.globalPresence' | translate }}</h2>
                    <p class="section-subtitle fade-in">{{ 'about.headquartersDescription' | translate }}</p>
                    <div class="locations-grid fade-in">
                        <div class="location">{{ 'about.locations.saudi' | translate }}</div>
                        <div class="location">{{ 'about.locations.usa' | translate }}</div>
                        <div class="location">{{ 'about.locations.france' | translate }}</div>
                        <div class="location">{{ 'about.locations.egypt' | translate }}</div>
                        <div class="location">{{ 'about.locations.india' | translate }}</div>
                        <div class="location">{{ 'about.locations.china' | translate }}</div>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="presence-section" style="min-height: 300px"></section>
            }
        </main>

        <app-footer />
    `,
    styles: [`
        .page-content {
            padding-top: 80px;
        }

        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
        }

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

        .hero-section h1 {
            font-size: 56px;
            font-weight: 800;
            margin-bottom: 20px;
        }

        .hero-section p {
            font-size: 20px;
            color: #94A3B8;
            max-width: 600px;
            margin: 0 auto;
        }

        .content-section {
            padding: 100px 0;
        }

        .about-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }

        .about-content h2 {
            font-size: 36px;
            margin-bottom: 24px;
            color: #1E293B;
        }

        .about-content p {
            color: #64748B;
            line-height: 1.8;
            margin-bottom: 16px;
        }

        .about-image {
            width: 100%;
            height: auto;
            display: block;
        }

        .about-img {
            width: 100%;
            height: auto;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .mv-section {
            padding: 100px 0;
            background: #F8FAFC;
        }

        .mv-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        .mv-card {
            padding: 50px;
            border-radius: 24px;
            position: relative;
            overflow: hidden;
        }

        .mv-card.mission {
            background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
            border-left: 4px solid #10B981;
        }

        .mv-card.vision {
            background: linear-gradient(135deg, #F0F9FF, #E0F2FE);
            border-left: 4px solid #0EA5E9;
        }

        .mv-card .icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .mv-card h3 {
            font-size: 28px;
            margin-bottom: 16px;
            color: #1E293B;
        }

        .mv-card p {
            color: #64748B;
            line-height: 1.8;
        }

        .values-section {
            padding: 100px 0;
        }

        .section-title {
            font-size: 40px;
            text-align: center;
            margin-bottom: 20px;
            color: #1E293B;
        }

        .section-subtitle {
            text-align: center;
            color: #64748B;
            margin-bottom: 60px;
        }

        .values-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
        }

        .value-card {
            text-align: center;
            padding: 40px 30px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s;
        }

        .value-card:hover {
            transform: translateY(-10px);
        }

        .value-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .value-card h4 {
            font-size: 20px;
            margin-bottom: 12px;
            color: #1E293B;
        }

        .value-card p {
            color: #64748B;
            font-size: 14px;
        }

        .presence-section {
            padding: 100px 0;
            background: linear-gradient(135deg, #0F172A, #1E293B);
            color: white;
        }

        .presence-section .section-title {
            color: white;
        }

        .presence-section .section-subtitle {
            color: #94A3B8;
        }

        .locations-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 20px;
        }

        .location {
            background: rgba(255, 255, 255, 0.1);
            padding: 24px;
            border-radius: 16px;
            text-align: center;
            font-weight: 600;
            transition: all 0.3s;
        }

        .location:hover {
            background: rgba(14, 165, 233, 0.3);
            transform: translateY(-5px);
        }

        @media (max-width: 1024px) {
            .hero-section h1 { font-size: 40px; }
            .about-grid { grid-template-columns: 1fr; }
            .mv-grid { grid-template-columns: 1fr; }
            .values-grid { grid-template-columns: repeat(2, 1fr); }
            .locations-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 640px) {
            .hero-section h1 { font-size: 32px; }
            .values-grid { grid-template-columns: 1fr; }
            .locations-grid { grid-template-columns: repeat(2, 1fr); }
        }
    `]
})
export class AboutComponent { }
