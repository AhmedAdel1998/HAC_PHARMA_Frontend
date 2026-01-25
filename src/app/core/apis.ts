/**
 * API Endpoints Configuration
 * Centralized API endpoints for the HAC Pharma application
 */

import { environment } from '../../environments/environment';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${environment.apiUrl}/auth/login`,
    REGISTER: `${environment.apiUrl}/auth/register`,
    LOGOUT: `${environment.apiUrl}/auth/logout`,
    REFRESH_TOKEN: `${environment.apiUrl}/auth/refresh`,
    FORGOT_PASSWORD: `${environment.apiUrl}/auth/forgot-password`,
    RESET_PASSWORD: `${environment.apiUrl}/auth/reset-password`,
  },
  USER: {
    PROFILE: `${environment.apiUrl}/user/profile`,
    UPDATE_PROFILE: `${environment.apiUrl}/user/profile`,
  },
} as const;
