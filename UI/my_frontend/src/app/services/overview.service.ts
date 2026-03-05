import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { StatMetric, Asset } from '../models/overview.model';

@Injectable({ providedIn: 'root' })
export class OverviewService {
  private http = inject(HttpClient);
  
  // Connects to Gateway (9090), which routes to OVERVIEW-SERVICE
  private baseUrl = 'http://ltin656690.cts.com:9090/overview'; 

  private selectedClientSource = new BehaviorSubject<any>({ name: 'Loading...', id: null });
  selectedClient$ = this.selectedClientSource.asObservable();

  changeClient(client: any) {
    this.selectedClientSource.next(client);
  }

  // --- API 1: Get the Aggregated Data ---
  getClientOverview(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/client/${clientId}`);
  }

  // --- API 2: Get Chart Data ---
  getChartData(range: string = '6M', clientId: number = 1): Observable<any> {
    const params = new HttpParams().set('range', range);
    return this.http.get<any>(`${this.baseUrl}/chart/${clientId}`, { params });
  }

  // --- MAPPER: Java DTO -> Angular UI Model ---
  mapStats(dto: any): StatMetric[] {
    if (!dto) return [];
    
    


    const totalVal = dto.totalPortfolioValue || 0;
    const returnPct = dto.annualReturnPercentage || 0;

    const calculatedValueChange = (totalVal * returnPct) / 100;

    const marketBenchmark = 5.0; // Assuming 5% is the market baseline
    const isBeatingMarket = returnPct > marketBenchmark;

    // Calculate the absolute difference, formatted to 1 decimal place
    const diffPct = Math.abs(returnPct - marketBenchmark).toFixed(1);
    
    const risk = Number(dto.riskScore) || 0; 
    const isHighRisk = risk > 5;

    const isUp = isBeatingMarket;

    return [
      {
        title: 'Total Portfolio Value',
        value: '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(totalVal),
        subValue: 'this year',
        subTextColor: isUp ? 'text-green-600' : 'text-red-600',
        trend: isUp ? 'up' : 'down',
        trendValue: (isUp ? '' : '') + '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(calculatedValueChange),
        icon: 'pi pi-dollar',
        iconBg: isUp ? 'bg-green-100' : 'bg-red-100',
        iconColor: isUp ? 'text-green-600' : 'text-red-600',
        badgeLabel: (returnPct > 0 ? '+' : '') + returnPct.toFixed(1) + '%',
        badgeColor: isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      },
      {
        title: 'Annual Return',
        value: (returnPct > 0 ? '+' : '') + returnPct.toFixed(2) + '%',
        subValue: isBeatingMarket ? `Beating market by ${diffPct}%` : `Underperforming by ${diffPct}%`,
        subTextColor: isBeatingMarket ? 'text-blue-600' : 'text-orange-600',
        trend: 'neutral',
        icon: 'pi pi-chart-line',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        badgeLabel: 'YTD',
        badgeColor: 'bg-blue-100 text-blue-600'
      },
      {
        title: 'Risk Score',
        value: dto.riskScore + ' / 10',
        subValue: isHighRisk ? 'High Risk' : 'Low Risk',
        subTextColor: isHighRisk ? 'text-red-500' : 'text-500',
        trend: 'neutral',
        icon: 'pi pi-shield',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        badgeLabel: isHighRisk ? 'High' : 'Safe',
        badgeColor: isHighRisk ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
      },
      {
        title: 'Active Investments',
        value: dto.activeInvestmentsCount?.toString() || '0',
        subValue: 'Across asset classes',
        subTextColor: 'text-500',
        trend: 'neutral',
        icon: 'pi pi-briefcase',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        badgeLabel: 'Active',
        badgeColor: 'bg-purple-100 text-purple-600'
      }
    ];
  }

  // --- MAPPER: Java DTO -> Angular UI Model ---
  mapAssets(dto: any): Asset[] {
    if (!dto || !dto.assetAllocation) return [];
    
    const colors: {[key: string]: string} = { 
      'Equities': '#10b981', 'Crypto': '#a855f7', 
      'Bonds': '#3b82f6', 'Cash': '#64748b', 'Mutual Funds': '#f59e0b', 'Real Estate': '#f97316'
    };

    return dto.assetAllocation.map((a: any) => ({
      name: a.label,
      percent: a.percentage,
      amount: a.value,
      color: colors[a.label] || '#94a3b8' 
    }));
  }
}