import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';

@Component({
    selector: 'app-page-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, RouterLink],
    template: `
        <div class="editor-container">
            <div class="editor-header">
                <div class="header-left">
                    <a routerLink="/admin/pages" class="back-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Back to Pages
                    </a>
                    <h1>
                        <span class="page-key">{{ pageKey() }}</span>
                        <span class="lang-badge" [class.ar]="lang() === 'ar'">
                            {{ lang() === 'ar' ? 'العربية' : 'English' }}
                        </span>
                    </h1>
                </div>
                <div class="header-right">
                    <div class="lang-switcher">
                        <a [routerLink]="['/admin/pages', pageKey(), 'edit']" 
                           [queryParams]="{lang: 'en'}" 
                           class="lang-btn" [class.active]="lang() === 'en'">EN</a>
                        <a [routerLink]="['/admin/pages', pageKey(), 'edit']" 
                           [queryParams]="{lang: 'ar'}" 
                           class="lang-btn" [class.active]="lang() === 'ar'">AR</a>
                    </div>
                    <button class="btn-secondary" (click)="restoreFromFile()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Restore Original
                    </button>
                    <button class="btn-secondary" (click)="preview()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4m0-4h.01"/>
                        </svg>
                        Preview
                    </button>
                    <button class="btn-primary" (click)="save()" [disabled]="saving()">
                        @if (saving()) { 
                            <span class="spinner"></span> Saving... 
                        } @else { 
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                <polyline points="17 21 17 13 7 13 7 21"/>
                                <polyline points="7 3 7 8 15 8"/>
                            </svg>
                            Save Changes 
                        }
                    </button>
                </div>
            </div>

            @if (loading()) {
                <div class="loading">
                    <div class="spinner large"></div>
                    <p>Loading translations...</p>
                </div>
            } @else {
                <div class="editor-content">
                    <div class="editor-section">
                        <div class="section-header">
                            <h2>Translation Content</h2>
                            <p class="help-text">Edit the translation keys and values below. Changes will reflect immediately on the website after saving.</p>
                        </div>
                        <textarea 
                            class="json-editor"
                            [(ngModel)]="contentJson"
                            rows="35"
                            spellcheck="false"
                            [dir]="lang() === 'ar' ? 'rtl' : 'ltr'"
                        ></textarea>
                        @if (jsonError()) {
                            <div class="error-message">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                                {{ jsonError() }}
                            </div>
                        }
                    </div>

                    <div class="editor-sidebar">
                        <div class="sidebar-section">
                            <h3>📝 Quick Guide</h3>
                            <ul>
                                <li>Edit text values inside quotes</li>
                                <li>Keep JSON structure intact</li>
                                <li>Use \\n for line breaks</li>
                                <li>Preview changes before saving</li>
                            </ul>
                        </div>

                        <div class="sidebar-section tips">
                            <h3>💡 Tips</h3>
                            <ul>
                                <li><strong>Keys</strong> are identifiers used in code</li>
                                <li><strong>Values</strong> are displayed text</li>
                                <li>Don't change key names</li>
                            </ul>
                        </div>

                        <div class="sidebar-section">
                            <h3>🌐 Languages</h3>
                            <p>Currently editing: <strong>{{ lang() === 'ar' ? 'Arabic' : 'English' }}</strong></p>
                            <p class="muted">Switch languages using the buttons above</p>
                        </div>
                    </div>
                </div>
            }

            @if (saveSuccess()) {
                <div class="toast success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Translations saved successfully!
                </div>
            }
        </div>
    `,
    styles: [`
        .editor-container {
            max-width: 1400px;
        }

        .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .back-link {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #64748B;
            text-decoration: none;
            font-size: 14px;
            margin-bottom: 8px;
            transition: color 0.2s;
        }

        .back-link:hover {
            color: #0EA5E9;
        }

        h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1E293B;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .page-key {
            text-transform: capitalize;
        }

        .lang-badge {
            padding: 4px 12px;
            background: #0EA5E9;
            color: white;
            font-size: 12px;
            font-weight: 600;
            border-radius: 50px;
        }

        .lang-badge.ar {
            background: #10B981;
        }

        .header-right {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .lang-switcher {
            display: flex;
            background: #F1F5F9;
            border-radius: 8px;
            padding: 4px;
        }

        .lang-btn {
            padding: 8px 16px;
            text-decoration: none;
            color: #64748B;
            font-weight: 500;
            font-size: 13px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .lang-btn.active {
            background: white;
            color: #0EA5E9;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .btn-secondary, .btn-primary {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
        }

        .btn-secondary {
            background: white;
            border: 1px solid #E2E8F0;
            color: #64748B;
        }

        .btn-secondary:hover {
            border-color: #0EA5E9;
            color: #0EA5E9;
        }

        .btn-primary {
            background: #0EA5E9;
            color: white;
        }

        .btn-primary:hover {
            background: #0284C7;
        }

        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .loading {
            text-align: center;
            padding: 80px;
            color: #64748B;
        }

        .loading p {
            margin-top: 16px;
        }

        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
        }

        .spinner.large {
            width: 40px;
            height: 40px;
            border-color: rgba(14, 165, 233, 0.2);
            border-top-color: #0EA5E9;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .editor-content {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 24px;
        }

        .editor-section {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .section-header {
            margin-bottom: 16px;
        }

        .section-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1E293B;
            margin-bottom: 4px;
        }

        .help-text {
            font-size: 14px;
            color: #64748B;
        }

        .json-editor {
            width: 100%;
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 13px;
            padding: 16px;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            background: #1E293B;
            color: #E2E8F0;
            resize: vertical;
            line-height: 1.6;
            tab-size: 2;
        }

        .json-editor:focus {
            outline: none;
            border-color: #0EA5E9;
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .error-message {
            margin-top: 12px;
            padding: 12px 16px;
            background: #FEE2E2;
            color: #DC2626;
            border-radius: 8px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .editor-sidebar {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .sidebar-section {
            background: white;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .sidebar-section.tips {
            background: #F0F9FF;
            border: 1px solid #BAE6FD;
        }

        .sidebar-section h3 {
            font-size: 14px;
            font-weight: 600;
            color: #1E293B;
            margin-bottom: 12px;
        }

        .sidebar-section ul {
            font-size: 13px;
            color: #64748B;
            padding-left: 16px;
        }

        .sidebar-section li {
            margin-bottom: 8px;
        }

        .sidebar-section p {
            font-size: 14px;
            color: #1E293B;
        }

        .muted {
            color: #64748B !important;
            font-size: 13px;
            margin-top: 4px;
        }

        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideUp 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .toast.success {
            background: #10B981;
            color: white;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 1024px) {
            .editor-content {
                grid-template-columns: 1fr;
            }

            .editor-sidebar {
                flex-direction: row;
                flex-wrap: wrap;
            }

            .sidebar-section {
                flex: 1;
                min-width: 200px;
            }
        }
    `]
})
export class PageEditorComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly contentService = inject(ContentService);
    private readonly http = inject(HttpClient);

    pageKey = signal('');
    lang = signal('en');
    contentJson = '';
    loading = signal(true);
    saving = signal(false);
    jsonError = signal<string | null>(null);
    saveSuccess = signal(false);

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.pageKey.set(params['key']);
        });

        this.route.queryParams.subscribe(params => {
            this.lang.set(params['lang'] || 'en');
            this.loadContent();
        });
    }

    loadContent(): void {
        this.loading.set(true);
        this.jsonError.set(null);

        this.contentService.getPageTranslations(this.pageKey(), this.lang()).subscribe({
            next: (translations) => {
                if (Object.keys(translations).length > 0) {
                    this.contentJson = JSON.stringify(translations, null, 2);
                } else {
                    // Empty template for new page
                    this.contentJson = JSON.stringify({
                        title: this.lang() === 'ar' ? 'عنوان الصفحة' : 'Page Title',
                        description: this.lang() === 'ar' ? 'وصف الصفحة' : 'Page description'
                    }, null, 2);
                }
                this.loading.set(false);
            },
            error: () => {
                // Default content for new translations
                this.contentJson = JSON.stringify({
                    title: this.lang() === 'ar' ? 'عنوان الصفحة' : 'Page Title',
                    description: this.lang() === 'ar' ? 'وصف الصفحة' : 'Page description'
                }, null, 2);
                this.loading.set(false);
            }
        });
    }

    save(): void {
        try {
            const parsed = JSON.parse(this.contentJson);
            this.jsonError.set(null);
            this.saving.set(true);

            this.contentService.updatePageTranslations(this.pageKey(), this.lang(), parsed).subscribe({
                next: () => {
                    this.saving.set(false);
                    this.saveSuccess.set(true);
                    setTimeout(() => this.saveSuccess.set(false), 3000);
                },
                error: (err) => {
                    this.saving.set(false);
                    this.jsonError.set('Failed to save. Please check your connection and try again.');
                }
            });
        } catch (e) {
            this.jsonError.set('Invalid JSON format. Please check your syntax.');
        }
    }

    preview(): void {
        // Open the page in a new tab
        const pageUrl = this.pageKey() === 'home' ? '/' : `/${this.pageKey()}`;
        window.open(pageUrl, '_blank');
    }

    restoreFromFile(): void {
        if (!confirm('This will load content from the static file and overwrite your current changes. Continue?')) {
            return;
        }

        this.loading.set(true);
        this.http.get<any>(`/assets/i18n/${this.lang()}.json`).subscribe({
            next: (data) => {
                // The data is the full JSON object (common, header, etc.)
                // We need to extract just the part for this page
                const pageData = data[this.pageKey()];

                if (pageData) {
                    this.contentJson = JSON.stringify(pageData, null, 2);
                    this.jsonError.set(null);
                } else {
                    alert(`No content found for section '${this.pageKey()}' in the file.`);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load JSON file', err);
                alert('Failed to load the static JSON file.');
                this.loading.set(false);
            }
        });
    }
}

