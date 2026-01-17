import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { Activity } from '../models/overview.model';

@Component({
  selector: 'app-recent-activities',
  standalone: true,
  imports: [CommonModule, TagModule],
  template: `
    <div class="h-full">
        <h3 class="text-900 font-bold mt-0 mb-4">Recent Activities</h3>
        
        <div class="flex flex-column gap-3">
            <div *ngFor="let item of activities" class="surface-card p-3 shadow-1 border-round-xl flex align-items-start">
                
                <div [class]="'w-3rem h-3rem flex align-items-center justify-content-center border-round-lg flex-shrink-0 mr-3 bg-' + item.colorTheme + '-50'">
                    <i [class]="item.icon + ' text-xl text-' + item.colorTheme + '-500'"></i>
                </div>

                <div class="flex flex-column gap-1 flex-grow-1">
                    <div class="text-900 font-bold">
                        {{ item.entityName }} 
                        <span class="text-500 font-normal">({{item.symbol}})</span>
                    </div>
                    
                    <div class="text-700 text-sm" *ngIf="item.amount > 0">
                        {{ item.amount | currency:'USD':'symbol':'1.0-0' }}
                    </div>
                    <div class="text-700 text-sm" *ngIf="item.amount === 0">-</div>

                    <div class="text-500 text-xs">{{ item.date }}</div>
                </div>

                <div class="flex-shrink-0 ml-3">
                    <p-tag [value]="item.status" [severity]="getSeverity(item.status)" [rounded]="true" styleClass="text-xs font-bold"></p-tag>
                </div>

            </div>
        </div>
    </div>
  `
})
export class RecentActivitiesComponent {
  @Input() activities: Activity[] = [];

  getSeverity(status: string): "success" | "info" | "warn" | "danger" | undefined {
    switch (status) {
      case 'completed': return 'success';
      case 'received': return 'info';
      case 'pending': return 'warn';
      default: return 'info';
    }
  }
}