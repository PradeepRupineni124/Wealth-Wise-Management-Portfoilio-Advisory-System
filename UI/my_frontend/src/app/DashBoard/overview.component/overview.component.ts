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

import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    PortfolioChartComponent,
    AssetAllocationComponent,
    RecentActivitiesComponent,
    NotificationsComponent,
    ToastModule
  ],
  // providers :[MessageService],
  template: `
  <p-toast position="top-right" [style]="{zIndex: 9999}"></p-toast>
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


  private readonly ASSET_UI_CONFIG: Record<string, { icon: string, colorTheme: string }> = {
    'AAPL': { icon: 'pi pi-chart-line', colorTheme: 'green' }, // Apple
    'TSLA': { icon: 'pi pi-arrow-down-right', colorTheme: 'red' }, // Tesla
    'MSFT': { icon: 'pi pi-dollar', colorTheme: 'blue' }, // Microsoft
    'AMZN': { icon: 'pi pi-shopping-cart', colorTheme: 'orange' }, // Amazon
    'SWPPX': { icon: 'pi pi-globe', colorTheme: 'purple' }, // Schwab
    'HYG': { icon: 'pi pi-building', colorTheme: 'blue' }, // iShares
    'VEMAX': { icon: 'pi pi-compass', colorTheme: 'green' }, // Vanguard
    'US10Y': { icon: 'pi pi-briefcase', colorTheme: 'green' }, // Treasury
    'PORTFOLIO REBALANCING': { icon: 'pi pi-chart-pie', colorTheme: 'orange' } // Special cases without symbols
  };

  constructor(
    private overviewService: OverviewService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService // Injected for rapid UI rendering updates
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

                  this.messageService.add({
                      severity: 'error',
                      summary: 'Service Unavailable',
                      detail: 'Unable to connect to backend services. Showing safe default data.',
                      life: 5000
                  });

                  return of(null); // Return empty data safely
              })
          ),
          chart: this.overviewService.getChartData('6M', safeId).pipe(
              catchError(err => {
                  console.error('Failed to load chart data', err);

                  // this.messageService.add({
                  //     severity: 'warn',
                  //     summary: 'Chart Offline',
                  //     detail: 'Historical chart data is temporarily unavailable.',
                  //     life: 5000
                  // });

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

          if (!overview) {
              setTimeout(() => {
                  this.messageService.add({ severity: 'error', summary: 'Data Missing', detail: 'Failed to load portfolio dashboard.', life: 5000 });
              }, 0);
          } else if (!overview.totalPortfolioValue || overview.totalPortfolioValue === 0) {
              setTimeout(() => {
                  this.messageService.add({ severity: 'error', summary: 'server error', detail: 'Portfolio system is down. Showing defaults.', life: 5000 });
              }, 0);
          }

          // 1. Map Java DTO to Frontend 'StatMetric'
          this.stats = this.overviewService.mapStats(overview);
          
          // 2. Map Java DTO to Frontend 'Asset'
          this.assets = this.overviewService.mapAssets(overview);
          
          // 3. Map Java DTO to Frontend 'Activity' with dynamic icons & defensive checks
          if (overview?.recentActivities) {
             this.activities = overview.recentActivities.map((act: any) => {

              const appearance = this.getDynamicAppearance(act.title, act.symbol);

              return {
                  id: act.id,
                  entityName: act.title, 
                  symbol: act.symbol,
                  amount: act.amount,
                  value: act.amount,
                  price: act.amount,
                  date: act.date,
                  status: act.status,
                  icon: appearance.icon,
                  colorTheme: appearance.colorTheme
              };
             });
          } else {
             this.activities = []; // Safe fallback
          }

          // 4. Notifications (Defensive fallback to empty array)
          this.notifications = overview?.notifications || [];

          // 5. Chart Data
          if (!overview.totalPortfolioValue || overview.totalPortfolioValue === 0 || !chart) {
              this.chartData = { labels: [], values: [] }; 
          } else {
              this.chartData = chart;
          }
        }
        
        // Turn off loading spinner
        this.loading = false;

        // THE MAGIC BULLET: Force Angular to detect all these changes immediately to prevent NG0100 errors
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Overview Load Error:', err);

        this.messageService.add({
            severity: 'error',
            summary: 'System Error',
            detail: 'A critical error occurred while loading the dashboard.'
        });

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

  private getDynamicAppearance(title: string, symbol: string): { icon: string, colorTheme: string } {
  
    const lookupKey = (symbol || title || '').toUpperCase();

    if (this.ASSET_UI_CONFIG[lookupKey]) {
        return this.ASSET_UI_CONFIG[lookupKey];
    }

    const text = (title || '') + ' ' + (symbol || '');
    const colors = ['green', 'blue', 'orange', 'purple', 'red'];
    const icons = ['pi pi-wallet', 'pi pi-briefcase', 'pi pi-arrow-up-right', 'pi pi-check-circle'];
    
    const hash = text.length > 0 ? text.charCodeAt(0) + text.length : 0;

    return {
        icon: icons[hash % icons.length],
        colorTheme: colors[hash % colors.length]
    };
  }
 
}