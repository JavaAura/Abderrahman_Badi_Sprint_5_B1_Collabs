import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification = signal<string | null>(null);
  type = signal<'error' | 'success' | null>(null);

  constructor() { }

  emitNotification(message: string, type: 'error' | 'success') {
    this.notification.set(message);
    this.type.set(type);
  }

  clearNotification() {
    this.type.set(null);
    setTimeout(() => {
      this.notification.set(null);
    }, 500);
  }
}
