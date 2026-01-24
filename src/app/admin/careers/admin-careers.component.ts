import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CareerService } from '../../core/services/career.service';
import { Job, JobApplication } from '../../core/models/cms.models';

@Component({
    selector: 'app-admin-careers',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, NgClass, FormsModule],
    template: `
        <div class="careers-container">
            <div class="page-header">
                <div class="header-left">
                    <h1>Careers &amp; Applications</h1>
                    <p>Manage job listings and applications</p>
                </div>
                @if (activeTab() === 'jobs') {
                    <button class="btn-primary" (click)="openJobModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Post Job
                    </button>
                }
            </div>

            <div class="tabs">
                <button [class.active]="activeTab() === 'jobs'" (click)="activeTab.set('jobs')">
                    Jobs Listing
                </button>
                <button [class.active]="activeTab() === 'applications'" (click)="activeTab.set('applications')">
                    Applications
                </button>
            </div>

            @if (activeTab() === 'jobs') {
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (job of jobs(); track job.id) {
                                <tr>
                                    <td>
                                        <strong>{{ job.title }}</strong>
                                        <div class="sub-text">{{ job.department }}</div>
                                    </td>
                                    <td>{{ job.location }}</td>
                                    <td>{{ job.type }}</td>
                                    <td>
                                        <span class="status-badge" [class.active]="job.isActive">
                                            {{ job.isActive ? 'Active' : 'Closed' }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn-icon" (click)="editJob(job)" title="Edit">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                            <button class="btn-icon danger" (click)="deleteJob(job)" title="Delete">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                     @if (jobs().length === 0) {
                        <div class="empty-state">No jobs found.</div>
                    }
                </div>
            } @else {
                <div class="table-container applications-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Applicant Details</th>
                                <th>Position</th>
                                <th>Contact</th>
                                <th>Resume</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (app of applications(); track app.id) {
                                <tr>
                                    <td class="applicant-cell">
                                        <div class="applicant-avatar">{{ app.name.charAt(0) }}</div>
                                        <div class="applicant-info">
                                            <strong>{{ app.name }}</strong>
                                            <div class="sub-text">Applied {{ app.createdAt | date:'MMM d, y' }}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="position-tag">{{ app.jobTitle || 'Unknown' }}</span>
                                    </td>
                                    <td class="contact-cell">
                                        <div class="contact-item">
                                            <span class="contact-icon">📧</span>
                                            <a [href]="'mailto:' + app.email" class="contact-link">{{ app.email }}</a>
                                        </div>
                                        @if (app.phone) {
                                            <div class="contact-item">
                                                <span class="contact-icon">📞</span>
                                                <a [href]="'tel:' + app.phone" class="contact-link">{{ app.phone }}</a>
                                            </div>
                                        }
                                    </td>
                                    <td>
                                        @if (app.resumeUrl) {
                                            <a [href]="getResumeUrl(app.resumeUrl)" target="_blank" class="btn-resume">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                    <polyline points="14 2 14 8 20 8"/>
                                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                                </svg>
                                                View CV
                                            </a>
                                        } @else {
                                            <span class="no-resume">No CV</span>
                                        }
                                    </td>
                                    <td>
                                        <span class="status-badge" [ngClass]="app.status || 'pending'">
                                            {{ app.status || 'pending' }}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            [ngModel]="app.status" 
                                            (ngModelChange)="updateAppStatus(app, $event)"
                                            class="status-select"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="interviewed">Interviewed</option>
                                            <option value="hired">Hired</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    @if (applications().length === 0) {
                        <div class="empty-state">
                            <div class="empty-icon">📋</div>
                            <h3>No Applications Yet</h3>
                            <p>Job applications will appear here once candidates apply.</p>
                        </div>
                    }
                </div>
            }
        </div>

        <!-- Job Modal -->
        @if (showJobModal()) {
            <div class="modal-backdrop" (click)="closeJobModal()">
                <div class="modal" (click)="$event.stopPropagation()">
                    <div class="modal-header">
                        <h2>{{ editingJob() ? 'Edit Job' : 'Post New Job' }}</h2>
                        <button class="btn-close" (click)="closeJobModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Job Title (English) *</label>
                                <input type="text" [(ngModel)]="jobForm.title" placeholder="e.g. Senior Software Engineer" />
                            </div>
                            <div class="form-group">
                                <label>Job Title (Arabic)</label>
                                <input type="text" [(ngModel)]="jobForm.titleAr" placeholder="e.g. مهندس برمجيات أول" dir="rtl" />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Department *</label>
                                <input type="text" [(ngModel)]="jobForm.department" placeholder="e.g. Engineering" />
                            </div>
                            <div class="form-group">
                                <label>Location *</label>
                                <input type="text" [(ngModel)]="jobForm.location" placeholder="e.g. Riyadh, Saudi Arabia" />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Job Type *</label>
                                <select [(ngModel)]="jobForm.type">
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" [(ngModel)]="jobForm.isActive" />
                                    Active (visible on website)
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Description *</label>
                            <textarea [(ngModel)]="jobForm.description" rows="4" placeholder="Job description..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Requirements (one per line)</label>
                            <textarea [(ngModel)]="jobForm.requirementsText" rows="4" placeholder="Bachelor's degree in Computer Science&#10;5+ years of experience&#10;Strong communication skills"></textarea>
                        </div>
                        @if (formError()) {
                            <div class="form-error">{{ formError() }}</div>
                        }
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" (click)="closeJobModal()">Cancel</button>
                        <button class="btn-primary" (click)="saveJob()" [disabled]="saving()">
                            {{ saving() ? 'Saving...' : (editingJob() ? 'Update Job' : 'Create Job') }}
                        </button>
                    </div>
                </div>
            </div>
        }
    `,
    styles: [`
        .careers-container { max-width: 1400px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; font-weight: 700; color: #1E293B; margin-bottom: 4px; }
        .page-header p { color: #64748B; font-size: 14px; }

        .btn-primary {
            display: flex; align-items: center; gap: 8px;
            padding: 10px 20px; background: #0EA5E9; color: white;
            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary {
            padding: 10px 20px; background: #F1F5F9; color: #475569;
            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
        }

        .tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 1px solid #E2E8F0; }
        .tabs button {
            padding: 12px 24px; background: none; border: none; border-bottom: 2px solid transparent;
            font-weight: 500; color: #64748B; cursor: pointer;
        }
        .tabs button.active { color: #0EA5E9; border-bottom-color: #0EA5E9; }

        .table-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 16px; text-align: left; border-bottom: 1px solid #E2E8F0; }
        th { background: #F8FAFC; font-size: 13px; font-weight: 600; color: #64748B; text-transform: uppercase; }
        td { font-size: 14px; color: #1E293B; }
        .sub-text { font-size: 12px; color: #64748B; }

        .status-badge { padding: 4px 10px; border-radius: 50px; font-size: 12px; font-weight: 500; }
        .status-badge.active { background: #D1FAE5; color: #059669; }
        
        .status-badge.pending { background: #FEF3C7; color: #D97706; }
        .status-badge.reviewed { background: #DBEAFE; color: #1D4ED8; }
        .status-badge.hired { background: #D1FAE5; color: #059669; }
        .status-badge.rejected { background: #FEE2E2; color: #DC2626; }

        .status-select { padding: 8px 12px; border-radius: 8px; border: 1px solid #E2E8F0; cursor: pointer; font-size: 13px; }
        .status-select:focus { outline: none; border-color: #0EA5E9; }
        
        /* Enhanced Applications Table Styles */
        .applications-table tr:hover { background: #F8FAFC; }
        
        .applicant-cell { display: flex; align-items: center; gap: 14px; }
        .applicant-avatar {
            width: 44px; height: 44px; border-radius: 50%;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            color: white; font-weight: 700; font-size: 18px;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .applicant-info strong { display: block; margin-bottom: 2px; }
        
        .position-tag {
            display: inline-block; padding: 6px 14px;
            background: #F1F5F9; color: #475569;
            border-radius: 6px; font-size: 13px; font-weight: 500;
        }
        
        .contact-cell { font-size: 13px; }
        .contact-item { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .contact-item:last-child { margin-bottom: 0; }
        .contact-icon { font-size: 14px; }
        .contact-link { color: #0EA5E9; text-decoration: none; }
        .contact-link:hover { text-decoration: underline; }
        
        .btn-resume { 
            display: inline-flex; align-items: center; gap: 6px;
            padding: 8px 14px; background: linear-gradient(135deg, #10B981, #059669); color: white;
            border-radius: 8px; font-size: 13px; font-weight: 500; text-decoration: none;
            transition: all 0.2s;
        }
        .btn-resume:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
        .btn-resume svg { stroke: white; }
        
        .no-resume { color: #94A3B8; font-size: 13px; font-style: italic; }
        
        .action-row { display: flex; align-items: center; gap: 10px; }
        .actions { display: flex; gap: 8px; }
        .btn-icon { padding: 6px; border: none; background: #F1F5F9; border-radius: 6px; cursor: pointer; color: #64748B; }
        .btn-icon:hover { background: #E2E8F0; }
        .btn-icon.danger:hover { background: #FEE2E2; color: #DC2626; }

        .empty-state { padding: 60px 40px; text-align: center; color: #64748B; }
        .empty-state .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-state h3 { font-size: 18px; color: #1E293B; margin: 0 0 8px; }
        .empty-state p { margin: 0; font-size: 14px; }

        /* Modal Styles */
        .modal-backdrop {
            position: fixed; inset: 0; background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000;
        }
        .modal {
            background: white; border-radius: 16px; width: 100%; max-width: 600px;
            max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        }
        .modal-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 24px; border-bottom: 1px solid #E2E8F0;
        }
        .modal-header h2 { font-size: 20px; font-weight: 700; color: #1E293B; margin: 0; }
        .btn-close {
            width: 32px; height: 32px; border: none; background: #F1F5F9;
            border-radius: 8px; font-size: 20px; cursor: pointer; color: #64748B;
        }
        .modal-body { padding: 24px; }
        .modal-footer {
            display: flex; justify-content: flex-end; gap: 12px;
            padding: 20px 24px; border-top: 1px solid #E2E8F0; background: #F8FAFC;
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB;
            border-radius: 8px; font-size: 14px; transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none; border-color: #0EA5E9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
        }
        .checkbox-group { display: flex; align-items: center; }
        .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 0; }
        .checkbox-group input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
        .form-error { background: #FEE2E2; color: #DC2626; padding: 12px; border-radius: 8px; margin-top: 16px; font-size: 14px; }

        @media (max-width: 640px) {
            .form-row { grid-template-columns: 1fr; }
        }
    `]
})
export class AdminCareersComponent implements OnInit {
    private readonly careerService = inject(CareerService);

    activeTab = signal<'jobs' | 'applications'>('jobs');
    jobs = signal<Job[]>([]);
    applications = signal<JobApplication[]>([]);

    // Modal state
    showJobModal = signal(false);
    editingJob = signal<Job | null>(null);
    saving = signal(false);
    formError = signal<string | null>(null);

    // Form data
    jobForm = {
        title: '',
        titleAr: '',
        department: '',
        location: '',
        type: 'Full-time' as 'Full-time' | 'Part-time' | 'Contract',
        description: '',
        requirementsText: '',
        isActive: true
    };

    ngOnInit() {
        this.loadJobs();
        this.loadApplications();
    }

    loadJobs() {
        this.careerService.getJobs(false).subscribe({
            next: (data) => this.jobs.set(data),
            error: (err) => {
                console.error('Failed to load jobs', err);
                this.jobs.set([]);
            }
        });
    }

    loadApplications() {
        this.careerService.getApplications().subscribe({
            next: (data) => this.applications.set(data.items),
            error: (err) => {
                console.error('Failed to load applications', err);
                this.applications.set([]);
            }
        });
    }

    // Construct full URL for resume files
    getResumeUrl(resumeUrl: string): string {
        if (!resumeUrl) return '';
        // If already a full URL, return as is
        if (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://')) {
            return resumeUrl;
        }
        // Prepend backend URL
        return 'https://localhost:7255' + (resumeUrl.startsWith('/') ? '' : '/') + resumeUrl;
    }

    deleteJob(job: Job) {
        if (confirm(`Delete job "${job.title}"?`)) {
            this.careerService.deleteJob(job.id).subscribe({
                next: () => this.loadJobs(),
                error: (err) => console.error(err)
            });
        }
    }

    updateAppStatus(app: JobApplication, status: string) {
        if (!app.id) return;
        this.careerService.updateApplicationStatus(app.id, status).subscribe({
            next: () => this.loadApplications(),
            error: (err) => console.error(err)
        });
    }

    openJobModal(job?: Job) {
        this.formError.set(null);
        if (job) {
            this.editingJob.set(job);
            this.jobForm = {
                title: job.title,
                titleAr: job.titleAr || '',
                department: job.department,
                location: job.location,
                type: job.type,
                description: job.description,
                requirementsText: job.requirements?.join('\n') || '',
                isActive: job.isActive
            };
        } else {
            this.editingJob.set(null);
            this.jobForm = {
                title: '',
                titleAr: '',
                department: '',
                location: '',
                type: 'Full-time',
                description: '',
                requirementsText: '',
                isActive: true
            };
        }
        this.showJobModal.set(true);
    }

    editJob(job: Job) {
        this.openJobModal(job);
    }

    closeJobModal() {
        this.showJobModal.set(false);
        this.editingJob.set(null);
        this.formError.set(null);
    }

    saveJob() {
        // Validate required fields
        if (!this.jobForm.title.trim()) {
            this.formError.set('Job title is required');
            return;
        }
        if (!this.jobForm.department.trim()) {
            this.formError.set('Department is required');
            return;
        }
        if (!this.jobForm.location.trim()) {
            this.formError.set('Location is required');
            return;
        }
        if (!this.jobForm.description.trim()) {
            this.formError.set('Description is required');
            return;
        }

        this.saving.set(true);
        this.formError.set(null);

        const jobData: Partial<Job> = {
            title: this.jobForm.title.trim(),
            titleAr: this.jobForm.titleAr.trim(),
            department: this.jobForm.department.trim(),
            location: this.jobForm.location.trim(),
            type: this.jobForm.type,
            description: this.jobForm.description.trim(),
            requirements: this.jobForm.requirementsText.split('\n').map(r => r.trim()).filter(r => r),
            isActive: this.jobForm.isActive
        };

        const editing = this.editingJob();
        const request = editing
            ? this.careerService.updateJob(editing.id, jobData)
            : this.careerService.createJob(jobData);

        request.subscribe({
            next: () => {
                this.saving.set(false);
                this.closeJobModal();
                this.loadJobs();
            },
            error: (err) => {
                this.saving.set(false);
                console.error('Failed to save job', err);
                this.formError.set(err.error?.message || 'Failed to save job. Please try again.');
            }
        });
    }
}
