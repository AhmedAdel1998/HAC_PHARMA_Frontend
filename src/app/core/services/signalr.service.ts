import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  public connectionState = signal<HubConnectionState>(HubConnectionState.Disconnected);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.createConnection();
    }
  }

  private createConnection() {
    // Use relative URL for SignalR hub - will be proxied to backend
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/hubs/notifications')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.onreconnecting(() => {
      this.connectionState.set(HubConnectionState.Reconnecting);
      console.log('SignalR: Reconnecting...');
    });

    this.hubConnection.onreconnected(() => {
      this.connectionState.set(HubConnectionState.Connected);
      console.log('SignalR: Reconnected');
    });

    this.hubConnection.onclose(() => {
      this.connectionState.set(HubConnectionState.Disconnected);
      console.log('SignalR: Disconnected');
    });
  }

  public async startConnection(): Promise<void> {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.connectionState.set(HubConnectionState.Connected);
      return;
    }

    try {
      await this.hubConnection?.start();
      this.connectionState.set(HubConnectionState.Connected);
      console.log('SignalR: Connection started');
    } catch (err) {
      console.error('SignalR: Error while starting connection: ' + err);
      this.connectionState.set(HubConnectionState.Disconnected);
      setTimeout(() => this.startConnection(), 5000); // Retry after 5s
    }
  }

  public stopConnection(): void {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop();
      this.connectionState.set(HubConnectionState.Disconnected);
    }
  }

  public addListener(methodName: string, callBack: (...args: any[]) => void): void {
    this.hubConnection?.on(methodName, callBack);
  }

  public removeListener(methodName: string, callBack: (...args: any[]) => void): void {
    this.hubConnection?.off(methodName, callBack);
  }
}
