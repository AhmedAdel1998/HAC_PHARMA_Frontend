import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MediaService } from '../../core/services/media.service';
import { Media } from '../../core/models/cms.models';

@Component({
    selector: 'app-admin-media',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule],
    template: `
        <div class="media-container">
            <div class="page-header">
                <div class="header-left">
                    <h1>Media Library</h1>
                    <p>Manage images, videos, and documents</p>
                </div>
                <label class="btn-upload">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload Files
                    <input type="file" multiple (change)="onFilesSelected($event)" hidden />
                </label>
            </div>

            <!-- Filters -->
            <div class="filters">
                <button [class.active]="filterType() === ''" (click)="setFilter('')">All</button>
                <button [class.active]="filterType() === 'image'" (click)="setFilter('image')">Images</button>
                <button [class.active]="filterType() === 'video'" (click)="setFilter('video')">Videos</button>
                <button [class.active]="filterType() === 'document'" (click)="setFilter('document')">Documents</button>
            </div>

            <!-- Upload Progress -->
            @if (uploading()) {
                <div class="upload-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" [style.width.%]="uploadProgress()"></div>
                    </div>
                    <span>Uploading...</span>
                </div>
            }

            <!-- Media Grid -->
            <div class="media-grid">
                @for (item of filteredMedia(); track item.id) {
                    <div class="media-card" [class.selected]="selectedItems().includes(item.id)">
                        <div class="media-preview" (click)="toggleSelect(item.id)">
                            @if (item.type === 'image') {
                                <img [src]="mediaService.getFullUrl(item.url)" [alt]="item.originalFilename || item.filename" />
                            } @else if (item.type === 'video') {
                                <div class="file-icon video">🎬</div>
                            } @else {
                                <div class="file-icon doc">📄</div>
                            }
                            <div class="check-overlay" [class.visible]="selectedItems().includes(item.id)">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                        </div>
                        <div class="media-info">
                            <span class="filename">{{ item.originalFilename || item.filename }}</span>
                            <span class="meta">{{ formatFileSize(item.size) }}</span>
                        </div>
                        <div class="media-actions">
                            <button class="btn-icon" (click)="copyUrl(item.url)" title="Copy URL">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                            </button>
                            <button class="btn-icon danger" (click)="deleteMedia(item)" title="Delete">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [`
        .media-container { max-width: 1400px; }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .page-header h1 { font-size: 24px; font-weight: 700; color: #1E293B; margin-bottom: 4px; }
        .page-header p { color: #64748B; font-size: 14px; }

        .btn-upload {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: #0EA5E9;
            color: white;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-upload:hover { background: #0284C7; }

        .filters {
            display: flex;
            gap: 8px;
            margin-bottom: 24px;
        }

        .filters button {
            padding: 8px 16px;
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            color: #64748B;
            cursor: pointer;
            transition: all 0.2s;
        }

        .filters button:hover { border-color: #0EA5E9; color: #0EA5E9; }
        .filters button.active { background: #0EA5E9; border-color: #0EA5E9; color: white; }

        .upload-progress {
            background: white;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .progress-bar { flex: 1; height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: #0EA5E9; transition: width 0.3s; }

        .media-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 20px;
        }

        .media-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s;
        }

        .media-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .media-card.selected { ring: 2px solid #0EA5E9; }

        .media-preview {
            height: 140px;
            background: #F1F5F9;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
        }

        .media-preview img { width: 100%; height: 100%; object-fit: cover; }
        .file-icon { font-size: 48px; }

        .check-overlay {
            position: absolute;
            inset: 0;
            background: rgba(14, 165, 233, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .check-overlay.visible { opacity: 1; }

        .media-info { padding: 12px; }
        .filename { display: block; font-size: 13px; font-weight: 500; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .meta { font-size: 12px; color: #64748B; }

        .media-actions {
            padding: 0 12px 12px;
            display: flex;
            gap: 8px;
        }

        .btn-icon {
            padding: 6px;
            background: #F1F5F9;
            border: none;
            border-radius: 6px;
            color: #64748B;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-icon:hover { background: #E2E8F0; color: #0EA5E9; }
        .btn-icon.danger:hover { background: #FEE2E2; color: #DC2626; }

        @media (max-width: 1200px) { .media-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 900px) { .media-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 640px) { .media-grid { grid-template-columns: repeat(2, 1fr); } }
    `]
})
export class AdminMediaComponent {
    protected readonly mediaService = inject(MediaService);

    media = signal<Media[]>([]);
    filteredMedia = signal<Media[]>([]);
    filterType = signal('');
    selectedItems = signal<number[]>([]);
    uploading = signal(false);
    uploadProgress = signal(0);

    constructor() {
        this.loadMedia();
    }

    loadMedia(type?: string): void {
        this.mediaService.getMedia(type).subscribe({
            next: (res) => {
                this.media.set(res.items);
                this.filteredMedia.set(res.items);
            },
            error: (err) => {
                console.error('Failed to load media', err);
                this.media.set([]);
                this.filteredMedia.set([]);
            }
        });
    }

    setFilter(type: string): void {
        this.filterType.set(type);
        this.loadMedia(type || undefined);
    }

    applyFilter(): void {
        const type = this.filterType();
        if (type) {
            this.filteredMedia.set(this.media().filter(m => m.type === type));
        } else {
            this.filteredMedia.set(this.media());
        }
    }

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        this.uploading.set(true);
        this.uploadProgress.set(0);

        const files = Array.from(input.files);
        let completed = 0;

        files.forEach(file => {
            this.mediaService.upload(file).subscribe({
                next: () => {
                    completed++;
                    this.uploadProgress.set((completed / files.length) * 100);
                    if (completed === files.length) {
                        this.uploading.set(false);
                        this.loadMedia();
                    }
                },
                error: () => {
                    completed++;
                    this.uploadProgress.set((completed / files.length) * 100);
                    if (completed === files.length) {
                        this.uploading.set(false);
                    }
                }
            });
        });
    }

    toggleSelect(id: number): void {
        const current = this.selectedItems();
        if (current.includes(id)) {
            this.selectedItems.set(current.filter(i => i !== id));
        } else {
            this.selectedItems.set([...current, id]);
        }
    }

    copyUrl(url: string): void {
        navigator.clipboard.writeText(this.mediaService.getFullUrl(url));
    }

    deleteMedia(item: Media): void {
        if (confirm(`Delete "${item.filename}"?`)) {
            this.mediaService.delete(item.id).subscribe({
                complete: () => this.loadMedia()
            });
        }
    }

    formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
}
