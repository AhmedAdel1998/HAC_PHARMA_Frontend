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

    // Fetch the initial version immediately
    this.checkForUpdate(true);

    // Then poll periodically
    this.intervalId = setInterval(() => this.checkForUpdate(false), this.POLL_INTERVAL);
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
          console.log('[UpdateService] New version detected — reloading…');
          this.stopPolling();
          // Reload with cache-bust to guarantee fresh assets
          window.location.reload();
        }

        this.currentHash = version.hash;
      },
      error: () => {
        // Silently ignore — the server might be mid-deploy or unreachable.
      },
    });
  }

  private stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
