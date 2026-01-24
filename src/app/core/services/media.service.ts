import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media, PaginatedResponse } from '../models/cms.models';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MediaService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    private readonly API_URL = '/api/media';

    // Get all media
    getMedia(type?: string, page = 1): Observable<PaginatedResponse<Media>> {
        const params: any = { page };
        if (type) params.type = type;
        return this.http.get<PaginatedResponse<Media>>(this.API_URL, { params });
    }

    // Upload file
    upload(file: File): Observable<Media> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<Media>(`${this.API_URL}/upload`, formData, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Delete media
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Get full URL for media files
    getFullUrl(url: string): string {
        if (url.startsWith('http')) {
            return url;
        }
        return `${environment.mediaBaseUrl}${url}`;
    }
}
