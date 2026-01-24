import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactInquiry } from '../../core/services/contact.service';

@Component({
    selector: 'app-admin-messages',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, NgClass, FormsModule],
    template: `
        <div class="messages-container">
            <div class="page-header">
                <h1>Messages</h1>
                <p>Manage contact inquiries and partner requests</p>
            </div>

            <!-- Filters -->
            <div class="filters">
                <select [(ngModel)]="statusFilter" (change)="loadMessages()">
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Read">Read</option>
                    <option value="Responded">Responded</option>
                    <option value="Archived">Archived</option>
                </select>

                <input type="text" placeholder="Search..." [(ngModel)]="searchQuery" (keyup.enter)="loadMessages()" class="search-input">

                <button class="btn-refresh" (click)="loadMessages()" title="Refresh">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                </button>
            </div>

            @if (loading()) {
                <div class="loading">Loading messages...</div>
            } @else {
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>From</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (msg of messages(); track msg.id) {
                                <tr [class.unread]="msg.status === 'New'">
                                    <td>{{ msg.createdAt | date:'mediumDate' }}</td>
                                    <td>
                                        <div class="sender-info">
                                            <strong>{{ msg.name }}</strong>
                                            <span class="email">{{ msg.email }}</span>
                                            @if (msg.phone) { <span class="phone">{{ msg.phone }}</span> }
                                            @if (msg.company) { <span class="company">{{ msg.company }}</span> }
                                        </div>
                                    </td>
                                    <td>
                                        <span class="subject-badge" [ngClass]="getSubjectClass(msg.subject)">{{ msg.subject || 'No Subject' }}</span>
                                    </td>
                                    <td>
                                        <div class="message-preview" [title]="msg.message">{{ msg.message }}</div>
                                    </td>
                                    <td>
                                        <span class="status-badge" [ngClass]="msg.status.toLowerCase()">
                                            {{ msg.status }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="actions">
                                            <select 
                                                [ngModel]="msg.status" 
                                                (ngModelChange)="updateStatus(msg, $event)"
                                                class="status-select"
                                            >
                                                <option value="New">New</option>
                                                <option value="Read">Read</option>
                                                <option value="Responded">Responded</option>
                                                <option value="Archived">Archived</option>
                                            </select>
                                            <button class="btn-delete" (click)="deleteMessage(msg)" title="Delete">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>

                @if (messages().length === 0) {
                    <div class="empty-state">
                        <div class="icon">📭</div>
                        <h3>No messages found</h3>
                        <p>Your inbox is empty.</p>
                    </div>
                }
            }
        </div>
    `,
    styles: [`
        .messages-container { max-width: 1400px; }
        .page-header { margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; font-weight: 700; color: #1E293B; margin-bottom: 4px; }
        .page-header p { color: #64748B; font-size: 14px; }

        .filters {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
        }

        select, .search-input {
            padding: 10px 16px;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            background: white;
            font-size: 14px;
        }
        
        select { min-width: 160px; }
        .search-input { width: 300px; }

        .btn-refresh {
            padding: 10px;
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            color: #64748B;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-refresh:hover { background: #F8FAFC; color: #0EA5E9; }

        .loading {
            text-align: center;
            padding: 40px;
            color: #64748B;
        }

        .table-container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 16px; text-align: left; border-bottom: 1px solid #E2E8F0; }
        th { background: #F8FAFC; font-size: 13px; font-weight: 600; color: #64748B; text-transform: uppercase; }
        td { font-size: 14px; color: #1E293B; }
        
        tr.unread td { background: #F0F9FF; }

        .sender-info strong { display: block; margin-bottom: 2px; }
        .email, .phone, .company { display: block; font-size: 12px; color: #64748B; }

        .subject-badge {
            padding: 4px 10px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500;
            background: #F1F5F9;
            color: #475569;
        }
        .subject-badge.partnership { background: #DBEAFE; color: #1D4ED8; }
        .subject-badge.products { background: #D1FAE5; color: #059669; }
        .subject-badge.careers { background: #FCE7F3; color: #DB2777; }

        .message-preview {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #64748B;
        }

        .status-badge {
            padding: 4px 10px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500;
            text-transform: capitalize;
        }

        .status-badge.new { background: #FEF3C7; color: #D97706; }
        .status-badge.read { background: #F1F5F9; color: #64748B; }
        .status-badge.responded { background: #D1FAE5; color: #059669; }
        .status-badge.archived { background: #E2E8F0; color: #94A3B8; }

        .status-select {
            padding: 6px 10px;
            font-size: 13px;
            min-width: 120px;
        }
        
        .btn-delete {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            margin-left: 8px;
            opacity: 0.5;
            transition: opacity 0.2s;
        }
        .btn-delete:hover { opacity: 1; }

        .empty-state {
            text-align: center;
            padding: 60px;
        }
        .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
        .empty-state h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .empty-state p { color: #64748B; }
    `]
})
export class AdminMessagesComponent implements OnInit {
    private readonly contactService = inject(ContactService);

    messages = signal<ContactInquiry[]>([]);
    loading = signal(true);
    statusFilter = '';
    searchQuery = '';

    ngOnInit() {
        this.loadMessages();
    }

    loadMessages() {
        this.loading.set(true);
        this.contactService.getMessages(1, 100, this.statusFilter, this.searchQuery).subscribe({
            next: (response) => {
                this.messages.set(response.items);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Failed to load messages', err);
                this.messages.set([]);
                this.loading.set(false);
            }
        });
    }

    updateStatus(msg: ContactInquiry, newStatus: string) {
        if (!msg.id) return;

        // Optimistic update
        const oldStatus = msg.status;
        this.messages.update(items => items.map(item =>
            item.id === msg.id ? { ...item, status: newStatus } : item
        ));

        this.contactService.updateStatus(msg.id, newStatus).subscribe({
            error: (err) => {
                console.error('Failed to update status', err);
                // Revert
                this.messages.update(items => items.map(item =>
                    item.id === msg.id ? { ...item, status: oldStatus } : item
                ));
            }
        });
    }

    deleteMessage(msg: ContactInquiry) {
        if (!confirm('Are you sure you want to delete this message?')) return;

        this.contactService.deleteMessage(msg.id).subscribe({
            next: () => {
                this.messages.update(items => items.filter(item => item.id !== msg.id));
            },
            error: (err) => console.error('Delete failed', err)
        });
    }

    getSubjectClass(subject: string | undefined): string {
        if (!subject) return '';
        const lower = subject.toLowerCase();
        if (lower.includes('partner')) return 'partnership';
        if (lower.includes('product')) return 'products';
        if (lower.includes('career')) return 'careers';
        return '';
    }
}
