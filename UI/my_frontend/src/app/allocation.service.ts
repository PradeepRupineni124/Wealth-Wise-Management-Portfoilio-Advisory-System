import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// ==========================================
// 1. INTERFACES (Keep these the same)
// ==========================================
export interface Sector { name: string; value: number; color: string; }
export interface Region { name: string; value: string; class: string; }
export interface ChartDataset {
  label: string; data: number[]; fill: boolean; borderColor: string;
  tension: number; pointBackgroundColor: string; pointRadius: number;
  borderDash?: number[]; yAxisID?: string; backgroundColor?: string;
}
export interface PerformanceData { labels: string[]; datasets: ChartDataset[]; }
export interface KeyMetric { title: string; value: string; subtext: string; isPositive: boolean; }
export interface AssetMetric { label: string; value: number; returnRate: number; }
export interface RiskMetric { title: string; portfolioValue: string; benchmarkValue: string; }
export interface RiskAssessment { level: string; score: number; description: string; }
export interface VaRMetric { period: string; confidence: number; value: string; percentage: string; theme: string; }
export interface Report {
  title: string; description: string; date: string; icon: string;
  iconBg: string; iconColor: string; type: 'performance' | 'tax' | 'risk' | 'holdings';
}

@Injectable({
  providedIn: 'root',
})
export class AllocationService {
  
  // Cache to store generated clients so we don't regenerate them (keeps data stable)
  private clientCache = new Map<number, any>();

  // Initial State (Will be populated in constructor)
  private sectorsSubject = new BehaviorSubject<Sector[]>([]);
  private regionsSubject = new BehaviorSubject<Region[]>([]);
  private performanceSubject = new BehaviorSubject<PerformanceData>({ labels: [], datasets: [] });
  private metricsSubject = new BehaviorSubject<KeyMetric[]>([]);
  private assetMetricsSubject = new BehaviorSubject<AssetMetric[]>([]);
  private riskMetricsSubject = new BehaviorSubject<RiskMetric[]>([]);
  private riskAssessmentSubject = new BehaviorSubject<RiskAssessment>({ level: '', score: 0, description: '' });
  private varDataSubject = new BehaviorSubject<VaRMetric[]>([]);
  private reportsSubject = new BehaviorSubject<Report[]>([]);

  constructor() {
    // Initialize with Client 1 immediately
    this.updateClient(1);
  }

  // ==========================================
  // PUBLIC GETTERS
  // ==========================================
  getAllocationData(): Observable<Sector[]> { return this.sectorsSubject.asObservable(); }
  getGeographicData(): Observable<Region[]> { return this.regionsSubject.asObservable(); }
  getPerformanceData(): Observable<PerformanceData> { return this.performanceSubject.asObservable(); }
  getKeyMetrics(): Observable<KeyMetric[]> { return this.metricsSubject.asObservable(); }
  getAssetMetrics(): Observable<AssetMetric[]> { return this.assetMetricsSubject.asObservable(); }
  getRiskMetrics(): Observable<RiskMetric[]> { return this.riskMetricsSubject.asObservable(); }
  getRiskAssessment(): Observable<RiskAssessment> { return this.riskAssessmentSubject.asObservable(); }
  getVaRData(): Observable<VaRMetric[]> { return this.varDataSubject.asObservable(); }
  getReports(): Observable<Report[]> { return this.reportsSubject.asObservable(); }

  // ==========================================
  // MAIN ACTION: UPDATE CLIENT
  // ==========================================
  updateClient(clientId: number) {
    console.log(`Switching to Client ID: ${clientId}`);

    // 1. Check if we already generated data for this client
    if (!this.clientCache.has(clientId)) {
      // 2. If not, generate it fresh!
      const newProfile = this.generateRandomProfile(clientId);
      this.clientCache.set(clientId, newProfile);
    }

    // 3. Retrieve from cache and broadcast
    const data = this.clientCache.get(clientId);

    this.sectorsSubject.next(data.sectors);
    this.regionsSubject.next(data.regions);
    this.performanceSubject.next(data.performance);
    this.metricsSubject.next(data.stats);
    this.assetMetricsSubject.next(data.assetMetrics);
    this.riskMetricsSubject.next(data.riskMetrics);
    this.riskAssessmentSubject.next(data.riskAssessment);
    this.varDataSubject.next(data.varData);
    this.reportsSubject.next(data.reports);
  }

  // --- SHORTCUT FOR ADDING NEW CLIENT ---
  addClient(id: number, name: string) {
    // We just trigger updateClient, the generator handles the rest based on ID
    this.updateClient(id); 
    // Ideally, we'd store the name in the generated profile, but for charts, ID is enough seed
  }

  // ==========================================
  // THE GENERATOR (The Magic Logic)
  // ==========================================
  private generateRandomProfile(id: number): any {
    
    // Determine archetype based on ID (Cycles through 3 types)
    // ID 1, 4, 7 -> Aggressive
    // ID 2, 5, 8 -> Balanced
    // ID 3, 6, 9 -> Conservative
    const typeIndex = id % 3; 
    
    // Add some random noise based on ID so "Aggressive 1" != "Aggressive 4"
    const noise = (id * 7) % 10; // Simple pseudo-random number 0-9

    if (typeIndex === 1) return this.createAggressiveProfile(noise);
    if (typeIndex === 2) return this.createBalancedProfile(noise);
    return this.createConservativeProfile(noise);
  }

  // --- PROFILE ARCHETYPES ---

  private createAggressiveProfile(noise: number) {
    return {
      sectors: [
        { name: 'Technology', value: 40 + noise, color: '#4285F4' },
        { name: 'Consumer', value: 20 - noise, color: '#8B5CF6' },
        { name: 'Financials', value: 15, color: '#F59E0B' },
        { name: 'Healthcare', value: 15, color: '#10B981' },
        { name: 'Others', value: 10, color: '#64748B' }
      ],
      regions: [
        { name: 'North America', value: '80%', class: 'bg-blue' },
        { name: 'Europe', value: '10%', class: 'bg-green' },
        { name: 'Asia', value: '10%', class: 'bg-yellow' },
        { name: 'Emerging', value: '0%', class: 'bg-purple' }
      ],
      performance: this.generatePerformanceData(true, noise),
      stats: [
        { title: 'Total Return (YTD)', value: `+${20 + noise}.4%`, subtext: 'Outperforming', isPositive: true },
        { title: 'Sharpe Ratio', value: '1.95', subtext: 'High Risk/Reward', isPositive: true },
        { title: 'Portfolio Beta', value: '1.25', subtext: 'High Volatility', isPositive: false },
        { title: 'Alpha', value: `+${5 + noise}.2%`, subtext: 'Beating market', isPositive: true }
      ],
      assetMetrics: [
        { label: 'Equities', value: 1500000 + (noise * 10000), returnRate: 18.5 },
        { label: 'Crypto', value: 200000, returnRate: 45.1 },
        { label: 'Cash', value: 100000, returnRate: 1.0 }
      ],
      riskMetrics: [
        { title: 'Volatility', portfolioValue: '18.5%', benchmarkValue: '15.2%' },
        { title: 'Sharpe Ratio', portfolioValue: '1.95', benchmarkValue: '1.40' },
        { title: 'Beta', portfolioValue: '1.25', benchmarkValue: '1.00' },
        { title: 'Max Drawdown', portfolioValue: '-15.5%', benchmarkValue: '-12.3%' }
      ],
      riskAssessment: { level: 'Aggressive', score: 85 + noise, description: 'High growth focus with significant volatility exposure.' },
      varData: [ { period: '1 Day', confidence: 95, value: `-$${50 + noise},000`, percentage: '2.2%', theme: 'red' }, { period: '1 Month', confidence: 95, value: '-$210,000', percentage: '8.5%', theme: 'red' } ],
      reports: this.getStandardReports()
    };
  }

  private createBalancedProfile(noise: number) {
    return {
      sectors: [
        { name: 'Financials', value: 25 + noise, color: '#F59E0B' },
        { name: 'Technology', value: 20 - noise, color: '#4285F4' },
        { name: 'Healthcare', value: 20, color: '#10B981' },
        { name: 'Industrials', value: 15, color: '#06B6D4' },
        { name: 'Others', value: 20, color: '#64748B' }
      ],
      regions: [
        { name: 'North America', value: '60%', class: 'bg-blue' },
        { name: 'Europe', value: '25%', class: 'bg-green' },
        { name: 'Asia', value: '10%', class: 'bg-yellow' },
        { name: 'Emerging', value: '5%', class: 'bg-purple' }
      ],
      performance: this.generatePerformanceData(false, noise),
      stats: [
        { title: 'Total Return (YTD)', value: `+${12 + noise}.5%`, subtext: 'Steady Growth', isPositive: true },
        { title: 'Sharpe Ratio', value: '1.55', subtext: 'Balanced Risk', isPositive: true },
        { title: 'Portfolio Beta', value: '0.98', subtext: 'Market Neutral', isPositive: true },
        { title: 'Alpha', value: '+1.5%', subtext: 'Slight Edge', isPositive: true }
      ],
      assetMetrics: [
        { label: 'Equities', value: 1000000 + (noise * 5000), returnRate: 12.5 },
        { label: 'Bonds', value: 800000, returnRate: 4.5 },
        { label: 'Real Estate', value: 300000, returnRate: 7.2 }
      ],
      riskMetrics: [
        { title: 'Volatility', portfolioValue: '12.5%', benchmarkValue: '15.2%' },
        { title: 'Sharpe Ratio', portfolioValue: '1.55', benchmarkValue: '1.40' },
        { title: 'Beta', portfolioValue: '0.98', benchmarkValue: '1.00' },
        { title: 'Max Drawdown', portfolioValue: '-9.5%', benchmarkValue: '-12.3%' }
      ],
      riskAssessment: { level: 'Balanced', score: 55 + noise, description: 'Diversified across multiple sectors to minimize risk.' },
      varData: [ { period: '1 Day', confidence: 95, value: `-$${25 + noise},000`, percentage: '1.5%', theme: 'yellow' }, { period: '1 Month', confidence: 95, value: '-$95,000', percentage: '5.8%', theme: 'yellow' } ],
      reports: this.getStandardReports()
    };
  }

  private createConservativeProfile(noise: number) {
    return {
      sectors: [
        { name: 'Bonds/Fixed', value: 55 + noise, color: '#64748B' },
        { name: 'Utilities', value: 15, color: '#EF4444' },
        { name: 'Cons. Staples', value: 15 - noise, color: '#8B5CF6' },
        { name: 'Real Estate', value: 10, color: '#F59E0B' },
        { name: 'Others', value: 5, color: '#64748B' }
      ],
      regions: [
        { name: 'North America', value: '90%', class: 'bg-blue' },
        { name: 'Europe', value: '10%', class: 'bg-green' },
        { name: 'Asia', value: '0%', class: 'bg-yellow' },
        { name: 'Emerging', value: '0%', class: 'bg-purple' }
      ],
      performance: this.generatePerformanceData(false, -2), // Low variance
      stats: [
        { title: 'Total Return (YTD)', value: `+${5 + noise}.2%`, subtext: 'Stable Income', isPositive: true },
        { title: 'Sharpe Ratio', value: '2.15', subtext: 'Very Safe', isPositive: true },
        { title: 'Portfolio Beta', value: '0.45', subtext: 'Low Correlation', isPositive: true },
        { title: 'Yield', value: '4.8%', subtext: 'High Dividends', isPositive: true }
      ],
      assetMetrics: [
        { label: 'Treasuries', value: 1500000, returnRate: 4.2 },
        { label: 'Corp Bonds', value: 500000 + (noise * 10000), returnRate: 5.5 },
        { label: 'Blue Chips', value: 200000, returnRate: 6.8 }
      ],
      riskMetrics: [
        { title: 'Volatility', portfolioValue: '5.2%', benchmarkValue: '15.2%' },
        { title: 'Sharpe Ratio', portfolioValue: '2.15', benchmarkValue: '1.40' },
        { title: 'Beta', portfolioValue: '0.45', benchmarkValue: '1.00' },
        { title: 'Max Drawdown', portfolioValue: '-3.2%', benchmarkValue: '-12.3%' }
      ],
      riskAssessment: { level: 'Conservative', score: 20 + noise, description: 'Primary focus on capital preservation and income.' },
      varData: [ { period: '1 Day', confidence: 95, value: `-$${10 + noise},000`, percentage: '0.5%', theme: 'yellow' }, { period: '1 Month', confidence: 95, value: '-$35,000', percentage: '2.0%', theme: 'yellow' } ],
      reports: this.getStandardReports()
    };
  }

  // --- Helper to Generate Wobbly Graphs ---
  private generatePerformanceData(isVolatile: boolean, noise: number) {
    const base = isVolatile ? [5, 4, -2, 6, 4, 5, 4] : [2, 3, 1, 3, 2, 3, 2];
    // Add noise to each point
    const data = base.map(v => v + (Math.random() * 1.5 - 0.75)); 
    
    return {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      datasets: [
        { 
          label: 'Portfolio', 
          data: data, 
          fill: false, 
          borderColor: isVolatile ? '#10b981' : '#4285F4', 
          tension: 0.4, 
          pointBackgroundColor: isVolatile ? '#10b981' : '#4285F4', 
          pointRadius: 4 
        },
        { 
          label: 'Benchmark', 
          data: [1.5, 2.1, -0.8, 2.9, 2.3, 2.6, 1.8], 
          fill: false, 
          borderColor: '#94a3b8', 
          borderDash: [5, 5], 
          tension: 0.4, 
          pointBackgroundColor: '#94a3b8', 
          pointRadius: 3 
        }
      ]
    };
  }

  private getStandardReports() {
    return [
      { title: 'Quarterly Performance', description: 'Analysis for Q4 2025', date: 'Jan 5, 2026', icon: 'pi pi-chart-bar', iconBg: '#eef2ff', iconColor: '#4f46e5', type: 'performance' },
      { title: 'Annual Tax Report', description: 'Detailed tax summary', date: 'Jan 1, 2026', icon: 'pi pi-chart-line', iconBg: '#f0fdf4', iconColor: '#16a34a', type: 'tax' },
      { title: 'Risk Analysis Report', description: 'Stress testing results', date: 'Dec 28, 2025', icon: 'pi pi-shield', iconBg: '#faf5ff', iconColor: '#9333ea', type: 'risk' },
      { title: 'Holdings Summary', description: 'Complete list of all positions.', date: 'Jan 6, 2026', icon: 'pi pi-list', iconBg: '#fffbeb', iconColor: '#d97706', type: 'holdings' }
    ];
  }
}