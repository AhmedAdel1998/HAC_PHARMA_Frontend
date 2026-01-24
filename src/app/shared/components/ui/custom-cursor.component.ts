import { Component, HostListener, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-custom-cursor',
    standalone: true,
    template: `
    @if (isBrowser) {
      <div class="cursor-dot" [style.left.px]="mouseX()" [style.top.px]="mouseY()"></div>
      <div class="cursor-outline" [style.left.px]="outlineX()" [style.top.px]="outlineY()"></div>
    }
  `,
    styles: [] // Styles are global in cursor.css
})
export class CustomCursorComponent {
    isBrowser = false;
    mouseX = signal(0);
    mouseY = signal(0);
    outlineX = signal(0);
    outlineY = signal(0);

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.animate();
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e: MouseEvent) {
        if (!this.isBrowser) return;
        this.mouseX.set(e.clientX);
        this.mouseY.set(e.clientY);

        // Check if hovering actionable element
        const target = e.target as HTMLElement;
        const isHovering = target.closest('a, button, input, select, textarea, [role="button"]');
        if (isHovering) {
            document.body.classList.add('hovering');
        } else {
            document.body.classList.remove('hovering');
        }
    }

    animate() {
        const animateFrame = () => {
            // Smooth follow for outline with lerp
            const currentX = this.outlineX();
            const currentY = this.outlineY();
            const targetX = this.mouseX();
            const targetY = this.mouseY();

            this.outlineX.set(currentX + (targetX - currentX) * 0.15);
            this.outlineY.set(currentY + (targetY - currentY) * 0.15);

            requestAnimationFrame(animateFrame);
        };
        requestAnimationFrame(animateFrame);
    }
}
