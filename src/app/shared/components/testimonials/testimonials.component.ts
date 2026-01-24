import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';

@Component({
    selector: 'app-testimonials',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, TranslateModule],
    template: `
        <app-header />
        
        <main class="page-content">
            <section class="testimonials-section">
                <div class="container">
                    <span class="label">{{ 'testimonials.label' | translate }}</span>
                    <h1>{{ 'testimonials.hero.title' | translate }}</h1>
                    <p>{{ 'testimonials.hero.subtitle' | translate }}</p>

                    @if (currentTestimonial()) {
                        <div class="testimonials-carousel">
                            <button class="nav-btn prev" (click)="prev()">←</button>
                            
                            <div class="testimonial-card">
                                <div class="quote-icon">❝</div>
                                <p class="quote-text">{{ currentTestimonial()?.quote }}</p>
                                <div class="author">
                                    <img [src]="currentTestimonial()?.image || 'assets/placeholder-user.png'" alt="" />
                                    <div class="author-info">
                                        <h4>{{ currentTestimonial()?.author }}</h4>
                                        <span>{{ currentTestimonial()?.role }}, {{ currentTestimonial()?.company }}</span>
                                    </div>
                                </div>
                            </div>
    
                            <button class="nav-btn next" (click)="next()">→</button>
                        </div>
                    }

                    <div class="dots">
                        @for (t of testimonials(); track t.id; let i = $index) {
                            <button class="dot" [class.active]="currentIndex() === i" (click)="setIndex(i)"></button>
                        }
                    </div>
                </div>
            </section>
        </main>

        <app-footer />
    `,
    styles: [`
        .page-content { padding-top: 80px; }
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; text-align: center; }

        .testimonials-section {
            padding: 100px 0;
            background: linear-gradient(135deg, #0F172A, #1E293B);
            color: white;
            min-height: 80vh;
            display: flex; flex-direction: column; justify-content: center;
        }

        .label {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(14, 165, 233, 0.2);
            color: #0EA5E9;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 20px;
        }

        h1 { font-size: 48px; font-weight: 800; margin-bottom: 20px; }
        p { font-size: 20px; color: #94A3B8; margin-bottom: 60px; max-width: 600px; margin-left: auto; margin-right: auto; }

        .testimonials-carousel {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 40px;
            margin-bottom: 40px;
        }

        .testimonial-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 60px;
            max-width: 800px;
            position: relative;
            transition: all 0.3s;
        }

        .quote-icon {
            font-size: 80px;
            color: #0EA5E9;
            opacity: 0.2;
            line-height: 1;
            margin-bottom: 20px;
        }

        .quote-text {
            font-size: 24px;
            font-style: italic;
            line-height: 1.6;
            color: white;
            margin-bottom: 40px;
        }

        .author {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
        }

        .author img {
            width: 60px; height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #0EA5E9;
        }

        .author-info { text-align: left; }
        .author-info h4 { font-size: 18px; color: white; margin-bottom: 4px; }
        .author-info span { font-size: 14px; color: #94A3B8; }

        .nav-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 50px; height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            transition: all 0.2s;
        }
        .nav-btn:hover { background: #0EA5E9; transform: scale(1.1); }

        .dots { display: flex; justify-content: center; gap: 12px; }
        .dot {
            width: 12px; height: 12px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        .dot.active { background: #0EA5E9; transform: scale(1.2); }
        .dot:hover { background: rgba(255, 255, 255, 0.5); }

        @media (max-width: 768px) {
            .testimonials-carousel { flex-direction: column; }
            .nav-btn { display: none; }
            .quote-text { font-size: 18px; }
        }
    `]
})
export class TestimonialsComponent implements OnInit {
    private readonly translate = inject(TranslateService);

    testimonials = signal<any[]>([]);
    currentIndex = signal(0);

    currentTestimonial = computed(() => {
        const list = this.testimonials();
        return list.length > 0 ? list[this.currentIndex()] : null;
    });

    ngOnInit() {
        this.translate.get('testimonials.list').subscribe(data => {
            if (Array.isArray(data)) {
                this.testimonials.set(data);
            }
        });
    }

    setIndex(index: number) {
        this.currentIndex.set(index);
    }

    next() {
        const len = this.testimonials().length;
        if (len === 0) return;
        this.currentIndex.update(i => (i + 1) % len);
    }

    prev() {
        const len = this.testimonials().length;
        if (len === 0) return;
        this.currentIndex.update(i => (i - 1 + len) % len);
    }
}
