import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
    selector: 'app-skeleton',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div 
            class="skeleton"
            [style.width]="width()"
            [style.height]="height()"
            [style.border-radius]="radius()"
            [class.circle]="circle()"
        ></div>
    `,
    styles: [`
        .skeleton {
            background: linear-gradient(
                90deg,
                var(--bg-tertiary, #F1F5F9) 25%,
                var(--bg-secondary, #E2E8F0) 50%,
                var(--bg-tertiary, #F1F5F9) 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }

        [data-theme="dark"] .skeleton {
            background: linear-gradient(
                90deg,
                #334155 25%,
                #475569 50%,
                #334155 75%
            );
            background-size: 200% 100%;
        }

        .skeleton.circle {
            border-radius: 50%;
        }

        @keyframes shimmer {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }
    `]
})
export class SkeletonComponent {
    readonly width = input('100%');
    readonly height = input('20px');
    readonly radius = input('8px');
    readonly circle = input(false);
}
