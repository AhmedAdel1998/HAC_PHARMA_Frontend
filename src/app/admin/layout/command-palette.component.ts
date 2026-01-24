import { Component, ChangeDetectionStrategy, signal, inject, input, output, HostListener, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface SearchResult {
    id: string;
    title: string;
    category: string;
    icon: string;
    route: string;
}

@Component({
    selector: 'app-command-palette',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule],
    template: `
        @if (isOpen()) {
            <div class="overlay" (click)="close.emit()">
                <div class="palette" (click)="$event.stopPropagation()">
                    <div class="search-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input 
                            #searchInput
                            type="text" 
                            [(ngModel)]="query"
                            (ngModelChange)="search($event)"
                            placeholder="Search pages, products, settings..."
                            autofocus
                        />
                        <kbd>ESC</kbd>
                    </div>

                    <div class="results">
                        @if (query().length === 0) {
                            <div class="category">
                                <div class="category-title">Quick Actions</div>
                                @for (item of quickActions; track item.id) {
                                    <div class="result-item" (click)="navigate(item.route)">
                                        <span class="result-icon">{{ item.icon }}</span>
                                        <span class="result-title">{{ item.title }}</span>
                                        <span class="result-category">{{ item.category }}</span>
                                    </div>
                                }
                            </div>
                        }

                        @if (filteredResults().length > 0) {
                            <div class="category">
                                <div class="category-title">Results</div>
                                @for (item of filteredResults(); track item.id; let i = $index) {
                                    <div 
                                        class="result-item" 
                                        [class.selected]="selectedIndex() === i"
                                        (click)="navigate(item.route)"
                                        (mouseenter)="selectedIndex.set(i)"
                                    >
                                        <span class="result-icon">{{ item.icon }}</span>
                                        <span class="result-title">{{ item.title }}</span>
                                        <span class="result-category">{{ item.category }}</span>
                                    </div>
                                }
                            </div>
                        }

                        @if (query().length > 0 && filteredResults().length === 0) {
                            <div class="no-results">
                                <span class="no-results-icon">🔍</span>
                                <p>No results found for "{{ query() }}"</p>
                            </div>
                        }
                    </div>

                    <div class="footer">
                        <span><kbd>↑↓</kbd> Navigate</span>
                        <span><kbd>↵</kbd> Open</span>
                        <span><kbd>ESC</kbd> Close</span>
                    </div>
                </div>
            </div>
        }
    `,
    styles: [`
        .overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 9999;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 15vh;
            animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .palette {
            width: 100%;
            max-width: 580px;
            background: var(--bg-card, rgba(255, 255, 255, 0.98));
            backdrop-filter: blur(12px);
            border-radius: 16px;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--border-light, #E2E8F0);
            overflow: hidden;
            animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .search-box {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-light, #E2E8F0);
        }

        .search-box svg {
            color: var(--text-muted, #64748B);
            flex-shrink: 0;
        }

        .search-box input {
            flex: 1;
            border: none;
            background: none;
            font-size: 16px;
            color: var(--text-primary, #1E293B);
            outline: none;
        }

        .search-box input::placeholder {
            color: var(--text-muted, #94A3B8);
        }

        .search-box kbd {
            padding: 4px 8px;
            background: var(--bg-tertiary, #F1F5F9);
            border: 1px solid var(--border-light, #E2E8F0);
            border-radius: 6px;
            font-size: 12px;
            color: var(--text-muted, #64748B);
        }

        .results {
            max-height: 360px;
            overflow-y: auto;
            padding: 8px;
        }

        .category-title {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted, #64748B);
            padding: 8px 12px 6px;
        }

        .result-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.15s;
        }

        .result-item:hover,
        .result-item.selected {
            background: var(--bg-tertiary, #F1F5F9);
        }

        .result-icon {
            font-size: 18px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-secondary, #E2E8F0);
            border-radius: 8px;
        }

        .result-title {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary, #1E293B);
        }

        .result-category {
            font-size: 12px;
            color: var(--text-muted, #64748B);
        }

        .no-results {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-muted, #64748B);
        }

        .no-results-icon {
            font-size: 32px;
            display: block;
            margin-bottom: 12px;
            opacity: 0.5;
        }

        .footer {
            display: flex;
            justify-content: center;
            gap: 24px;
            padding: 12px 20px;
            background: var(--bg-secondary, #F8FAFC);
            border-top: 1px solid var(--border-light, #E2E8F0);
            font-size: 12px;
            color: var(--text-muted, #64748B);
        }

        .footer kbd {
            padding: 2px 6px;
            background: var(--bg-primary, white);
            border: 1px solid var(--border-light, #E2E8F0);
            border-radius: 4px;
            font-size: 11px;
            margin-right: 4px;
        }
    `]
})
export class CommandPaletteComponent implements OnChanges {
    private readonly router = inject(Router);
    private readonly elementRef = inject(ElementRef);

    readonly isOpen = input(false);
    readonly close = output<void>();

    readonly query = signal('');
    readonly filteredResults = signal<SearchResult[]>([]);
    readonly selectedIndex = signal(0);

    readonly allItems: SearchResult[] = [
        { id: '1', title: 'Dashboard', category: 'Navigation', icon: '📊', route: '/admin/dashboard' },
        { id: '2', title: 'Pages', category: 'Navigation', icon: '📝', route: '/admin/pages' },
        { id: '3', title: 'Products', category: 'Navigation', icon: '💊', route: '/admin/products' },
        { id: '4', title: 'Media Library', category: 'Navigation', icon: '🖼️', route: '/admin/media' },
        { id: '5', title: 'RFQ Requests', category: 'Navigation', icon: '📩', route: '/admin/rfq' },
        { id: '6', title: 'Careers', category: 'Navigation', icon: '💼', route: '/admin/careers' },
        { id: '7', title: 'Events', category: 'Navigation', icon: '📅', route: '/admin/events' },
        { id: '8', title: 'Users', category: 'Navigation', icon: '👥', route: '/admin/users' },
        { id: '9', title: 'Settings', category: 'Navigation', icon: '⚙️', route: '/admin/settings' },
        { id: '10', title: 'Add New Product', category: 'Action', icon: '➕', route: '/admin/products/new' },
        { id: '11', title: 'Edit Home Page', category: 'Action', icon: '🏠', route: '/admin/pages/home/edit' },
        { id: '12', title: 'Edit About Page', category: 'Action', icon: '📄', route: '/admin/pages/about/edit' },
    ];

    readonly quickActions: SearchResult[] = [
        { id: 'q1', title: 'Go to Dashboard', category: 'Quick', icon: '📊', route: '/admin/dashboard' },
        { id: 'q2', title: 'Add New Product', category: 'Quick', icon: '➕', route: '/admin/products/new' },
        { id: 'q3', title: 'View RFQ Requests', category: 'Quick', icon: '📩', route: '/admin/rfq' },
        { id: 'q4', title: 'Upload Media', category: 'Quick', icon: '📤', route: '/admin/media' },
    ];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen()) {
            this.query.set('');
            this.filteredResults.set([]);
            this.selectedIndex.set(0);
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeydown(event: KeyboardEvent): void {
        if (!this.isOpen()) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const max = this.query().length > 0 ? this.filteredResults().length : this.quickActions.length;
            this.selectedIndex.update(i => Math.min(i + 1, max - 1));
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            this.selectedIndex.update(i => Math.max(i - 1, 0));
        }

        if (event.key === 'Enter') {
            event.preventDefault();
            const items = this.query().length > 0 ? this.filteredResults() : this.quickActions;
            const selected = items[this.selectedIndex()];
            if (selected) {
                this.navigate(selected.route);
            }
        }
    }

    search(query: string): void {
        this.selectedIndex.set(0);
        if (query.trim().length === 0) {
            this.filteredResults.set([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = this.allItems.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery)
        );
        this.filteredResults.set(results);
    }

    navigate(route: string): void {
        this.router.navigate([route]);
        this.close.emit();
    }
}
