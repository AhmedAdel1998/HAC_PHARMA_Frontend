import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatWidgetComponent } from './shared/components/chat-widget/chat-widget.component';
import { GlobalSearchComponent } from './shared/components/search/global-search.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CustomCursorComponent } from './shared/components/ui/custom-cursor.component';

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
export class App {
}

