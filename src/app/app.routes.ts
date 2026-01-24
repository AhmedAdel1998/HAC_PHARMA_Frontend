import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shared/components/home/home').then(m => m.Home)
    },
    {
        path: 'about',
        loadComponent: () => import('./shared/components/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./shared/components/services/services.component').then(m => m.ServicesComponent)
    },
    {
        path: 'products',
        loadComponent: () => import('./shared/components/products/products.component').then(m => m.ProductsComponent)
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./shared/components/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
    },
    {
        path: 'team',
        loadComponent: () => import('./shared/components/team/team.component').then(m => m.TeamComponent)
    },
    {
        path: 'partners',
        loadComponent: () => import('./shared/components/partners/partners.component').then(m => m.PartnersComponent)
    },
    {
        path: 'careers',
        loadComponent: () => import('./shared/components/careers/careers.component').then(m => m.CareersComponent)
    },
    {
        path: 'news',
        loadComponent: () => import('./shared/components/news/news.component').then(m => m.NewsComponent)
    },
    {
        path: 'schedule',
        loadComponent: () => import('./shared/components/scheduler/scheduler.component').then(m => m.SchedulerComponent)
    },
    {
        path: 'blog',
        loadComponent: () => import('./shared/components/blog/blog.component').then(m => m.BlogComponent)
    },
    {
        path: 'blog/:id',
        loadComponent: () => import('./shared/components/blog/blog.component').then(m => m.BlogComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./shared/components/contact/contact.component').then(m => m.ContactComponent)
    },
    {
        path: 'faq',
        loadComponent: () => import('./shared/components/faq/faq.component').then(m => m.FAQComponent)
    },
    {
        path: 'events',
        loadComponent: () => import('./shared/components/events/events.component').then(m => m.EventsComponent)
    },
    {
        path: 'privacy',
        loadComponent: () => import('./shared/components/privacy/privacy.component').then(m => m.PrivacyComponent)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
