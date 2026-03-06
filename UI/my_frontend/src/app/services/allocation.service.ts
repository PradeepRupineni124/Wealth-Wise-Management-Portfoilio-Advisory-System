import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
 
// --- Domain Interfaces ---
export interface Sector { name: string; value: number; color: string; }
export interface Region { name: string; value: string; class: string; }
export interface ChartDataset { label: string; data: number[]; fill: boolean; borderColor: string; tension: number; pointBackgroundColor: string; pointRadius: number; borderDash?: number[]; yAxisID?: string; backgroundColor?: string; }
export interface PerformanceData { labels: string[]; datasets: ChartDataset[]; }
export interface KeyMetric { title: string; value: string; subtext: string; isPositive: boolean; }
export interface AssetMetric { label: string; value: number; returnRate: number; }
export interface RiskMetric { title: string; portfolioValue: string; benchmarkValue: string; }
export interface RiskAssessment { level: string; score: number; description: string; }
export interface VaRMetric { period: string; confidence: number; value: string; percentage: string; theme: string; }
export interface Report { title: string; description: string; date: string; icon: string; iconBg: string; iconColor: string; type: 'performance' | 'tax' | 'risk' | 'holdings'; }
 
@Injectable({
  providedIn: 'root',
})
export class AllocationService {
  private readonly API_BASE = 'http://ltin656497.cts.com:9090/api/analytics';
 
  private clientTrigger$ = new BehaviorSubject<number | null>(null);
  public activeClient$ = this.clientTrigger$.asObservable();
 
  // --- NEW: Holds the master graph data for slicing ---
  private rawPerformance: any = null;
 
  // --- Reactive State ---
  private sectors$ = new BehaviorSubject<Sector[]>([]);
  private regions$ = new BehaviorSubject<Region[]>([]);
  private performance$ = new BehaviorSubject<PerformanceData>({ labels: [], datasets: [] });
  private metrics$ = new BehaviorSubject<KeyMetric[]>([]);
  private assetMetrics$ = new BehaviorSubject<AssetMetric[]>([]);
  private riskMetrics$ = new BehaviorSubject<RiskMetric[]>([]);
  private riskAssessment$ = new BehaviorSubject<RiskAssessment>({ level: '', score: 0, description: '' });
  private varData$ = new BehaviorSubject<VaRMetric[]>([]);
  private reports$ = new BehaviorSubject<Report[]>(this.getStandardReports());
 
  constructor(private http: HttpClient) {}
 
  getAllocationData(): Observable<Sector[]> { return this.sectors$.asObservable(); }
  getGeographicData(): Observable<Region[]> { return this.regions$.asObservable(); }
  getPerformanceData(): Observable<PerformanceData> { return this.performance$.asObservable(); }
  getKeyMetrics(): Observable<KeyMetric[]> { return this.metrics$.asObservable(); }
  getAssetMetrics(): Observable<AssetMetric[]> { return this.assetMetrics$.asObservable(); }
  getRiskMetrics(): Observable<RiskMetric[]> { return this.riskMetrics$.asObservable(); }
  getRiskAssessment(): Observable<RiskAssessment> { return this.riskAssessment$.asObservable(); }
  getVaRData(): Observable<VaRMetric[]> { return this.varData$.asObservable(); }
  getReports(): Observable<Report[]> { return this.reports$.asObservable(); }
 
  public updateClient(clientId: number): void {
    this.clientTrigger$.next(clientId);
  }
 
  public refreshData(clientId?: number | null): void {
    if (clientId) this.clientTrigger$.next(clientId);
  }
 
  public fetchClientData(clientId: number): Observable<any> {
    const noCacheParams = new HttpParams().set('_t', Date.now().toString());
 
    return forkJoin({
      dashboard: this.http.get<any>(`${this.API_BASE}/dashboard/${clientId}`, { params: noCacheParams }).pipe(
        retry({ count: 3, delay: 800 }),
        catchError(() => of(null))
      ),
      risk: this.http.get<any>(`${this.API_BASE}/risk-analysis/${clientId}`, { params: noCacheParams }).pipe(
        retry({ count: 3, delay: 800 }),
        catchError(() => of(null))
      )
    });
  }
 
  public processData(data: any): void {
    if (data.dashboard) this.mapDashboardResponse(data.dashboard);
    if (data.risk) this.mapRiskResponse(data.risk);
  }
 
  private mapDashboardResponse(data: any): void {
    console.log("Raw Dashboard Data:", data);
 
    // --- SECTOR MAPPING & ROUNDING ---
    const sectorsRaw = data.sectorAllocation || [];
    const mappedSectors = sectorsRaw.map((s: any) => {
      const rawValue = s.percentage ?? s.percent ?? s.allocationPercent ?? s.allocation ?? s.value ?? 0;
      return {
        name: s.name || s.sectorName || 'Unknown',
        value: Number(rawValue.toFixed(2)),
        color: this.getSectorColor(s.name || s.sectorName || 'Unknown')
      };
    });
 
    const totalSum = mappedSectors.reduce((sum: number, sector: any) => sum + sector.value, 0);
 
    if (totalSum < 99.99) {
      const remaining = 100 - totalSum;
      mappedSectors.push({
        name: 'Cash',
        value: Number(remaining.toFixed(2)),
        color: this.getSectorColor('Cash')  
      });
    }
    this.sectors$.next(mappedSectors);
 
    // --- GEO DIVERSIFICATION ---
    const geoRaw = data.geoDiversification || [];
    this.regions$.next(geoRaw.map((g: any) => ({
      name: g.region, value: `${g.percentage || 0}%`, class: g.colorClass || 'bg-blue'
    })));
 
    // --- KEY METRICS ---
    const metricsRaw = data.keyMetrics || [];
    this.metrics$.next(metricsRaw.map((m: any) => ({
      title: m.metricName, value: `${Number(m.value || 0).toFixed(2)}${m.unit || ''}`,
      subtext: m.trend === 'UP' ? 'Outperforming' : 'Underperforming', isPositive: m.trend === 'UP'
    })));
 
    // --- PERFORMANCE GRAPH ---
    this.rawPerformance = data.performanceData || {};
    this.filterPerformance('All'); // Trigger the default view!
 
    // --- ASSET METRICS ---
    const assetMetricsRaw = data.assetMetrics || [];
    this.assetMetrics$.next(assetMetricsRaw.map((a: any) => ({
      label: a.assetClass || a.label, value: a.marketValue || a.value, returnRate: a.returnRate || 0
    })));
  }
 
  private mapRiskResponse(data: any): void {
    if (data.riskAssessment) {
      const riskLevel = data.riskAssessment.level || data.riskAssessment.overallRiskLevel || 'Moderate';
      this.riskAssessment$.next({ level: riskLevel, score: this.getRiskScore(riskLevel), description: data.riskAssessment.description || '' });
    }
 
    const varData = data.valueAtRisk || {};
    const varValues: any[] = Object.values(varData);
    const var1d = varValues.length > 0 ? varValues[0] : {};
    const var1m = varValues.length > 1 ? varValues[1] : {};
 
    const formatVaR = (rawVal: number) => {
      const val = Number(rawVal) || 0;
      if (val > 0) return { value: `-$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, theme: 'red' };
      if (val < 0) return { value: `+$${Math.abs(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, theme: 'green' };
      return { value: `$0`, theme: 'red' };
    };
 
    this.varData$.next([
      { period: '1 Day', confidence: 95, value: formatVaR(var1d.value || var1d.dollarAmount || 0).value, percentage: `${(var1d.percentage || 0).toFixed(2)}%`, theme: formatVaR(var1d.value || 0).theme },
      { period: '1 Month', confidence: 95, value: formatVaR(var1m.value || var1m.dollarAmount || 0).value, percentage: `${(var1m.percentage || 0).toFixed(2)}%`, theme: formatVaR(var1m.value || 0).theme }
    ]);
 
    const rm = data.riskAdjustedMetrics || data.riskMetrics || {};
    this.riskMetrics$.next([
      { title: 'Volatility', portfolioValue: `${(rm.volatility?.yourPortfolio ?? rm.volatility?.portfolioValue ?? 0).toFixed(2)}%`, benchmarkValue: `${(rm.volatility?.benchmark ?? rm.volatility?.benchmarkValue ?? 0).toFixed(2)}%` },
      { title: 'Sharpe Ratio', portfolioValue: (rm.sharpeRatio?.yourPortfolio ?? rm.sharpeRatio?.portfolioValue ?? 0).toFixed(2), benchmarkValue: (rm.sharpeRatio?.benchmark ?? rm.sharpeRatio?.benchmarkValue ?? 0).toFixed(2) },
      { title: 'Beta', portfolioValue: (rm.beta?.yourPortfolio ?? rm.beta?.portfolioValue ?? 0).toFixed(2), benchmarkValue: (rm.beta?.benchmark ?? rm.beta?.benchmarkValue ?? 0).toFixed(2) },
      { title: 'Max Drawdown', portfolioValue: `${(rm.maxDrawdown?.yourPortfolio ?? rm.maxDrawdown?.portfolioValue ?? 0).toFixed(2)}%`, benchmarkValue: `${(rm.maxDrawdown?.benchmark ?? rm.maxDrawdown?.benchmarkValue ?? 0).toFixed(2)}%` }
    ]);
  }
 
  // --- NEW GRAPH FILTER LOGIC ---
  public filterPerformance(range: string): void {
    if (!this.rawPerformance) return;
    const p = this.rawPerformance;
   
    // Decides how many points to keep based on the button clicked
    const sliceMap: any = { '1M': 2, '3M': 3, '6M': 6, '1Y': 12, 'All': p.historicalLabels?.length || 0 };
    const sliceAmt = -(sliceMap[range] || sliceMap['All']);
    const isPos = (p.totalReturnYTD || 0) >= 0;
 
    this.performance$.next({
      labels: p.historicalLabels?.slice(sliceAmt) || [],
      datasets: [
        { label: 'Portfolio', data: p.portfolioReturns?.slice(sliceAmt) || [], fill: false, borderColor: isPos ? '#10b981' : '#ef4444', tension: 0.4, pointBackgroundColor: isPos ? '#10b981' : '#ef4444', pointRadius: 4 },
        { label: 'Benchmark', data: p.benchmarkReturns?.slice(sliceAmt) || [], fill: false, borderColor: '#94a3b8', borderDash: [5, 5], tension: 0.4, pointBackgroundColor: '#94a3b8', pointRadius: 3 }
      ]
    });
  }
 
  private getSectorColor(name: string): string {
    const palette: any = {
      'Technology': '#4285F4',
      'Healthcare': '#b97010ff',
      'Financials': '#F59E0B',
      'Consumer': '#8B5CF6',
      'Cash & Unclassified': '#94a3b8',
      'Cash': '#009A74'
    };
    return palette[name || ''] || '#64748B';
  }
 
  private getRiskScore(level: string): number { return level === 'Aggressive' ? 85 : level === 'Moderately Aggressive' ? 70 : level === 'Moderate' ? 55 : 20; }
 
  private getStandardReports(): Report[] {
    return [
      { title: 'Quarterly Performance', description: 'Analysis for Q4', date: 'Jan 5, 2026', icon: 'pi pi-chart-bar', iconBg: '#eef2ff', iconColor: '#4f46e5', type: 'performance' },
      { title: 'Annual Tax Report', description: 'Detailed tax summary', date: 'Jan 1, 2026', icon: 'pi pi-chart-line', iconBg: '#f0fdf4', iconColor: '#16a34a', type: 'tax' },
      { title: 'Risk Analysis Report', description: 'Stress testing results', date: 'Dec 28, 2025', icon: 'pi pi-shield', iconBg: '#faf5ff', iconColor: '#9333ea', type: 'risk' },
      { title: 'Holdings Summary', description: 'Complete list of all positions.', date: 'Jan 6, 2026', icon: 'pi pi-list', iconBg: '#fffbeb', iconColor: '#d97706', type: 'holdings' }
    ];
  }
}
 