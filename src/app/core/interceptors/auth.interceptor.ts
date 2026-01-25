import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    console.log(`[AuthInterceptor] Processing ${req.url.split('/').pop()}`, { hasToken: !!token });

    // Skip attaching token for auth endpoints (login, refresh) and ensures token is valid string
    if (token && token !== 'null' && !req.url.includes(`${environment.apiUrl}/auth/`)) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('[AuthInterceptor] Header attached');
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.warn('[AuthInterceptor] 401 Unauthorized detected. Logging out.');
                authService.logout();
            }
            return throwError(() => error);
        })
    );
};
