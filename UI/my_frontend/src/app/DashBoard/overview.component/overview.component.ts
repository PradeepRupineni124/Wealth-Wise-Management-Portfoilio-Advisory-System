import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of, switchMap , catchError} from 'rxjs'; 

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
  currentClientName = 'Client'; // Safe default
  currentClientId = 1;
  
  stats: StatMetric[] = [];
  assets: Asset[] = [];
  activities: Activity[] = [];
  notifications: Notification[] = [];
  chartData: any;

  constructor(
    private overviewService: OverviewService,
    private cdr: ChangeDetectorRef // Injected for rapid UI rendering updates
  ) {}

  ngOnInit() {
    this.overviewService.selectedClient$.pipe(
      switchMap(client => {
        // 1. DEFENSIVE: Safely grab the ID and Name regardless of object structure
        const safeId = client?.clientId || client?.id;
        const safeName = client?.fullName || client?.name || 'Client';

        // 2. DEFENSIVE: If no ID exists, shield the stream from crashing
        if (!safeId) {
          return of(null);
        }

        // 3. Update component state safely
        this.currentClientName = safeName;
        this.currentClientId = safeId;
        this.loading = true;

        // 4. EFFICIENT BFF CALLS: Fetch Main Data + Chart Data in parallel (2 Calls only)
        return forkJoin({
          overview: this.overviewService.getClientOverview(safeId).pipe(
              catchError(err => {
                  console.error('Failed to load overview data', err);
                  return of(null); // Return empty data safely
              })
          ),
          chart: this.overviewService.getChartData('6M', safeId).pipe(
              catchError(err => {
                  console.error('Failed to load chart data', err);
                  return of(null); // Return empty data safely
              })
          )
        });
      })
    ).subscribe({
      next: (data) => {
        // DEFENSIVE: Ensure data isn't null (from our shield above) before processing
        if (data) {
          const { overview, chart } = data;

          // 1. Map Java DTO to Frontend 'StatMetric'
          this.stats = this.overviewService.mapStats(overview);
          
          // 2. Map Java DTO to Frontend 'Asset'
          this.assets = this.overviewService.mapAssets(overview);
          
          // 3. Map Java DTO to Frontend 'Activity' with dynamic icons & defensive checks
          if (overview?.recentActivities) {
             this.activities = overview.recentActivities.map((act: any) => ({
                  id: act.id,
                  entityName: act.title, 
                  symbol: act.symbol,
                  amount: act.amount,
                  value: act.amount,
                  price: act.amount,
                  date: act.date,
                  status: act.status,
                  icon: this.getIconForActivity(act.type, act.title),
                  colorTheme: act.status === 'completed' ? 'green' : 'blue'
             }));
          } else {
             this.activities = []; // Safe fallback
          }

          // 4. Notifications (Defensive fallback to empty array)
          this.notifications = overview?.notifications || [];

          // 5. Chart Data
          this.chartData = chart;
        }
        
        // Turn off loading spinner
        this.loading = false;

        // THE MAGIC BULLET: Force Angular to detect all these changes immediately to prevent NG0100 errors
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Overview Load Error:', err);
        this.loading = false;
        this.cdr.detectChanges(); // Ensure the UI updates even on error
      }
    });
  }

  onRangeChange(range: string) {
    // DEFENSIVE: Ensure we have a valid ID before making a call
    if (!this.currentClientId) return; 

    // Refresh only the chart when user toggles 1Y, 6M, etc.
    this.overviewService.getChartData(range, this.currentClientId).subscribe(data => {
        this.chartData = data;
        this.cdr.detectChanges(); // Ensure the UI immediately reflects the new chart
    });
  }

  // Helper to dynamically assign UI icons based on the backend data type
  private getIconForActivity(type: string, title: string): string {
    if (type === 'buy') return 'pi pi-arrow-down-left'; 
    if (type === 'sell') return 'pi pi-arrow-up-right'; 
    if (type === 'dividend') return 'pi pi-dollar';
    
    // Fallback based on name if type is missing
    if (title && (title.includes('Tesla') || title.includes('Car'))) return 'pi pi-car';
    return 'pi pi-briefcase';
  }
}