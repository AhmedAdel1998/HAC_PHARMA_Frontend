import { Component, OnInit, HostListener, inject, PLATFORM_ID, AfterViewInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { RoadmapPhase, Service, Product, ContactForm } from '../../models/home.model';
import { HeaderComponent } from '../layout/header.component';
import { FooterComponent } from '../layout/footer.component';
import { ContactService } from '../../../core/services/contact.service';

import { VisibilityObserverDirective } from '../../directives/visibility-observer.directive';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink, HeaderComponent, FooterComponent, NgOptimizedImage, VisibilityObserverDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private readonly contactService = inject(ContactService);

  isScrolled = false;
  activeSection = 'hero';
  isMenuOpen = false;

  // Typing Animation
  typingText = '';
  private words: string[] = ['Community', 'Future', 'Access', 'Solutions']; // Default fallback

  // Animation State
  private wordIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typeTimeout: any;

  // Subscriptions
  private langChangeSubscription?: Subscription;
  private scrollListener?: () => void;

  // Data
  roadmapPhases: RoadmapPhase[] = [];
  services: Service[] = [];
  products: Product[] = [];
  stats: any[] = [];

  // Translation Keys
  private translationKeys: string[] = ['roadmap.phases', 'services.list', 'products.list', 'home_stats'];

  // Contact Form
  contactForm: ContactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  ngOnInit(): void {
    this.loadTranslations();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.startTyping();
    }
  }

  private loadTranslations(): void {
    this.translate.get(['hero.typingWords', ...this.translationKeys]).subscribe((res: any) => {
      const typing = res['hero.typingWords'];
      if (typing) {
        this.words = [typing.community, typing.future, typing.access, typing.solutions];
      }

      this.roadmapPhases = Array.isArray(res['roadmap.phases']) ? res['roadmap.phases'] : [];
      console.log('Translation loaded:', res);
      console.log('Roadmap Phases:', this.roadmapPhases);
      this.services = Array.isArray(res['services.list']) ? res['services.list'] : [];
      this.products = Array.isArray(res['products.list']) ? res['products.list'] : [];
      this.stats = Array.isArray(res['home_stats']) ? res['home_stats'] : [];

      // Force change detection to update the view
      this.cdr.markForCheck();

      // Initialize counters and animations after data is loaded
      if (isPlatformBrowser(this.platformId)) {
        this.initCountersAfterRender();
        // this.observeAnimations(); // handled by directive
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.initParticles();

        // Add scroll listener outside Angular zone
        window.addEventListener('scroll', this.onWindowScroll.bind(this), { passive: true });
      });

      // this.observeAnimations(); // handled by directive
    }
  }

  // Helper to initialize counters after Angular renders the DOM
  private initCountersAfterRender(): void {
    // Use setTimeout to wait for Angular to render the ngFor elements
    setTimeout(() => this.initCounters(), 100);
  }

  ngOnDestroy(): void {
    if (this.typeTimeout) clearTimeout(this.typeTimeout);
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
    if (this.counterObserver) {
      this.counterObserver.disconnect();
    }
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
  }

  // Optimized Scroll Handler
  onWindowScroll() {
    const scrollY = window.scrollY;
    const newIsScrolled = scrollY > 50;

    // Only re-enter zone if state changes
    if (this.isScrolled !== newIsScrolled) {
      this.ngZone.run(() => {
        this.isScrolled = newIsScrolled;
        this.cdr.markForCheck();
      });
    }

    // These don't strongly affect UI immediately, keep outside zone mostly but update active section might need UI update
    // Updating progress bar and active section can stay outside zone if we bind blindly, 
    // but activeSection property is used in template so we need to detect changes if it changes.

    this.updateRoadmapProgress();

    const newActiveSection = this.determineActiveSection();
    if (this.activeSection !== newActiveSection) {
      this.ngZone.run(() => {
        this.activeSection = newActiveSection;
        this.cdr.markForCheck();
      });
    }
  }

  private determineActiveSection(): string {
    const sections = ['hero', 'about', 'services', 'roadmap', 'products', 'contact'];
    const scrollPosition = window.scrollY + 150;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        if (scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          return section;
        }
      }
    }
    return this.activeSection;
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Typing Effect
  private startTyping(): void {
    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
          this.typingText = currentWord.substring(0, this.charIndex - 1);
          this.charIndex--;
        } else {
          this.typingText = currentWord.substring(0, this.charIndex + 1);
          this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? 100 : 200;

        if (!this.isDeleting && this.charIndex === currentWord.length) {
          typeSpeed = 2000;
          this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
          this.isDeleting = false;
          this.wordIndex = (this.wordIndex + 1) % this.words.length;
          typeSpeed = 500;
        }

        // Manually update UI
        this.ngZone.run(() => {
          this.cdr.markForCheck();
        });

        this.typeTimeout = setTimeout(loop, typeSpeed);
      };
      loop();
    });
  }

  // Particle System
  private animationFrame: any;
  private initParticles(): void {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: any[] = [];
    const particleCount = 50;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Particle {
      x = Math.random() * width;
      y = Math.random() * height;
      vx = (Math.random() - 0.5) * 0.5;
      vy = (Math.random() - 0.5) * 0.5;
      size = Math.random() * 2 + 1;
      color = Math.random() > 0.5 ? '#0EA5E9' : '#10B981';

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = '#0EA5E9';
            ctx.globalAlpha = 1 - dist / 150;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    // Already running outside angular from ngAfterViewInit
    animate();
  }



  // Counter Animation
  private counterObserver: IntersectionObserver | null = null;
  private animatedCounters = new Set<Element>();

  private initCounters(): void {
    // Disconnect previous observer if exists (for re-initialization on language change)
    if (this.counterObserver) {
      this.counterObserver.disconnect();
    }

    this.counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedCounters.has(entry.target)) {
          const target = entry.target as HTMLElement;
          const value = target.getAttribute('data-value');
          if (value) {
            // Run animation outside Angular zone
            this.ngZone.runOutsideAngular(() => {
              this.animateValue(target, value);
            });
            this.animatedCounters.add(entry.target);
          }
          this.counterObserver?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    // Observe all stat-value elements
    document.querySelectorAll('.stat-value').forEach(el => {
      // Reset counters that haven't been animated yet
      if (!this.animatedCounters.has(el)) {
        this.counterObserver?.observe(el);
      }
    });
  }

  private animateValue(obj: HTMLElement, end: string): void {
    const isPercentage = end.includes('%');
    const isPlus = end.includes('+');
    const endVal = parseInt(end.replace(/[^0-9]/g, ''), 10);
    // If NaN (e.g. text only), just show content
    if (isNaN(endVal)) {
      obj.innerHTML = end;
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * endVal);

      obj.innerHTML = currentVal + (isPercentage ? '%' : '') + (isPlus ? '+' : '');

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  // Visibility Animations - Replaced by Directive
  // observeAnimations(): void { ... }

  // Roadmap Progress
  private updateRoadmapProgress(): void {
    const container = document.querySelector('.roadmap-timeline');
    const progress = document.getElementById('roadmap-progress');
    if (!container || !progress) return;

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const totalHeight = rect.height;
      const visibleHeight = Math.min(totalHeight, windowHeight - rect.top);

      const scrollTop = window.scrollY;
      const offsetTop = (container as HTMLElement).offsetTop;
      const height = (container as HTMLElement).offsetHeight;
      const scrollPercent = ((scrollTop - offsetTop + window.innerHeight / 2) / height) * 100;

      const finalHeight = Math.min(Math.max(scrollPercent, 0), 100);
      progress.style.height = `${finalHeight}%`;
    }
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.isMenuOpen) this.isMenuOpen = false;

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  onSubmit(): void {
    if (this.contactForm.name && this.contactForm.email && this.contactForm.message) {
      const submitDto = {
        name: this.contactForm.name,
        email: this.contactForm.email,
        subject: 'Home Page Inquiry',
        message: this.contactForm.message,
        phone: this.contactForm.phone
      };

      this.contactService.submitContact(submitDto).subscribe({
        next: () => {
          alert('Thank you! Your message has been sent successfully.');
          this.contactForm = { name: '', email: '', phone: '', message: '' };
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Contact submit error', err);
          alert('Failed to send message. Please try again.');
        }
      });
    }
  }
}