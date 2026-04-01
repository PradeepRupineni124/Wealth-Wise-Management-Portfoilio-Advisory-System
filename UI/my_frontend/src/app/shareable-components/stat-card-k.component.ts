import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatMetric } from '../models/overview.model';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-card p-4 border-round-xl shadow-1 h-full flex flex-column justify-content-between">
      <div class="flex justify-content-between align-items-start mb-3">
        <div [class]="'flex align-items-center justify-content-center border-round-lg w-3rem h-3rem ' + metric.iconBg">
          <i [class]="metric.icon + ' text-xl ' + metric.iconColor"></i>
        </div>
        <span *ngIf="metric.badgeLabel" [class]="'text-xs font-bold px-2 py-1 border-round-md ' + metric.badgeColor">
          {{ metric.badgeLabel }}
        </span>
      </div>

      <div>
        <div class="text-500 font-medium mb-2">{{ metric.title }}</div>
        <div class="text-900 font-bold text-3xl mb-3">{{ metric.value }}</div>
        
        <div class="flex align-items-center text-sm">
            <div *ngIf="metric.trendValue" class="flex align-items-center mr-2">
                 <i *ngIf="metric.trend === 'up'" class="pi pi-arrow-up text-xs mr-1 text-green-600"></i>
                 <span [class]="'font-medium ' + (metric.subTextColor || 'text-500')">{{ metric.trendValue }}</span>
            </div>

            <span *ngIf="metric.subValue" [class]="metric.subTextColor || 'text-500'">
                {{ metric.subValue }}
            </span>
        </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() metric!: StatMetric;
}