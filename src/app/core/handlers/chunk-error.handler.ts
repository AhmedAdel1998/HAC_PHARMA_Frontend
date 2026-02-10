import { ErrorHandler, Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Global error handler that catches chunk-load failures
 * (e.g. after a new deployment makes old lazy-route chunks unavailable)
 * and automatically reloads the page to fetch the latest code.
 */
@Injectable()
export class ChunkErrorHandler implements ErrorHandler {
  private readonly platformId = inject(PLATFORM_ID);

  handleError(error: unknown): void {
    const message = (error as Error)?.message ?? String(error);

    // Detect chunk / module load failures
    const isChunkError =
      /loading chunk [\w-]+ failed/i.test(message) ||
      /failed to fetch dynamically imported module/i.test(message) ||
      /importing a module script failed/i.test(message);

    if (isChunkError && isPlatformBrowser(this.platformId)) {
      console.warn('[ChunkErrorHandler] Stale chunk detected — reloading…');

      // Guard against reload loops — only reload once per session
      const key = '__chunk_reload__';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
      } else {
        // Already reloaded once — clear flag and report original error
        sessionStorage.removeItem(key);
        console.error('Chunk load failed even after reload:', error);
      }
    } else {
      // Default behaviour for all other errors
      console.error(error);
    }
  }
}
