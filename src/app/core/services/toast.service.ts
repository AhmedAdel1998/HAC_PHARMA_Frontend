import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private readonly platformId = inject(PLATFORM_ID);
    private nextId = 0;

    readonly toasts = signal<Toast[]>([]);

    show(message: string, type: Toast['type'] = 'info', duration = 4000): void {
        const id = this.nextId++;
        const toast: Toast = { id, message, type, duration };

        this.toasts.update(t => [...t, toast]);

        if (isPlatformBrowser(this.platformId) && duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }
    }

    success(message: string, duration = 4000): void {
        this.show(message, 'success', duration);
    }

    error(message: string, duration = 5000): void {
        this.show(message, 'error', duration);
    }

    warning(message: string, duration = 4000): void {
        this.show(message, 'warning', duration);
    }

    info(message: string, duration = 4000): void {
        this.show(message, 'info', duration);
    }

    dismiss(id: number): void {
        this.toasts.update(t => t.filter(toast => toast.id !== id));
    }

    clear(): void {
        this.toasts.set([]);
    }
}
