import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface SubmitContactDTO {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    company?: string;
}

export interface ContactInquiry {
    id: number;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    company?: string;
    status: string;
    adminNotes?: string;
    createdAt: string;
    respondedAt?: string;
    respondedBy?: string;
}

export interface ContactListResponse {
    items: ContactInquiry[];
    total: number;
    page: number;
    limit: number;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    private readonly API_URL = '/api/contact';

    // Public: Submit contact form
    submitContact(data: SubmitContactDTO): Observable<ContactInquiry> {
        return this.http.post<ContactInquiry>(this.API_URL, data);
    }

    // Admin: Get all messages
    getMessages(page = 1, limit = 20, status?: string, search?: string): Observable<ContactListResponse> {
        const params: any = { page, limit };
        if (status) params.status = status;
        if (search) params.search = search;

        return this.http.get<ContactListResponse>(this.API_URL, {
            params,
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Get single message
    getMessage(id: number): Observable<ContactInquiry> {
        return this.http.get<ContactInquiry>(`${this.API_URL}/${id}`, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Update status
    updateStatus(id: number, status: string, adminNotes?: string): Observable<ContactInquiry> {
        return this.http.put<ContactInquiry>(`${this.API_URL}/${id}/status`, { status, adminNotes }, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Delete message
    deleteMessage(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`, {
            headers: this.auth.getAuthHeaders()
        });
    }
}
