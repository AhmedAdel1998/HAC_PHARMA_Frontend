import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Event } from '../models/cms.models';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

interface EventListResponse {
    items: Event[];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private readonly http = inject(HttpClient);
    private readonly auth = inject(AuthService);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly API_URL = '/api/events';

    // Get all events (public)
    getEvents(): Observable<Event[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        return this.http.get<EventListResponse>(this.API_URL).pipe(
            map(response => response.items)
        );
    }

    // Get upcoming events only
    getUpcomingEvents(): Observable<Event[]> {
        if (!isPlatformBrowser(this.platformId)) {
            return of([]);
        }
        return this.http.get<EventListResponse>(`${this.API_URL}?upcoming=true`).pipe(
            map(response => response.items)
        );
    }

    // Register for event
    registerForEvent(eventId: number, data: { name: string; email: string }): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/${eventId}/register`, data);
    }

    // Admin: Create event
    createEvent(event: Partial<Event>): Observable<Event> {
        return this.http.post<Event>(this.API_URL, event, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Update event
    updateEvent(id: number, event: Partial<Event>): Observable<Event> {
        return this.http.put<Event>(`${this.API_URL}/${id}`, event, {
            headers: this.auth.getAuthHeaders()
        });
    }

    // Admin: Delete event
    deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`, {
            headers: this.auth.getAuthHeaders()
        });
    }
}
