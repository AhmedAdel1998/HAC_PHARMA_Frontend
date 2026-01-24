import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-admin-login',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule],
    template: `
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <div class="logo">
                        <span class="logo-icon">💊</span>
                        <span class="logo-text">HAC Pharma</span>
                    </div>
                    <h1>Admin Dashboard</h1>
                    <p>Sign in to manage your website</p>
                </div>

                <form (ngSubmit)="login()" class="login-form">
                    @if (error()) {
                        <div class="error-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            {{ error() }}
                        </div>
                    }

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email"
                            [(ngModel)]="email"
                            name="email"
                            placeholder="admin@hacpharma.com"
                            required
                            autocomplete="email"
                        />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            [(ngModel)]="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            autocomplete="current-password"
                        />
                    </div>

                    <button type="submit" class="btn-login" [disabled]="loading()">
                        @if (loading()) {
                            <span class="spinner"></span>
                            Signing in...
                        } @else {
                            Sign In
                        }
                    </button>
                </form>

                <div class="login-footer">
                    <a href="/">← Back to Website</a>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0F172A, #1E293B);
            padding: 20px;
        }

        .login-card {
            background: white;
            border-radius: 20px;
            padding: 48px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .login-header {
            text-align: center;
            margin-bottom: 32px;
        }

        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 24px;
        }

        .logo-icon {
            font-size: 32px;
        }

        .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: #1E293B;
        }

        h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1E293B;
            margin-bottom: 8px;
        }

        .login-header p {
            color: #64748B;
            font-size: 14px;
        }

        .error-message {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            background: #FEE2E2;
            border: 1px solid #FECACA;
            border-radius: 10px;
            color: #DC2626;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
            padding: 14px 16px;
            border: 1px solid #E5E7EB;
            border-radius: 10px;
            font-size: 15px;
            transition: all 0.2s;
            box-sizing: border-box;
        }

        input:focus {
            outline: none;
            border-color: #0EA5E9;
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .btn-login {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #0EA5E9, #0284C7);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-login:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
        }

        .btn-login:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .login-footer {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #E5E7EB;
        }

        .login-footer a {
            color: #64748B;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s;
        }

        .login-footer a:hover {
            color: #0EA5E9;
        }
    `]
})
export class AdminLoginComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    email = '';
    password = '';
    loading = signal(false);
    error = signal<string | null>(null);

    login(): void {
        if (!this.email || !this.password) {
            this.error.set('Please enter email and password');
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        this.auth.login({
            email: this.email.trim(),
            password: this.password.trim()
        }).subscribe({
            next: () => {
                this.router.navigate(['/admin/dashboard']);
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err.error?.message || 'Invalid email or password');
            }
        });
    }
}
