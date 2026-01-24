import { Component, ChangeDetectionStrategy, signal, inject, OnInit, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationDropdownComponent } from './notification-dropdown.component';
import { CommandPaletteComponent } from './command-palette.component';

@Component({
    selector: 'app-admin-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterOutlet, NotificationDropdownComponent, CommandPaletteComponent],
    template: `
        <div class="admin-layout" [class.dark]="themeService.isDark()">
            <!-- Command Palette -->
            <app-command-palette [isOpen]="commandPaletteOpen()" (close)="commandPaletteOpen.set(false)" />

            <!-- Sidebar -->
            <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
                <div class="sidebar-header">
                    <span class="logo-icon">💊</span>
                    @if (!sidebarCollapsed()) {
                        <span class="logo-text">HAC Admin</span>
                    }
                </div>

                <nav class="sidebar-nav">
                    <a routerLink="/admin/dashboard" class="nav-item" routerLinkActive="active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="9"/>
                            <rect x="14" y="3" width="7" height="5"/>
                            <rect x="14" y="12" width="7" height="9"/>
                            <rect x="3" y="16" width="7" height="5"/>
                        </svg>
                        @if (!sidebarCollapsed()) { <span>Dashboard</span> }
                    </a>
                    
                    <a routerLink="/admin/pages" class="nav-item" routerLinkActive="active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        @if (!sidebarCollapsed()) { <span>Pages</span> }
                    </a>
                    
                    <a routerLink="/admin/products" class="nav-item" routerLinkActive="active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v8M8 12h8"/>
                        </svg>
                        @if (!sidebarCollapsed()) { <span>Products</span> }
                    </a>
                    
                    <a routerLink="/admin/media" class="nav-item" routerLinkActive="active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        @if (!sidebarCollapsed()) { <span>Media</span> }
                    </a>
                    
                    <a routerLink="/admin/messages" class="nav-item" routerLinkActive="active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        @if (!sidebarCollapsed()) { <span>Messages</span> }
                    </a>
                    

                    
                    <a routerLink="/admin/careers" class="nav-item" routerLinkActive="active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                        @if (!sidebarCollapsed()) { <span>Careers</span> }
                    </a>
                    
                    <a routerLink="/admin/events" class="nav-item" routerLinkActive="active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        @if (!sidebarCollapsed()) { <span>Events</span> }
                    </a>
                    
                    <a routerLink="/admin/news" class="nav-item" routerLinkActive="active">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                            <line x1="10" y1="6" x2="18" y2="6"/>
                            <line x1="10" y1="10" x2="18" y2="10"/>
                            <line x1="10" y1="14" x2="18" y2="14"/>
                        </svg>
                        @if (!sidebarCollapsed()) { <span>News</span> }
                    </a>
                    
                    @if (auth.isAdmin()) {
                        <a routerLink="/admin/users" class="nav-item" routerLinkActive="active">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            @if (!sidebarCollapsed()) { <span>Users</span> }
                        </a>

                        <a routerLink="/admin/settings" class="nav-item" routerLinkActive="active">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                            @if (!sidebarCollapsed()) { <span>Settings</span> }
                        </a>
                    }
                </nav>

                <div class="sidebar-footer">
                    <button class="collapse-btn" (click)="toggleSidebar()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [style.transform]="sidebarCollapsed() ? 'rotate(180deg)' : ''">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="main-content">
                <!-- Top Bar -->
                <header class="topbar">
                    <div class="topbar-left">
                        <h1>{{ pageTitle }}</h1>
                        <button class="search-trigger" (click)="commandPaletteOpen.set(true)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <span>Search...</span>
                            <kbd>⌘K</kbd>
                        </button>
                    </div>
                    <div class="topbar-right">
                        <!-- Theme Toggle -->
                        <button class="btn-theme" (click)="themeService.toggleTheme()" [attr.aria-label]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
                            @if (themeService.isDark()) {
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="5"/>
                                    <line x1="12" y1="1" x2="12" y2="3"/>
                                    <line x1="12" y1="21" x2="12" y2="23"/>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                    <line x1="1" y1="12" x2="3" y2="12"/>
                                    <line x1="21" y1="12" x2="23" y2="12"/>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                </svg>
                            } @else {
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                            }
                        </button>

                        <!-- Notifications -->
                        <app-notification-dropdown />

                        <a href="/" target="_blank" class="btn-view-site">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            View Site
                        </a>
                        <div class="user-menu">
                            <span class="user-name">{{ auth.user()?.name }}</span>
                            <button class="btn-logout" (click)="logout()">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                <!-- Page Content -->
                <div class="page-content">
                    <router-outlet />
                </div>
            </main>
        </div>
    `,
    styles: [`
        .admin-layout {
            display: flex;
            min-height: 100vh;
            background: var(--bg-tertiary, #F1F5F9);
            transition: background 0.3s;
        }

        .admin-layout.dark {
            background: var(--bg-primary, #0F172A);
        }

        .sidebar {
            width: 260px;
            background: var(--bg-dark, #1E293B);
            display: flex;
            flex-direction: column;
            transition: width 0.3s;
            position: fixed;
            height: 100vh;
            z-index: 100;
        }

        .sidebar.collapsed {
            width: 80px;
        }

        .sidebar-header {
            padding: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .logo-icon {
            font-size: 28px;
        }

        .logo-text {
            font-size: 20px;
            font-weight: 700;
            color: white;
        }

        .sidebar-nav {
            flex: 1;
            padding: 16px 12px;
            overflow-y: auto;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: #94A3B8;
            text-decoration: none;
            border-radius: 10px;
            margin-bottom: 4px;
            transition: all 0.2s;
        }

        .nav-item:hover {
            background: rgba(255,255,255,0.05);
            color: white;
        }

        .nav-item.active {
            background: var(--primary-blue, #0EA5E9);
            color: white;
        }

        .nav-item span {
            font-size: 14px;
            font-weight: 500;
        }

        .sidebar-footer {
            padding: 16px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        .collapse-btn {
            width: 100%;
            padding: 10px;
            background: rgba(255,255,255,0.05);
            border: none;
            border-radius: 8px;
            color: #94A3B8;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .collapse-btn:hover {
            background: rgba(255,255,255,0.1);
            color: white;
        }

        .main-content {
            flex: 1;
            margin-left: 260px;
            transition: margin-left 0.3s;
        }

        .sidebar.collapsed + .main-content {
            margin-left: 80px;
        }

        .topbar {
            background: var(--bg-card, rgba(255, 255, 255, 0.9));
            backdrop-filter: blur(12px);
            padding: 16px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-light, #E2E8F0);
            position: sticky;
            top: 0;
            z-index: 50;
        }

        .topbar-left {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .topbar h1 {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-primary, #1E293B);
        }

        .search-trigger {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            background: var(--bg-tertiary, #F1F5F9);
            border: 1px solid var(--border-light, #E2E8F0);
            border-radius: 10px;
            color: var(--text-muted, #64748B);
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .search-trigger:hover {
            border-color: var(--primary-blue, #0EA5E9);
            background: var(--bg-secondary, #F8FAFC);
        }

        .search-trigger kbd {
            padding: 2px 6px;
            background: var(--bg-secondary, #E2E8F0);
            border-radius: 4px;
            font-size: 11px;
            font-family: inherit;
        }

        .topbar-right {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .btn-theme {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-tertiary, #F1F5F9);
            border: none;
            border-radius: 10px;
            color: var(--text-muted, #64748B);
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-theme:hover {
            background: var(--primary-blue, #0EA5E9);
            color: white;
        }

        .btn-view-site {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--bg-tertiary, #F1F5F9);
            border-radius: 8px;
            color: var(--text-muted, #64748B);
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s;
        }

        .btn-view-site:hover {
            background: var(--bg-secondary, #E2E8F0);
            color: var(--text-primary, #1E293B);
        }

        .user-menu {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary, #1E293B);
        }

        .btn-logout {
            padding: 8px;
            background: none;
            border: 1px solid var(--border-light, #E2E8F0);
            border-radius: 8px;
            color: var(--text-muted, #64748B);
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-logout:hover {
            background: #FEE2E2;
            border-color: #FECACA;
            color: #DC2626;
        }

        .page-content {
            padding: 32px;
        }

        @media (max-width: 768px) {
            .sidebar {
                width: 80px;
            }
            .main-content {
                margin-left: 80px;
            }
            .search-trigger span,
            .search-trigger kbd {
                display: none;
            }
        }
    `]
})
export class AdminLayoutComponent implements OnInit {
    private readonly platformId = inject(PLATFORM_ID);
    readonly auth = inject(AuthService);
    readonly themeService = inject(ThemeService);
    private readonly router = inject(Router);

    sidebarCollapsed = signal(false);
    commandPaletteOpen = signal(false);
    pageTitle = 'Dashboard';

    ngOnInit(): void {
        // Only check auth in browser to prevent SSR redirect loops
        if (isPlatformBrowser(this.platformId)) {
            if (!this.auth.isAuthenticated()) {
                this.router.navigate(['/admin/login']);
            }
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeydown(event: KeyboardEvent): void {
        if (!isPlatformBrowser(this.platformId)) return;

        // Cmd/Ctrl + K - Open command palette
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            this.commandPaletteOpen.set(true);
        }

        // Escape - Close modals
        if (event.key === 'Escape') {
            this.commandPaletteOpen.set(false);
        }
    }

    toggleSidebar(): void {
        this.sidebarCollapsed.update(v => !v);
    }

    logout(): void {
        this.auth.logout();
    }
}
