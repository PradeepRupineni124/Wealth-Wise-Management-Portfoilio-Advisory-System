import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { StatMetric, Asset, Activity, Notification } from '../models/overview.model';

@Injectable({ providedIn: 'root' })
export class OverviewService {

  // 1. STATE MANAGEMENT
  private selectedClientSource = new BehaviorSubject<any>({ name: 'Kiran', id: 1 });
  selectedClient$ = this.selectedClientSource.asObservable();

  changeClient(client: any) {
    this.selectedClientSource.next(client);
  }

  // --- DYNAMIC DATA GENERATORS ---

  getStats(clientId: number): Observable<StatMetric[]> {
    // 1. Generate deterministic random values based on Client ID
    // (We use clientId in the math so the numbers stay same for the same person)
    
    const baseVal = 1000000 + (clientId * 123456) % 2000000; 
    const isUp = clientId % 2 !== 0; 
    
    // Generate dynamic percentages (e.g., 5.4%, 12.8%)
    const portfolioPercent = (3 + (clientId * 13 % 120) / 10).toFixed(1); 
    const returnPercent = (4 + (clientId * 17 % 150) / 10).toFixed(1);
    
    // Calculate the actual dollar amount for the trend based on that percentage
    const trendAmount = (baseVal * (Number(portfolioPercent) / 100));

    return of([
      { 
        title: 'Total Portfolio Value', 
        value: '$' + new Intl.NumberFormat().format(baseVal), 
        subValue: 'this year', 
        subTextColor: isUp ? 'text-green-600' : 'text-red-600', 
        trend: isUp ? 'up' : 'down', 
        
        // FIX: Dynamic Trend Value (Calculated from %)
        trendValue: (isUp ? '+' : '-') + '$' + new Intl.NumberFormat().format(Math.round(trendAmount)), 
        
        icon: 'pi pi-dollar', 
        iconBg: isUp ? 'bg-green-100' : 'bg-red-100', 
        iconColor: isUp ? 'text-green-600' : 'text-red-600', 
        
        // FIX: Dynamic Badge Label (The requested change)
        badgeLabel: (isUp ? '+' : '-') + portfolioPercent + '%', 
        badgeColor: isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600' 
      },
      { 
        title: 'Annual Return', 
        // FIX: Dynamic Return Percentage
        value: (isUp ? '+' : '-') + returnPercent + '%', 
        subValue: isUp ? 'Beating market by 4.5%' : 'Underperforming market', 
        subTextColor: isUp ? 'text-blue-600' : 'text-orange-600', 
        trend: 'neutral', 
        icon: 'pi pi-chart-line', 
        iconBg: 'bg-blue-100', 
        iconColor: 'text-blue-600', 
        badgeLabel: 'YTD', 
        badgeColor: 'bg-blue-100 text-blue-600' 
      },
      { 
        title: 'Risk Score', 
        value: (clientId % 10) + '.5 / 10', 
        subValue: (clientId % 10) > 5 ? 'High Risk' : 'Low Risk', 
        subTextColor: 'text-500', 
        trend: 'neutral', 
        icon: 'pi pi-shield', 
        iconBg: 'bg-orange-100', 
        iconColor: 'text-orange-600', 
        badgeLabel: (clientId % 10) > 5 ? 'High' : 'Safe', 
        badgeColor: (clientId % 10) > 5 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600' 
      },
      { 
        title: 'Active Investments', 
        value: (20 + clientId * 2).toString(), 
        subValue: 'Across asset classes', 
        subTextColor: 'text-500', 
        trend: 'neutral', 
        icon: 'pi pi-briefcase', 
        iconBg: 'bg-purple-100', 
        iconColor: 'text-purple-600', 
        badgeLabel: 'Active', 
        badgeColor: 'bg-purple-100 text-purple-600' 
      }
    ]);
  }

  getAssets(clientId: number): Observable<Asset[]> {
    if (clientId % 3 === 0) {
      return of([
        { name: 'Crypto', percent: 60, amount: 60000, color: '#a855f7' },
        { name: 'Cash', percent: 40, amount: 40000, color: '#3b82f6' }
      ]);
    } else if (clientId % 2 === 0) {
      return of([
        { name: 'Real Estate', percent: 50, amount: 500000, color: '#f59e0b' },
        { name: 'Stocks', percent: 50, amount: 500000, color: '#10b981' }
      ]);
    }
    return of([
      { name: 'Equities', percent: 45, amount: 1146551, color: '#10b981' },
      { name: 'Bonds', percent: 30, amount: 764368, color: '#3b82f6' },
      { name: 'Mutual Funds', percent: 25, amount: 636973, color: '#f59e0b' }
    ]);
  }

  getActivities(clientId: number): Observable<Activity[]> {
    const baseActivities = [
      { id: '1', entityName: 'Apple Inc.', symbol: 'AAPL', amount: 25000, date: '2 hours ago', status: 'completed', icon: 'pi pi-apple', colorTheme: 'green' },
      { id: '2', entityName: 'Tesla Inc.', symbol: 'TSLA', amount: 15000, date: '1 day ago', status: 'completed', icon: 'pi pi-car', colorTheme: 'red' },
      { id: '3', entityName: 'Microsoft Corp', symbol: 'MSFT', amount: 1250, date: '2 days ago', status: 'received', icon: 'pi pi-microsoft', colorTheme: 'blue' },
      { id: '4', entityName: 'Google', symbol: 'GOOGL', amount: 5000, date: '3 days ago', status: 'pending', icon: 'pi pi-google', colorTheme: 'yellow' },
      { id: '5', entityName: 'Amazon', symbol: 'AMZN', amount: 8000, date: '5 days ago', status: 'completed', icon: 'pi pi-amazon', colorTheme: 'blue' }
    ];
    const start = clientId % 2; 
    return of(baseActivities.slice(start, start + 4) as Activity[]);
  }

  getNotifications(clientId: number): Observable<Notification[]> {
    // 1. Define a pool of different notification scenarios
    const scenarios = [
      // Scenario A (Standard)
      [
        { id: '1', title: 'Portfolio Rebalanced', message: 'Automatic rebalancing complete.', time: 'Today at 9:30 AM', type: 'success' },
        { id: '2', title: 'Advisory', message: 'Tech sector exposure is high.', time: 'Yesterday', type: 'info' }
      ],
      // Scenario B (Warning / Compliance)
      [
         { id: '3', title: 'Compliance Action', message: 'KYC documents expiring soon.', time: '2 hours ago', type: 'warning' },
         { id: '4', title: 'Market Alert', message: 'Unexpected volatility in Asian markets.', time: 'Just now', type: 'info' }
      ],
      // Scenario C (Income / Activity)
      [
         { id: '5', title: 'Dividend Received', message: '$1,200 credited to cash account.', time: '1 day ago', type: 'success' },
         { id: '6', title: 'New Statement', message: 'Monthly statement is available.', time: '3 days ago', type: 'info' }
      ]
    ];

    // 2. Select a scenario based on the Client ID
    // (Client 1 -> Scenario A, Client 2 -> Scenario B, Client 3 -> Scenario C, etc.)
    const index = (clientId - 1) % scenarios.length;
    
    // Cast to 'any' or 'Notification[]' to avoid strict type issues with literal strings
    return of(scenarios[index] as Notification[]);
  }

  getChartData(range: string = '6M', clientId: number = 1): Observable<any> {
    const multiplier = 0.5 + ((clientId * 7) % 10) / 10; 

    let labels = [];
    let baseValues = [];

    switch (range) {
      case '1Y':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        baseValues = [1.9, 2.1, 2.0, 2.3, 2.4, 2.6, 2.7, 2.7, 2.8, 2.9, 3.1, 3.2];
        break;
      case 'All':
        labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
        baseValues = [1.2, 1.5, 1.8, 2.1, 2.4, 2.6];
        break;
      case '6M':
      default:
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        baseValues = [1.95, 2.1, 2.05, 2.3, 2.45, 2.6];
        break;
    }

    const values = baseValues.map(v => v * 1000000 * multiplier);
    return of({ labels, values });
  }
}