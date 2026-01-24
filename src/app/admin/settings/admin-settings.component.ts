import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { SiteSettings } from '../../core/models/cms.models';
import { SettingsService } from '../../core/services/settings.service';

@Component({
    selector: 'app-admin-settings',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule],
    template: `
        <div class="settings-container">
            <div class="page-header">
                <h1>Site Settings</h1>
                <p>Configure website settings and preferences</p>
            </div>

            @if (loading()) {
                <div class="loading">Loading settings...</div>
            } @else {
                <form [formGroup]="settingsForm" (ngSubmit)="saveSettings()">
                    <div class="section-card">
                        <h2>General Information</h2>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Site Name</label>
                                <input type="text" formControlName="siteName" />
                            </div>
                            <div class="form-group">
                                <label>Default Language</label>
                                <select formControlName="defaultLanguage">
                                    <option value="en">English</option>
                                    <option value="ar">Arabic</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="section-card">
                        <h2>Contact Information</h2>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Contact Email</label>
                                <input type="email" formControlName="contactEmail" />
                            </div>
                            <div class="form-group">
                                <label>Contact Phone</label>
                                <input type="text" formControlName="contactPhone" />
                            </div>
                            <div class="form-group">
                                <label>WhatsApp Number</label>
                                <input type="text" formControlName="whatsappNumber" placeholder="+966..." />
                            </div>
                        </div>
                    </div>

                    <div class="section-card" formGroupName="socialLinks">
                        <h2>Social Media Links</h2>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>LinkedIn</label>
                                <input type="text" formControlName="linkedin" placeholder="https://linkedin.com/..." />
                            </div>
                            <div class="form-group">
                                <label>Twitter (X)</label>
                                <input type="text" formControlName="twitter" placeholder="https://twitter.com/..." />
                            </div>
                            <div class="form-group">
                                <label>Facebook</label>
                                <input type="text" formControlName="facebook" />
                            </div>
                            <div class="form-group">
                                <label>Instagram</label>
                                <input type="text" formControlName="instagram" />
                            </div>
                        </div>
                    </div>

                    <div class="section-card">
                        <h2>System</h2>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" formControlName="maintenanceMode" />
                                <strong>Maintenance Mode</strong>
                                <p>Enable this to show a maintenance page to visitors.</p>
                            </label>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary" [disabled]="saving()">
                            {{ saving() ? 'Saving...' : 'Save Settings' }}
                        </button>
                    </div>

                    @if (message()) {
                        <div class="toast" [class.error]="isError()">
                            {{ message() }}
                        </div>
                    }
                </form>
            }
        </div>
    `,
    styles: [`
        .settings-container { max-width: 800px; padding-bottom: 40px; }
        .page-header { margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; font-weight: 700; color: #1E293B; margin-bottom: 4px; }
        .page-header p { color: #64748B; font-size: 14px; }

        .section-card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .section-card h2 { font-size: 16px; font-weight: 600; color: #1E293B; margin-bottom: 20px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 500; color: #64748B; }
        .form-group input, .form-group select { padding: 10px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 14px; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #0EA5E9; }

        .checkbox-group label { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
        .checkbox-group input { margin-top: 4px; width: 18px; height: 18px; }
        .checkbox-group strong { display: block; color: #1E293B; font-size: 14px; font-weight: 600; }
        .checkbox-group p { font-size: 13px; color: #64748B; margin-top: 2px; }

        .form-actions { display: flex; justify-content: flex-end; }
        .btn-primary { padding: 12px 32px; background: #0EA5E9; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; }
        .btn-primary:hover { background: #0284C7; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .toast {
            position: fixed; bottom: 24px; right: 24px; padding: 16px 24px; 
            background: #10B981; color: white; border-radius: 8px; 
            font-weight: 500; box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            animation: slideUp 0.3s ease;
        }
        .toast.error { background: #DC2626; }

        .loading { text-align: center; padding: 60px; color: #64748B; }

        @media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    `]
})
export class AdminSettingsComponent implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly settingsService = inject(SettingsService);
    private readonly fb = inject(FormBuilder);

    settingsForm = this.fb.group({
        siteName: [''],
        contactEmail: ['', [Validators.email]],
        contactPhone: [''],
        whatsappNumber: [''],
        defaultLanguage: ['en'],
        maintenanceMode: [false],
        socialLinks: this.fb.group({
            linkedin: [''],
            twitter: [''],
            facebook: [''],
            instagram: ['']
        })
    });

    loading = signal(true);
    saving = signal(false);
    message = signal<string | null>(null);
    isError = signal(false);

    ngOnInit() {
        this.loadSettings();
    }

    loadSettings() {
        this.adminService.getSettings().subscribe({
            next: (settings) => {
                this.settingsForm.patchValue(settings);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load settings', err);
                this.loading.set(false);
            }
        });
    }

    saveSettings() {
        if (this.settingsForm.invalid) return;

        this.saving.set(true);
        this.message.set(null);

        const settings = this.settingsForm.value as Partial<SiteSettings>;

        this.adminService.updateSettings(settings).subscribe({
            next: () => {
                this.saving.set(false);
                this.isError.set(false);
                this.settingsService.loadSettings(); // Refresh global settings
                this.message.set('Settings saved successfully!');
                setTimeout(() => this.message.set(null), 3000);
            },
            error: (err) => {
                console.error('Failed to update settings', err);
                this.saving.set(false);
                this.isError.set(true);
                this.message.set('Failed to save settings.');
            }
        });
    }
}
