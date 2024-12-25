import { Component, computed } from '@angular/core';
import { NotificationService } from '../../services/notifications/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

  notificationMessage = computed(() => this.notificationService.notification());
  notificationType = computed(() => this.notificationService.type());

  constructor(private notificationService: NotificationService) { }

  closeNotification() {
    this.notificationService.clearNotification();
  }

}
