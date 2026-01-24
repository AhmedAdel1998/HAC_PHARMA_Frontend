import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { DatePipe, NgClass, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/cms.models';

@Component({
    selector: 'app-admin-events',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, NgClass, ReactiveFormsModule, CommonModule],
    template: `
        <div class="events-container">
            <div class="page-header">
                <div class="header-left">
                    <h1>Events &amp; Webinars</h1>
                    <p>Manage upcoming events and webinars</p>
                </div>
                <!-- Header button works because it has static content -->
                <button class="btn-primary" (click)="openEventModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Create Event
                </button>
            </div>

            @if (loading()) {
                <div class="loading">Loading events...</div>
            } @else {
                <div class="events-grid">
                    @for (event of events(); track event.id) {
                        <div class="event-card">
                            <div class="event-date">
                                <span class="month">{{ event.date | date:'MMM' }}</span>
                                <span class="day">{{ event.date | date:'dd' }}</span>
                            </div>
                            <div class="event-info">
                                <span class="badge" [ngClass]="event.type">{{ event.type }}</span>
                                <h3>{{ event.title }}</h3>
                                <p class="time">{{ event.date | date:'shortTime' }}</p>
                            </div>
                            <div class="event-actions">
                                <button class="btn-icon" (click)="editEvent(event)" title="Edit">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </button>
                                <button class="btn-icon danger" (click)="deleteEvent(event)" title="Delete">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    }
                </div>
                
                @if (events().length === 0) {
                    <div class="empty-state">No upcoming events found.</div>
                }
            }
        </div>

        <!-- Event Modal -->
        @if (showEventModal()) {
            <div class="modal-backdrop" (click)="closeEventModal()">
                <div class="modal" (click)="$event.stopPropagation()">
                    <div class="modal-header">
                        <h2>{{ editingEvent() ? 'Edit Event' : 'Create Event' }}</h2>
                        <button class="btn-close" (click)="closeEventModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <form [formGroup]="eventForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Event Title (English) *</label>
                                    <input type="text" formControlName="title" placeholder="e.g. Healthcare Innovation Summit" />
                                </div>
                                <div class="form-group">
                                    <label>Event Title (Arabic)</label>
                                    <input type="text" formControlName="titleAr" placeholder="e.g. قمة الابتكار الصحي" dir="rtl" />
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Date &amp; Time *</label>
                                    <input type="datetime-local" formControlName="date" />
                                </div>
                                <div class="form-group">
                                    <label>Event Type *</label>
                                    <select formControlName="type">
                                        <option value="webinar">Webinar</option>
                                        <option value="conference">Conference</option>
                                        <option value="training">Training</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Description *</label>
                                <textarea formControlName="description" rows="4" placeholder="Event description..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Registration URL</label>
                                <input type="url" formControlName="registrationUrl" placeholder="https://..." />
                            </div>
                            <div class="form-group checkbox-group">
                                <label>
                                    <input type="checkbox" formControlName="isActive" />
                                    Active (visible on website)
                                </label>
                            </div>
                            @if (formError()) {
                                <div class="form-error">{{ formError() }}</div>
                            }
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" (click)="closeEventModal()">Cancel</button>
                        <button class="btn-primary save-btn" (click)="saveEvent()" [disabled]="saving()">
                            {{ buttonText() }}
                        </button>
                    </div>
                </div>
            </div>
        }
    `,
    styles: [`
        .events-container { max-width: 1200px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; font-weight: 700; color: #1E293B; margin-bottom: 4px; }
        .page-header p { color: #64748B; font-size: 14px; }

        .btn-primary {
            display: inline-flex; align-items: center; gap: 8px; justify-content: center;
            padding: 10px 20px; background: #0EA5E9; color: white;
            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
            min-width: 100px; font-size: 14px;
        }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .save-btn { 
            display: inline-block !important; 
            color: white !important; 
            font-size: 14px !important; 
            line-height: 1.5 !important;
            min-width: 120px;
        }
        .btn-secondary {
            padding: 10px 20px; background: #F1F5F9; color: #475569;
            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
        }

        .loading, .empty-state { text-align: center; padding: 40px; color: #64748B; }

        .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        
        .event-card {
            background: white; border-radius: 12px; padding: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; gap: 16px;
        }
        
        .event-date {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: #F8FAFC; border-radius: 10px; padding: 10px; width: 60px; height: 60px;
        }
        .event-date .month { font-size: 12px; font-weight: 600; color: #DC2626; text-transform: uppercase; }
        .event-date .day { font-size: 20px; font-weight: 700; color: #1E293B; }

        .event-info { flex: 1; }
        .event-info h3 { font-size: 16px; font-weight: 600; color: #1E293B; margin: 4px 0; }
        .event-info .time { font-size: 13px; color: #64748B; }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .badge.webinar { background: #E0E7FF; color: #4338CA; }
        .badge.conference { background: #FAE8FF; color: #86198F; }
        .badge.training { background: #DCFCE7; color: #16A34A; }

        .event-actions { display: flex; flex-direction: column; gap: 4px; }
        .btn-icon { padding: 6px; border: none; background: #F1F5F9; border-radius: 6px; cursor: pointer; color: #64748B; }
        .btn-icon:hover { background: #E2E8F0; color: #0EA5E9; }
        .btn-icon.danger:hover { background: #FEE2E2; color: #DC2626; }

        /* Modal Styles */
        .modal-backdrop {
            position: fixed; inset: 0; background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000;
        }
        .modal {
            background: white; border-radius: 16px; width: 100%; max-width: 550px;
            max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        }
        .modal-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 24px; border-bottom: 1px solid #E2E8F0;
        }
        .modal-header h2 { font-size: 20px; font-weight: 700; color: #1E293B; margin: 0; }
        .btn-close {
            width: 32px; height: 32px; border: none; background: #F1F5F9;
            border-radius: 8px; font-size: 20px; cursor: pointer; color: #64748B;
        }
        .modal-body { padding: 24px; }
        .modal-footer {
            display: flex; justify-content: flex-end; gap: 12px;
            padding: 20px 24px; border-top: 1px solid #E2E8F0; background: #F8FAFC;
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .form-group input, .form-group select, .form-group textarea {
            width: 100%; padding: 10px 12px; border: 1px solid #D1D5DB;
            border-radius: 8px; font-size: 14px; transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
            outline: none; border-color: #0EA5E9; box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
        }
        .checkbox-group { display: flex; align-items: center; }
        .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 0; }
        .checkbox-group input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
        .form-error { background: #FEE2E2; color: #DC2626; padding: 12px; border-radius: 8px; margin-top: 16px; font-size: 14px; }

        @media (max-width: 640px) {
            .form-row { grid-template-columns: 1fr; }
        }
    `]
})
export class AdminEventsComponent implements OnInit {
    private readonly eventService = inject(EventService);
    private readonly fb = inject(FormBuilder);

    events = signal<Event[]>([]);
    loading = signal(true);

    // Modal state
    showEventModal = signal(false);
    editingEvent = signal<Event | null>(null);
    saving = signal(false);
    formError = signal<string | null>(null);

    // Form Group
    eventForm: FormGroup;

    // Computed
    buttonText = computed(() => {
        if (this.saving()) return 'Saving...';
        return this.editingEvent() ? 'Update Event' : 'Create Event';
    });

    constructor() {
        this.eventForm = this.fb.group({
            title: ['', Validators.required],
            titleAr: [''],
            date: ['', Validators.required],
            type: ['webinar', Validators.required],
            description: ['', Validators.required],
            registrationUrl: [''],
            isActive: [true]
        });
    }

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.eventService.getEvents().subscribe({
            next: (data) => {
                this.events.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load events', err);
                this.events.set([]);
                this.loading.set(false);
            }
        });
    }

    deleteEvent(event: Event) {
        if (confirm(`Delete event "${event.title}"?`)) {
            this.eventService.deleteEvent(event.id).subscribe({
                next: () => this.loadEvents(),
                error: (err) => console.error(err)
            });
        }
    }

    openEventModal(event?: Event) {
        this.formError.set(null);
        if (event) {
            this.editingEvent.set(event);
            const dateObj = new Date(event.date);
            const dateStr = dateObj.toISOString().slice(0, 16);
            this.eventForm.patchValue({
                title: event.title,
                titleAr: event.titleAr || '',
                date: dateStr,
                type: event.type,
                description: event.description,
                registrationUrl: event.registrationUrl || '',
                isActive: event.isActive
            });
        } else {
            this.editingEvent.set(null);
            this.eventForm.reset({
                title: '',
                titleAr: '',
                date: '',
                type: 'webinar',
                description: '',
                registrationUrl: '',
                isActive: true
            });
        }
        this.showEventModal.set(true);
    }

    editEvent(event: Event) {
        this.openEventModal(event);
    }

    closeEventModal() {
        this.showEventModal.set(false);
        this.editingEvent.set(null);
        this.formError.set(null);
    }

    saveEvent() {
        if (this.eventForm.invalid) {
            this.formError.set('Please fill in all required fields');
            return;
        }

        this.saving.set(true);
        this.formError.set(null);

        const formValue = this.eventForm.value;
        const eventData: Partial<Event> = {
            title: formValue.title.trim(),
            titleAr: formValue.titleAr.trim(),
            date: new Date(formValue.date),
            type: formValue.type,
            description: formValue.description.trim(),
            registrationUrl: formValue.registrationUrl.trim(),
            isActive: formValue.isActive
        };

        const editing = this.editingEvent();
        const request = editing
            ? this.eventService.updateEvent(editing.id, eventData)
            : this.eventService.createEvent(eventData);

        request.subscribe({
            next: () => {
                this.saving.set(false);
                this.closeEventModal();
                this.loadEvents();
            },
            error: (err) => {
                this.saving.set(false);
                console.error('Failed to save event', err);
                this.formError.set(err.error?.message || 'Failed to save event. Please try again.');
            }
        });
    }
}

