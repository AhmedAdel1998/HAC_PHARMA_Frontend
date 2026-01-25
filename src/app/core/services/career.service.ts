import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job, JobApplication, PaginatedResponse } from '../models/cms.models';
import { AuthService } from './auth.service';

import { environment } from '../../../environments/environment';

interface JobListResponse {
    items: Job[];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class CareerService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly API_URL = `${environment.apiUrl}/jobs`;

    // Get jobs (public: activeOnly=true, admin: activeOnly=false)
    getJobs(activeOnly: boolean = true): Observable<Job[]> {
        if (isPlatformBrowser(this.platformId)) {
            return this.http.get<JobListResponse>(this.API_URL, {
                params: { activeOnly: activeOnly.toString() }
            }).pipe(
                map(response => response.items || [])
            );
        }
        return of([]);
    }

    // Get single job
    getJob(id: number): Observable<Job> {
        return this.http.get<Job>(`${this.API_URL}/${id}`);
    }

    // Apply for job (public)
    applyForJob(jobId: number, application: FormData): Observable<JobApplication> {
        return this.http.post<JobApplication>(`${this.API_URL}/${jobId}/apply`, application);
    }

    // Admin: Create job
    createJob(job: Partial<Job>): Observable<Job> {
        return this.http.post<Job>(this.API_URL, job, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Update job
    updateJob(id: number, job: Partial<Job>): Observable<Job> {
        return this.http.put<Job>(`${this.API_URL}/${id}`, job, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Delete job
    deleteJob(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Get all applications
    getApplications(status?: string): Observable<PaginatedResponse<JobApplication>> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({ items: [], total: 0, page: 1, limit: 10 });
        }
        const params: any = {};
        if (status) params.status = status;
        return this.http.get<PaginatedResponse<JobApplication>>('/api/applications', {
            params,
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Update application status
    updateApplicationStatus(id: number, status: string): Observable<JobApplication> {
        return this.http.put<JobApplication>(`/api/applications/${id}/status`, { status }, {
            headers: this.auth.getAuthHeaders()
        });
    }
}
