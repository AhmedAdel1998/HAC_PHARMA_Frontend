import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface VersionInfo {
  hash: string;
  timestamp: string;
}

/**
 * Polls `/version.json` to detect new deployments.
 * When a new version is found, it forces a full page reload
 * so users always run the latest code without manual refresh.
 *
 * Also clears all browser caches and unregisters service workers
 * to ensure mobile browsers never serve stale content.
 */
@Injectable({ providedIn: 'root' })
export class UpdateService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private currentHash: string | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  /** How often to check for updates (ms). Default: 30 seconds. */
  private readonly POLL_INTERVAL = 30_000;

  /**
   * Call once at app startup (e.g. in APP_INITIALIZER or root component).
   * Does nothing on the server.
   */
  startPolling(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Clean up any rogue service workers on startup
    this.unregisterServiceWorkers();

    // Fetch the initial version immediately
    this.checkForUpdate(true);

    // Then poll periodically
    this.intervalId = setInterval(() => this.checkForUpdate(false), this.POLL_INTERVAL);

    // Listen for page restore from Back-Forward Cache (bfcache)
    window.addEventListener('pageshow', (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('[UpdateService] Page restored from bfcache — checking for update…');
        this.checkForUpdate(false);
      }
    });

    // Also check on visibility change (e.g. user switches back to tab/app)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdate(false);
      }
    });
  }

  private checkForUpdate(isInitial: boolean): void {
    // Cache-bust every request so proxies / CDNs can't serve stale version.json
    const url = `/version.json?_=${Date.now()}`;

    this.http.get<VersionInfo>(url).subscribe({
      next: (version) => {
        if (isInitial) {
          this.currentHash = version.hash;
          return;
        }

        if (this.currentHash && this.currentHash !== version.hash) {
          console.log('[UpdateService] New version detected — hard reloading…');
          this.stopPolling();
          this.hardReload();
        }

        this.currentHash = version.hash;
      },
      error: () => {
        // Silently ignore — the server might be mid-deploy or unreachable.
      },
    });
  }

  /**
   * Force a true hard reload that bypasses all browser caches.
   * Mobile browsers (especially iOS Safari) often ignore `location.reload()`
   * and serve a stale cached page. This approach:
   * 1. Clears the Cache Storage API (used by service workers / PWAs)
   * 2. Unregisters any service workers
   * 3. Navigates to the current URL with a cache-busting query param,
   *    which forces the browser to make a fresh network request.
   */
  private async hardReload(): Promise<void> {
    try {
      // Clear all Cache Storage entries
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log('[UpdateService] Cleared all caches');
      }

      // Unregister all service workers
      await this.unregisterServiceWorkers();
    } catch (e) {
      console.warn('[UpdateService] Cache cleanup failed', e);
    }

    // Navigate with a cache-busting param to ensure a fresh page load.
    // This is more reliable than location.reload() on mobile browsers.
    const url = new URL(window.location.href);
    url.searchParams.set('_v', Date.now().toString());
    window.location.replace(url.toString());
  }

  /**
   * Unregister all service workers to prevent stale caching.
   */
  private async unregisterServiceWorkers(): Promise<void> {
    if (!('serviceWorker' in navigator)) return;
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map((r) =>
          r.unregister().then((ok) => {
            if (ok) console.log('[UpdateService] Unregistered service worker');
          })
        )
      );
    } catch {
      // Ignore errors — service worker API may not be available
    }
  }

  private stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
