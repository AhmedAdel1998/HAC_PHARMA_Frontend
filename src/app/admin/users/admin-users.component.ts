import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/models/cms.models';

@Component({
    selector: 'app-admin-users',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, DatePipe, FormsModule],
    template: `
        <div class="users-container">
            <div class="page-header">
                <div class="header-left">
                    <h1>User Management</h1>
                    <p>Manage admin users and permissions</p>
                </div>
                <button class="btn-primary" (click)="toggleForm()" [disabled]="showForm()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add User
                </button>
            </div>

            @if (showForm()) {
                <div class="user-form-card">
                    <h3>Add New User</h3>
                    <form [formGroup]="userForm" (ngSubmit)="createUser()">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" formControlName="name" placeholder="Full Name" />
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" formControlName="email" placeholder="user@example.com" />
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" formControlName="password" placeholder="••••••••" />
                            </div>
                            <div class="form-group">
                                <label>Role</label>
                                <select formControlName="role">
                                    <option value="Admin">Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" (click)="toggleForm()">Cancel</button>
                            <button type="submit" class="btn-primary" [disabled]="userForm.invalid || saving()">
                                {{ saving() ? 'Creating...' : 'Create User' }}
                            </button>
                        </div>
                    </form>
                </div>
            }

            @if (loading()) {
                <div class="loading">Loading users...</div>
            } @else {
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (user of users(); track user.id) {
                                <tr>
                                    <td>
                                        <div class="user-info">
                                            <strong>{{ user.name }}</strong>
                                            <span>{{ user.email }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="role-badge" [class]="user.role.toLowerCase()">{{ user.role }}</span>
                                    </td>
                                    <td>{{ user.createdAt | date:'mediumDate' }}</td>
                                    <td>
                                        <div class="actions">
                                            <button class="btn-icon danger" (click)="deleteUser(user)" title="Delete">
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
                </div>
            }
        </div>
    `,
    styles: [`
        .users-container { max-width: 1000px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; font-weight: 700; color: #1E293B; margin-bottom: 4px; }
        .page-header p { color: #64748B; font-size: 14px; }

        .btn-primary { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #0EA5E9; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-primary:hover { background: #0284C7; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-secondary { padding: 10px 20px; background: white; border: 1px solid #E2E8F0; color: #64748B; border-radius: 8px; cursor: pointer; }
        .btn-secondary:hover { border-color: #94A3B8; color: #1E293B; }

        .user-form-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; margin-bottom: 24px; animation: slideDown 0.3s ease; }
        .user-form-card h3 { margin-bottom: 16px; font-size: 16px; color: #1E293B; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 500; color: #64748B; margin-bottom: 6px; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #CBD5E1; border-radius: 6px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; }

        .table-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 16px; text-align: left; border-bottom: 1px solid #E2E8F0; }
        th { background: #F8FAFC; font-size: 13px; font-weight: 600; color: #64748B; text-transform: uppercase; }
        
        .user-info strong { display: block; color: #1E293B; }
        .user-info span { font-size: 13px; color: #64748B; }

        .role-badge { padding: 4px 10px; border-radius: 50px; font-size: 12px; font-weight: 600; }
        .role-badge.admin { background: #DBEAFE; color: #1D4ED8; }
        .role-badge.editor { background: #DCFCE7; color: #16A34A; }
        .role-badge.viewer { background: #F1F5F9; color: #64748B; }

        .btn-icon { padding: 6px; border: none; background: transparent; cursor: pointer; color: #94A3B8; }
        .btn-icon.danger:hover { background: #FEE2E2; color: #DC2626; border-radius: 6px; }

        .loading { text-align: center; padding: 40px; color: #64748B; }

        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    `]
})
export class AdminUsersComponent implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly fb = inject(FormBuilder);

    users = signal<User[]>([]);
    loading = signal(true);
    showForm = signal(false);
    saving = signal(false);

    userForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        role: ['Editor', Validators.required]
    });

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.adminService.getUsers().subscribe({
            next: (data) => {
                this.users.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load users', err);
                this.users.set([]);
                this.loading.set(false);
            }
        });
    }

    toggleForm() {
        this.showForm.update(v => !v);
        if (!this.showForm()) this.userForm.reset({ role: 'Editor' });
    }

    createUser() {
        if (this.userForm.invalid) return;

        this.saving.set(true);
        const userData = this.userForm.value as any;

        this.adminService.createUser(userData).subscribe({
            next: () => {
                this.loadUsers();
                this.saving.set(false);
                this.toggleForm();
                this.userForm.reset({ role: 'Editor' });
                alert('User created successfully');
            },
            error: (err) => {
                console.error('Failed to create user', err);
                this.saving.set(false);
                const errorMessage = err.error?.message || 'Failed to create user';
                alert(errorMessage);
            }
        });
    }

    deleteUser(user: User) {
        if (confirm(`Delete user "${user.name}"?`)) {
            this.adminService.deleteUser(user.id).subscribe({
                next: () => this.loadUsers(),
                error: (err) => console.error(err)
            });
        }
    }
}
