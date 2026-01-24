import { Directive, ElementRef, inject, OnDestroy, OnInit, Renderer2, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '.roadmap-phase, .fade-in',
    standalone: true
})
export class VisibilityObserverDirective implements OnInit, OnDestroy {
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    private ngZone = inject(NgZone);
    private platformId = inject(PLATFORM_ID);
    private observer: IntersectionObserver | null = null;

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.ngZone.runOutsideAngular(() => {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Add visible class
                            this.renderer.addClass(this.el.nativeElement, 'visible');

                            // Stop observing once visible
                            this.observer?.unobserve(this.el.nativeElement);
                            this.observer?.disconnect();
                            this.observer = null;
                        }
                    });
                }, { threshold: 0.1 });

                this.observer.observe(this.el.nativeElement);
            });
        }
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
