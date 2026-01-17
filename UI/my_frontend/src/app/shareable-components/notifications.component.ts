import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../models/overview.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-card p-4 shadow-1 border-round-xl h-full">
        <h3 class="text-900 font-bold mt-0 mb-4">Alerts & Notifications</h3>
        
        <div class="flex flex-column gap-3">
            <div *ngFor="let item of notifications" [class]="'p-3 border-round-xl border-1 flex gap-3 ' + getStyles(item.type)">
                <div class="mt-1"><i [class]="getIcon(item.type)"></i></div>
                <div>
                    <div class="font-bold mb-1">{{ item.title }}</div>
                    <div class="text-700 text-sm line-height-3 mb-2">{{ item.message }}</div>
                    <div class="text-500 text-xs">{{ item.time }}</div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class NotificationsComponent {
  @Input() notifications: Notification[] = [];

  getStyles(type: string) {
    switch(type) {
        case 'success': return 'bg-green-50 border-green-200 text-green-700';
        case 'info': return 'bg-blue-50 border-blue-200 text-blue-700';
        case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700'; // Ensure yellow matches manual CSS
        default: return '';
    }
  }

  getIcon(type: string) {
      switch(type) {
          case 'success': return 'pi pi-check-circle text-xl';
          case 'info': return 'pi pi-info-circle text-xl';
          case 'warning': return 'pi pi-exclamation-circle text-xl';
          default: return 'pi pi-bell text-xl';
      }
  }
}