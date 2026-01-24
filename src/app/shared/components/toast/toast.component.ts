import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="toast-container">
            @for (toast of toastService.toasts(); track toast.id) {
                <div class="toast" [class]="toast.type" (click)="toastService.dismiss(toast.id)">
                    <div class="toast-icon">
                        @switch (toast.type) {
                            @case ('success') {
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            }
                            @case ('error') {
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                            }
                            @case ('warning') {
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                            }
                            @default {
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                            }
                        }
                    </div>
                    <span class="toast-message">{{ toast.message }}</span>
                    <button class="toast-close" (click)="toastService.dismiss(toast.id); $event.stopPropagation()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            }
        </div>
    `,
    styles: [`
        .toast-container {
            position: fixed;
            bottom: 24px;
            inset-inline-end: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 12px;
            pointer-events: none;
        }

        .toast {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.2);
            min-width: 320px;
            max-width: 420px;
            cursor: pointer;
            pointer-events: auto;
            animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border-inline-start: 4px solid;
        }

        [data-theme="dark"] .toast {
            background: rgba(30, 41, 59, 0.95);
        }

        .toast.success {
            border-inline-start-color: #10B981;
        }

        .toast.success .toast-icon {
            color: #10B981;
        }

        .toast.error {
            border-inline-start-color: #EF4444;
        }

        .toast.error .toast-icon {
            color: #EF4444;
        }

        .toast.warning {
            border-inline-start-color: #F59E0B;
        }

        .toast.warning .toast-icon {
            color: #F59E0B;
        }

        .toast.info {
            border-inline-start-color: #0EA5E9;
        }

        .toast.info .toast-icon {
            color: #0EA5E9;
        }

        .toast-icon {
            flex-shrink: 0;
        }

        .toast-message {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary, #1E293B);
        }

        .toast-close {
            flex-shrink: 0;
            padding: 4px;
            background: none;
            border: none;
            color: var(--text-muted, #64748B);
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .toast-close:hover {
            background: rgba(0, 0, 0, 0.05);
            color: var(--text-primary, #1E293B);
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @media (max-width: 480px) {
            .toast-container {
                left: 16px;
                right: 16px;
                bottom: 16px;
            }

            .toast {
                min-width: unset;
                max-width: unset;
            }
        }
    `]
})
export class ToastComponent {
    readonly toastService = inject(ToastService);
}
