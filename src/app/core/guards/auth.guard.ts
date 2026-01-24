import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const platformId = inject(PLATFORM_ID);

    // Allow SSR to render the shell; client will strictly verify auth
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/admin/login']);
};
