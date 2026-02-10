import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface PageSeoConfig {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    type?: string;
    url?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private readonly meta = inject(Meta);
    private readonly title = inject(Title);
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);

    private readonly baseUrl = 'https://hacpharma.com';
    private readonly defaultImage = '/assets/og-image.jpg';
    private readonly siteName = 'HAC Pharma';

    // Default SEO configs for each route
    private readonly routeConfigs: Record<string, PageSeoConfig> = {
        '/': {
            title: 'HAC Pharma | Medical Distribution in Saudi Arabia & GCC',
            description: 'Leading medical distribution company in Saudi Arabia & GCC. SFDA compliant, regulatory affairs, and cold-chain logistics.',
            keywords: 'medical distribution, Saudi Arabia, GCC, SFDA, medicine, healthcare'
        },
        '/about': {
            title: 'About Us | HAC Pharma',
            description: 'Learn about HAC Pharma, a leading medical distribution company headquartered in Riyadh with global reach.',
            keywords: 'HAC Pharma about, medical company, Riyadh, healthcare'
        },
        '/services': {
            title: 'Our Services | HAC Pharma',
            description: 'Regulatory affairs, logistics, market access, and medical affairs services for medical companies.',
            keywords: 'medical services, regulatory affairs, SFDA registration, drug logistics'
        },
        '/products': {
            title: 'Product Portfolio | HAC Pharma',
            description: 'Explore our comprehensive range of medical products across cardiology, oncology, neurology, and more.',
            keywords: 'medical products, medicine, drugs, cardiology, oncology, neurology'
        },
        '/careers': {
            title: 'Careers | HAC Pharma',
            description: 'Join our team at HAC Pharma. Explore job opportunities in medical distribution and healthcare.',
            keywords: 'medical jobs, healthcare careers, Riyadh jobs, HAC Pharma careers'
        },
        '/contact': {
            title: 'Contact Us | HAC Pharma',
            description: 'Get in touch with HAC Pharma. Contact us for partnership opportunities, inquiries, or support.',
            keywords: 'contact HAC Pharma, medical partnership, healthcare inquiries'
        },
        '/news': {
            title: 'News & Updates | HAC Pharma',
            description: 'Latest news, announcements, and press releases from HAC Pharma.',
            keywords: 'HAC Pharma news, medical news, healthcare updates'
        },
        '/blog': {
            title: 'Blog & Insights | HAC Pharma',
            description: 'Industry insights, regulatory updates, and expert articles on medical distribution.',
            keywords: 'medical blog, SFDA regulations, healthcare insights'
        },
        '/team': {
            title: 'Our Team | HAC Pharma',
            description: 'Meet the leadership team and experts driving innovation at HAC Pharma.',
            keywords: 'HAC Pharma team, medical leaders, healthcare experts'
        },
        '/partners': {
            title: 'Our Partners | HAC Pharma',
            description: 'Strategic partnerships with global medical manufacturers and healthcare institutions.',
            keywords: 'medical partners, healthcare partnerships, drug manufacturers'
        },
        '/faq': {
            title: 'FAQ | HAC Pharma',
            description: 'Frequently asked questions about HAC Pharma services, partnerships, and medical distribution.',
            keywords: 'HAC Pharma FAQ, medical questions, distribution inquiries'
        },
        '/privacy': {
            title: 'Privacy Policy | HAC Pharma',
            description: 'HAC Pharma privacy policy - how we handle and protect your data.',
            keywords: 'privacy policy, data protection, HAC Pharma'
        }
    };

    constructor() {
        this.listenToRouteChanges();
    }

    private listenToRouteChanges(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            const route = event.urlAfterRedirects.split('?')[0];
            const config = this.routeConfigs[route];
            if (config) {
                this.updateTags(config);
            }
        });
    }

    /**
     * Update all SEO meta tags for the current page
     */
    updateTags(config: PageSeoConfig): void {
        const fullUrl = config.url || `${this.baseUrl}${this.router.url}`;
        const fullImage = config.image || `${this.baseUrl}${this.defaultImage}`;

        // Update title
        this.title.setTitle(config.title);

        // Update standard meta tags
        this.meta.updateTag({ name: 'description', content: config.description });
        if (config.keywords) {
            this.meta.updateTag({ name: 'keywords', content: config.keywords });
        }

        // Update Open Graph tags
        this.meta.updateTag({ property: 'og:title', content: config.title });
        this.meta.updateTag({ property: 'og:description', content: config.description });
        this.meta.updateTag({ property: 'og:url', content: fullUrl });
        this.meta.updateTag({ property: 'og:image', content: fullImage });
        this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });

        // Update Twitter tags
        this.meta.updateTag({ name: 'twitter:title', content: config.title });
        this.meta.updateTag({ name: 'twitter:description', content: config.description });
        this.meta.updateTag({ name: 'twitter:url', content: fullUrl });
        this.meta.updateTag({ name: 'twitter:image', content: fullImage });

        // Update canonical URL
        this.updateCanonicalUrl(fullUrl);
    }

    /**
     * Update page title only
     */
    setTitle(title: string): void {
        this.title.setTitle(title);
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ name: 'twitter:title', content: title });
    }

    /**
     * Update page description only  
     */
    setDescription(description: string): void {
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ name: 'twitter:description', content: description });
    }

    /**
     * Set article-specific meta tags for blog/news pages
     */
    setArticleTags(article: {
        title: string;
        description: string;
        image?: string;
        publishedDate: string;
        author?: string;
    }): void {
        this.updateTags({
            title: `${article.title} | HAC Pharma`,
            description: article.description,
            image: article.image,
            type: 'article'
        });

        this.meta.updateTag({ property: 'article:published_time', content: article.publishedDate });
        if (article.author) {
            this.meta.updateTag({ property: 'article:author', content: article.author });
        }
    }

    /**
     * Set product-specific meta tags
     */
    setProductTags(product: {
        name: string;
        description: string;
        image?: string;
        category?: string;
    }): void {
        this.updateTags({
            title: `${product.name} | HAC Pharma Products`,
            description: product.description,
            image: product.image,
            type: 'product'
        });

        if (product.category) {
            this.meta.updateTag({ property: 'product:category', content: product.category });
        }
    }

    private updateCanonicalUrl(url: string): void {
        if (!isPlatformBrowser(this.platformId)) return;

        let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }
}
