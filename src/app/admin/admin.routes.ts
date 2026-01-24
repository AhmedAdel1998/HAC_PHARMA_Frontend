import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { adminGuard } from '../core/guards/admin.guard';

export const adminRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./login/admin-login.component').then(m => m.AdminLoginComponent)
    },
    {
        path: '',
        loadComponent: () => import('./layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            },
            {
                path: 'pages',
                loadComponent: () => import('./pages/admin-pages.component').then(m => m.AdminPagesComponent)
            },
            {
                path: 'pages/:key/edit',
                loadComponent: () => import('./pages/page-editor.component').then(m => m.PageEditorComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./products/admin-products.component').then(m => m.AdminProductsComponent)
            },
            {
                path: 'products/new',
                loadComponent: () => import('./products/product-form.component').then(m => m.ProductFormComponent)
            },
            {
                path: 'products/:id/edit',
                loadComponent: () => import('./products/product-form.component').then(m => m.ProductFormComponent)
            },
            {
                path: 'media',
                loadComponent: () => import('./media/admin-media.component').then(m => m.AdminMediaComponent)
            },
            {
                path: 'messages',
                loadComponent: () => import('./messages/admin-messages.component').then(m => m.AdminMessagesComponent)
            },
            {
                path: 'careers',
                loadComponent: () => import('./careers/admin-careers.component').then(m => m.AdminCareersComponent)
            },
            {
                path: 'events',
                loadComponent: () => import('./events/admin-events.component').then(m => m.AdminEventsComponent)
            },
            {
                path: 'news',
                loadComponent: () => import('./news/admin-news.component').then(m => m.AdminNewsComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./users/admin-users.component').then(m => m.AdminUsersComponent),
                canActivate: [adminGuard]
            },
            {
                path: 'settings',
                loadComponent: () => import('./settings/admin-settings.component').then(m => m.AdminSettingsComponent),
                canActivate: [adminGuard]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
