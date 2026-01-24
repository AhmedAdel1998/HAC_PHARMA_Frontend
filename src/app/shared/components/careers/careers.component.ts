import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';
import { CareerService } from '../../../core/services/career.service';
import { Job } from '../../../core/models/cms.models';

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
    selector: 'app-careers',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeaderComponent, FooterComponent, FormsModule, TranslateModule, VisibilityObserverDirective],
    template: `
        <app-header />
        
        <main class="page-content">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="container">
                    <span class="label">{{ 'careers.hero.label' | translate }}</span>
                    <h1>{{ 'careers.hero.title' | translate }}</h1>
                    <p>{{ 'careers.hero.subtitle' | translate }}</p>
                </div>
            </section>

            <!-- Culture Section -->
            @defer (on viewport) {
            <section class="culture-section">
                <div class="container">
                    <h2 class="section-title fade-in">{{ 'careers.culture.title' | translate }}</h2>
                    <div class="culture-grid">
                        <div class="culture-card fade-in">
                            <span class="icon">🚀</span>
                            <h3>{{ 'careers.culture.cards.growth.title' | translate }}</h3>
                            <p>{{ 'careers.culture.cards.growth.desc' | translate }}</p>
                        </div>
                        <div class="culture-card fade-in">
                            <span class="icon">🌍</span>
                            <h3>{{ 'careers.culture.cards.global.title' | translate }}</h3>
                            <p>{{ 'careers.culture.cards.global.desc' | translate }}</p>
                        </div>
                        <div class="culture-card fade-in">
                            <span class="icon">💪</span>
                            <h3>{{ 'careers.culture.cards.impact.title' | translate }}</h3>
                            <p>{{ 'careers.culture.cards.impact.desc' | translate }}</p>
                        </div>
                        <div class="culture-card fade-in">
                            <span class="icon">🤝</span>
                            <h3>{{ 'careers.culture.cards.collab.title' | translate }}</h3>
                            <p>{{ 'careers.culture.cards.collab.desc' | translate }}</p>
                        </div>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="culture-section" style="min-height: 400px"></section>
            }

            <!-- Open Positions -->
            @defer (on viewport) {
            <section class="jobs-section">
                <div class="container">
                    <h2 class="section-title fade-in">{{ 'careers.positions.title' | translate }}</h2>
                    
                    @if (loading()) {
                        <div class="loading-state">
                            <div class="spinner"></div>
                            <p>{{ 'careers.positions.loading' | translate }}</p>
                        </div>
                    } @else if (jobs().length === 0) {
                        <div class="empty-state">
                            <p>{{ 'careers.positions.empty' | translate }}</p>
                        </div>
                    } @else {
                        <div class="jobs-list">
                            @for (job of jobs(); track job.id) {
                                <div class="job-card fade-in">
                                    <div class="job-info">
                                        <h3>{{ job.title }}</h3>
                                        <div class="job-meta">
                                            <span>🏢 {{ job.department }}</span>
                                            <span>📍 {{ job.location }}</span>
                                            <span>⏰ {{ job.type }}</span>
                                        </div>
                                        @if (job.description) {
                                            <p class="job-desc">{{ job.description }}</p>
                                        }
                                    </div>
                                    <button class="btn-apply" (click)="openApplicationModal(job)">{{ 'careers.positions.apply' | translate }}</button>
                                </div>
                            }
                        </div>
                    }
                </div>
            </section>
            } @placeholder {
                <section class="jobs-section" style="min-height: 500px"></section>
            }

            <!-- CTA -->
            <!-- CTA -->
            @defer (on viewport) {
            <section class="cta-section">
                <div class="container">
                    <div class="cta-content fade-in">
                        <h2>{{ 'careers.cta.title' | translate }}</h2>
                        <p>{{ 'careers.cta.subtitle' | translate }}</p>
                        <a href="/contact" class="btn-cta">{{ 'careers.cta.button' | translate }}</a>
                    </div>
                </div>
            </section>
            } @placeholder {
                <section class="cta-section" style="min-height: 300px"></section>
            }
        </main>

        <!-- Application Modal -->
        @if (showModal()) {
            <div class="modal-backdrop" (click)="closeModal()">
                <div class="modal" (click)="$event.stopPropagation()">
                    <div class="modal-header">
                        <div>
                            <h2>{{ 'careers.modal.title' | translate }}</h2>
                            <p class="modal-subtitle">{{ selectedJob()?.title }} - {{ selectedJob()?.location }}</p>
                        </div>
                        <button class="btn-close" (click)="closeModal()">×</button>
                    </div>
                    
                    @if (submitSuccess()) {
                        <div class="modal-body success-state">
                            <div class="success-icon">✓</div>
                            <h3>{{ 'careers.modal.success.title' | translate }}</h3>
                            <p>{{ 'careers.modal.success.message' | translate }}</p>
                            <button class="btn-primary" (click)="closeModal()">{{ 'careers.modal.success.close' | translate }}</button>
                        </div>
                    } @else {
                        <div class="modal-body">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>{{ 'careers.modal.form.name' | translate }}</label>
                                    <input type="text" [(ngModel)]="applicationForm.name" [placeholder]="'careers.modal.form.namePlaceholder' | translate" />
                                </div>
                                <div class="form-group">
                                    <label>{{ 'careers.modal.form.email' | translate }}</label>
                                    <input type="email" [(ngModel)]="applicationForm.email" [placeholder]="'careers.modal.form.emailPlaceholder' | translate" />
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>{{ 'careers.modal.form.phone' | translate }}</label>
                                    <input type="tel" [(ngModel)]="applicationForm.phone" [placeholder]="'careers.modal.form.phonePlaceholder' | translate" />
                                </div>
                                <div class="form-group">
                                    <label>{{ 'careers.modal.form.linkedin' | translate }}</label>
                                    <input type="url" [(ngModel)]="applicationForm.linkedInUrl" [placeholder]="'careers.modal.form.linkedinPlaceholder' | translate" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>{{ 'careers.modal.form.coverLetter' | translate }}</label>
                                <textarea [(ngModel)]="applicationForm.coverLetter" rows="4" 
                                    [placeholder]="'careers.modal.form.coverLetterPlaceholder' | translate"></textarea>
                            </div>
                            <div class="form-group">
                                <label>{{ 'careers.modal.form.resume' | translate }}</label>
                                <div class="file-upload">
                                    <input type="file" id="resume" accept=".pdf,.doc,.docx" (change)="onFileSelected($event)" />
                                    <label for="resume" class="file-label">
                                        <span class="file-icon">📄</span>
                                        @if (selectedFile()) {
                                            <span>{{ selectedFile()?.name }}</span>
                                        } @else {
                                            <span>{{ 'careers.modal.form.fileSelect' | translate }}</span>
                                        }
                                    </label>
                                </div>
                            </div>
                            @if (formError()) {
                                <div class="form-error">{{ formError() }}</div>
                            }
                        </div>
                        <div class="modal-footer">
                            <button class="btn-secondary" (click)="closeModal()">{{ 'careers.modal.form.cancel' | translate }}</button>
                            <button class="btn-primary" (click)="submitApplication()" [disabled]="submitting()">
                                @if (submitting()) {
                                    <span class="spinner-small"></span> {{ 'careers.modal.form.submitting' | translate }}
                                } @else {
                                    {{ 'careers.modal.form.submit' | translate }}
                                }
                            </button>
                        </div>
                    }
                </div>
            </div>
        }

        <app-footer />
    `,
    styles: [`
        .page-content { padding-top: 80px; }
        .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

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

        .hero-section h1 { font-size: 56px; font-weight: 800; margin-bottom: 20px; }
        .hero-section p { font-size: 20px; color: #94A3B8; }

        .culture-section { padding: 100px 0; }
        .section-title { font-size: 36px; text-align: center; margin-bottom: 60px; color: #1E293B; }
        .culture-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }

        .culture-card {
            text-align: center;
            padding: 40px 30px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s;
        }

        .culture-card:hover { transform: translateY(-8px); }
        .culture-card .icon { font-size: 48px; display: block; margin-bottom: 20px; }
        .culture-card h3 { font-size: 20px; color: #1E293B; margin-bottom: 12px; }
        .culture-card p { color: #64748B; font-size: 14px; }

        .jobs-section { padding: 100px 0; background: #F8FAFC; }
        .jobs-list { display: flex; flex-direction: column; gap: 20px; max-width: 900px; margin: 0 auto; }

        .job-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 30px 40px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s;
        }

        .job-card:hover { transform: translateX(8px); }
        .job-info h3 { font-size: 20px; color: #1E293B; margin-bottom: 12px; }
        .job-meta { display: flex; gap: 24px; }
        .job-meta span { color: #64748B; font-size: 14px; }
        .job-desc { color: #64748B; font-size: 14px; margin-top: 12px; max-width: 500px; }

        .btn-apply {
            padding: 12px 28px;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            color: white;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            flex-shrink: 0;
        }

        .btn-apply:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(14, 165, 233, 0.3); }

        .cta-section { padding: 100px 0; background: linear-gradient(135deg, #10B981, #059669); }
        .cta-content { text-align: center; color: white; }
        .cta-content h2 { font-size: 40px; margin-bottom: 16px; }
        .cta-content p { font-size: 18px; opacity: 0.9; margin-bottom: 32px; }
        .btn-cta {
            display: inline-block;
            padding: 16px 40px;
            background: white;
            color: #10B981;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            transition: all 0.3s;
        }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }

        /* Modal Styles */
        .modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        }

        .modal {
            background: white;
            border-radius: 20px;
            width: 100%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(-20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 24px 28px;
            border-bottom: 1px solid #E2E8F0;
        }

        .modal-header h2 { font-size: 22px; font-weight: 700; color: #1E293B; margin: 0 0 4px; }
        .modal-subtitle { color: #64748B; font-size: 14px; margin: 0; }

        .btn-close {
            width: 36px;
            height: 36px;
            border: none;
            background: #F1F5F9;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            color: #64748B;
            transition: all 0.2s;
        }
        .btn-close:hover { background: #E2E8F0; color: #1E293B; }

        .modal-body { padding: 28px; }
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            padding: 20px 28px;
            border-top: 1px solid #E2E8F0;
            background: #F8FAFC;
            border-radius: 0 0 20px 20px;
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #E5E7EB;
            border-radius: 12px;
            font-size: 15px;
            transition: all 0.2s;
            font-family: inherit;
        }
        .form-group input:focus, .form-group textarea:focus {
            outline: none;
            border-color: #0EA5E9;
            box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }
        .form-group textarea { resize: vertical; min-height: 100px; }

        .file-upload { position: relative; }
        .file-upload input[type="file"] { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; }
        .file-label {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 20px;
            border: 2px dashed #D1D5DB;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            background: #F9FAFB;
        }
        .file-label:hover { border-color: #0EA5E9; background: #F0F9FF; }
        .file-icon { font-size: 24px; }
        .file-label span { color: #64748B; font-size: 14px; }

        .btn-primary {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(14, 165, 233, 0.3); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-secondary {
            padding: 12px 28px;
            background: #F1F5F9;
            color: #475569;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-secondary:hover { background: #E2E8F0; }

        .form-error {
            background: #FEE2E2;
            color: #DC2626;
            padding: 12px 16px;
            border-radius: 10px;
            font-size: 14px;
            margin-top: 8px;
        }

        .success-state {
            text-align: center;
            padding: 60px 40px;
        }
        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            font-size: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
        }
        .success-state h3 { font-size: 24px; color: #1E293B; margin-bottom: 12px; }
        .success-state p { color: #64748B; margin-bottom: 32px; }

        .spinner-small {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
            .hero-section h1 { font-size: 40px; }
            .culture-grid { grid-template-columns: repeat(2, 1fr); }
            .job-card { flex-direction: column; gap: 20px; text-align: center; }
            .job-meta { justify-content: center; flex-wrap: wrap; }
            .job-desc { max-width: 100%; }
        }

        @media (max-width: 640px) {
            .hero-section h1 { font-size: 32px; }
            .culture-grid { grid-template-columns: 1fr; }
            .form-row { grid-template-columns: 1fr; }
            .modal { margin: 10px; }
        }
    `]
})
export class CareersComponent implements OnInit {
    private readonly careerService = inject(CareerService);

    jobs = signal<Job[]>([]);
    loading = signal(true);

    // Modal state
    showModal = signal(false);
    selectedJob = signal<Job | null>(null);
    submitting = signal(false);
    submitSuccess = signal(false);
    formError = signal<string | null>(null);
    selectedFile = signal<File | null>(null);

    // Form data
    applicationForm = {
        name: '',
        email: '',
        phone: '',
        coverLetter: '',
        linkedInUrl: ''
    };

    ngOnInit() {
        this.loadJobs();
    }

    loadJobs() {
        this.careerService.getJobs().subscribe({
            next: (data: Job[]) => {
                this.jobs.set(data);
                this.loading.set(false);
            },
            error: (err: unknown) => {
                console.error('Failed to load jobs', err);
                this.loading.set(false);
            }
        });
    }

    openApplicationModal(job: Job) {
        this.selectedJob.set(job);
        this.showModal.set(true);
        this.submitSuccess.set(false);
        this.formError.set(null);
        this.resetForm();
    }

    closeModal() {
        this.showModal.set(false);
        this.selectedJob.set(null);
        this.submitSuccess.set(false);
        this.formError.set(null);
        this.resetForm();
    }

    resetForm() {
        this.applicationForm = {
            name: '',
            email: '',
            phone: '',
            coverLetter: '',
            linkedInUrl: ''
        };
        this.selectedFile.set(null);
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile.set(input.files[0]);
        }
    }

    submitApplication() {
        // Validate required fields
        if (!this.applicationForm.name.trim()) {
            this.formError.set('Please enter your full name');
            return;
        }
        if (!this.applicationForm.email.trim()) {
            this.formError.set('Please enter your email address');
            return;
        }
        if (!this.isValidEmail(this.applicationForm.email)) {
            this.formError.set('Please enter a valid email address');
            return;
        }

        this.submitting.set(true);
        this.formError.set(null);

        const formData = new FormData();
        formData.append('name', this.applicationForm.name.trim());
        formData.append('email', this.applicationForm.email.trim());
        if (this.applicationForm.phone) {
            formData.append('phone', this.applicationForm.phone.trim());
        }
        if (this.applicationForm.coverLetter) {
            formData.append('coverLetter', this.applicationForm.coverLetter.trim());
        }
        if (this.applicationForm.linkedInUrl) {
            formData.append('linkedInUrl', this.applicationForm.linkedInUrl.trim());
        }
        const file = this.selectedFile();
        if (file) {
            formData.append('resume', file);
        }

        const job = this.selectedJob();
        if (!job) return;

        this.careerService.applyForJob(job.id, formData).subscribe({
            next: () => {
                this.submitting.set(false);
                this.submitSuccess.set(true);
            },
            error: (err: any) => {
                this.submitting.set(false);
                console.error('Failed to submit application', err);
                this.formError.set(err.error?.message || 'Failed to submit application. Please try again.');
            }
        });
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

