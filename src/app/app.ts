import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatWidgetComponent } from './shared/components/chat-widget/chat-widget.component';
import { GlobalSearchComponent } from './shared/components/search/global-search.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CustomCursorComponent } from './shared/components/ui/custom-cursor.component';
import { UpdateService } from './core/services/update.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatWidgetComponent, GlobalSearchComponent, ToastComponent, CustomCursorComponent],
  template: `
    <app-custom-cursor />
    <router-outlet />
    <app-chat-widget />
    <app-global-search />
    <app-toast />
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly updateService = inject(UpdateService);

  ngOnInit(): void {
    this.updateService.startPolling();
  }
}

