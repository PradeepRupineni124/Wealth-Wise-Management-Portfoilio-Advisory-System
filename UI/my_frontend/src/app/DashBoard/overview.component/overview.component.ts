import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { forkJoin, of, switchMap } from 'rxjs'; // <-- Removed delay

import { OverviewService } from '../../services/overview.service';
import { StatMetric, Asset, Activity, Notification } from '../../models/overview.model';

import { StatCardComponent } from '../../shareable-components/stat-card-k.component';
import { PortfolioChartComponent } from '../../shareable-components/portfolio-chart.component';
import { AssetAllocationComponent } from '../../shareable-components/asset-allocation.component';
import { RecentActivitiesComponent } from '../../shareable-components/recent-activities.component';
import { NotificationsComponent } from '../../shareable-components/notifications.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    PortfolioChartComponent,
    AssetAllocationComponent,
    RecentActivitiesComponent,
    NotificationsComponent
  ],
  template: `
    <div class="">
      <div class="mb-4">
         <h1 class="text-900 font-bold m-0 text-2xl">Welcome back, <span class="text-primary">{{ currentClientName }}</span></h1>
         <p class="text-500 mt-1">Here's an overview of your wealth management portfolio</p>
      </div>

      <div *ngIf="loading" class="flex justify-content-center align-items-center" style="height: 20rem;">
        <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
      </div>

      <div *ngIf="!loading">
        <div class="grid mb-4">
          <div class="col-12 md:col-6 lg:col-3" *ngFor="let stat of stats">
            <app-stat-card [metric]="stat"></app-stat-card>
          </div>
        </div>
        <div class="grid mb-4">
          <div class="col-12 lg:col-8">
            <app-portfolio-chart [rawData]="chartData" (rangeChange)="onRangeChange($event)"></app-portfolio-chart>
          </div>
          <div class="col-12 lg:col-4">
            <app-asset-allocation [assets]="assets"></app-asset-allocation>
          </div>
        </div>
        <div class="grid">
          <div class="col-12 lg:col-6">
            <app-recent-activities [activities]="activities"></app-recent-activities>
          </div>
          <div class="col-12 lg:col-6">
            <app-notifications [notifications]="notifications"></app-notifications>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OverviewComponent implements OnInit {
  loading = true;
  currentClientName = 'Client'; // Initialize with a safe default instead of empty string
  currentClientId = 1;
  
  stats: StatMetric[] = [];
  assets: Asset[] = [];
  activities: Activity[] = [];
  notifications: Notification[] = [];
  chartData: any;

  constructor(
    private overviewService: OverviewService,
    private cdr: ChangeDetectorRef // <-- Injected ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.overviewService.selectedClient$.pipe(
      switchMap(client => {
        // 1. Safely grab the ID and Name
        const safeId = client?.clientId || client?.id;
        const safeName = client?.fullName || client?.name || 'Client';

        // 2. Shield: If no ID exists, return null to avoid crashing the stream
        if (!safeId) {
          return of(null);
        }

        // 3. Ensure loading is true while we fetch
        this.loading = true;

        return forkJoin({
          nameInfo: of(safeName),
          idInfo: of(safeId),
          stats: this.overviewService.getStats(safeId),
          assets: this.overviewService.getAssets(safeId),
          activity: this.overviewService.getActivities(safeId),
          notifs: this.overviewService.getNotifications(safeId),
          chart: this.overviewService.getChartData('6M', safeId)
        });
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.currentClientName = data.nameInfo;
          this.currentClientId = data.idInfo;
          this.stats = data.stats;
          this.assets = data.assets;
          this.activities = data.activity;
          this.notifications = data.notifs;
          this.chartData = data.chart;
        }
        
        // 4. Turn off loading spinner
        this.loading = false; 

        // 5. THE MAGIC BULLET: Force Angular to detect all these changes immediately
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Data Error:', err);
        this.loading = false; 
        this.cdr.detectChanges(); // Also detect changes on error
      }
    });
  }

  onRangeChange(range: string) {
    this.overviewService.getChartData(range, this.currentClientId).subscribe(data => {
        this.chartData = data;
        this.cdr.detectChanges(); // Ensure chart updates are caught too
    });
  }
}