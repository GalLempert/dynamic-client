import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notification"
         class="fixed top-4 right-4 z-50 p-4 rounded shadow text-white transition-opacity duration-300"
         [ngClass]="{
           'bg-green-600': notification.type === 'success',
           'bg-red-600': notification.type === 'error',
           'bg-blue-600': notification.type === 'info'
         }">
      <div class="flex justify-between items-center gap-4">
        <span>{{ notification.message }}</span>
        <button (click)="close()" class="font-bold text-xl ml-4">&times;</button>
      </div>
    </div>
  `
})
export class NotificationComponent implements OnInit {
  notification: Notification | null = null;
  timeout: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(n => {
      this.notification = n;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.close(), 3000);
    });
  }

  close() {
    this.notification = null;
  }
}
