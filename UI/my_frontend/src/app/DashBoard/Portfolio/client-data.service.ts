import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientDataService {
  private allData: any = {
    1: { // Pradeep
      stats: [
        { title: 'Total Portfolio Value', value: '$16,50,835', color: '#0f172a' },
        { title: 'Total Return', value: '-27.17%', color: '#10b981' },
        { title: 'Today Positions', value: '8', color: '#0f172a' },
        { title: 'Asset Classes', value: '3', color: '#0f172a' }
      ],
      assetClasses: [
        { title: 'Equities', value: '$1,146,551', badge: '45%', badgeColor: '#eefdf3', trend: '+15.2% YTD', trendColor: '#10b981' },
        { title: 'Bonds', value: '$764,368', badge: '30%', badgeColor: '#eff6ff', trend: '+1.4% YTD', trendColor: '#3b82f6' },
        { title: 'Mutual Funds', value: '$636,973', badge: '25%', badgeColor: '#fffbeb', trend: '+8.5% YTD', trendColor: '#f59e0b' }
      ],
      portfolio: [
        { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity', qty: 500, marketValue: 89250, return: 18.8 },
        { symbol: 'MSFT', name: 'Microsoft Corp', type: 'Equity', qty: 350, marketValue: 117320, return: 19.5 },
        { symbol: 'US10Y', name: 'US Treasury 10Y', type: 'Bond', qty: 5000, marketValue: 498750, return: 1.3 },
        { symbol: 'VFIAX', name: 'Vanguard 500 Index', type: 'Mutual Fund', qty: 1200, marketValue: 494760, return: 6.9 }
      ]
    },
    2: { // Venu
      stats: [
        { title: 'Total Portfolio Value', value: '$954,500', color: '#0f172a' },
        { title: 'Total Return', value: '+12.50%', color: '#10b981' },
        { title: 'Today Positions', value: '5', color: '#0f172a' },
        { title: 'Asset Classes', value: '3', color: '#0f172a' }
      ],
      assetClasses: [
        { title: 'Equities', value: '$452,100', badge: '47%', badgeColor: '#eefdf3', trend: '+18.4% YTD', trendColor: '#10b981' },
        { title: 'Bonds', value: '$312,400', badge: '33%', badgeColor: '#eff6ff', trend: '+2.1% YTD', trendColor: '#3b82f6' },
        { title: 'Mutual Funds', value: '$190,000', badge: '20%', badgeColor: '#fffbeb', trend: '+4.2% YTD', trendColor: '#f59e0b' }
      ],
      portfolio: [
        { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Equity', qty: 150, marketValue: 27810, return: 5.5 },
        { symbol: 'NVDA', name: 'NVIDIA Corp', type: 'Equity', qty: 80, marketValue: 72400, return: 42.3 },
        { symbol: 'BOND-X', name: 'Corporate Bond', type: 'Bond', qty: 1000, marketValue: 102000, return: 2.1 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Equity', qty: 120, marketValue: 18400, return: 12.7 },
        { symbol: 'FXAIX', name: 'Fidelity 500 Index', type: 'Mutual Fund', qty: 500, marketValue: 84000, return: 9.2 }
      ]
    },
    3: { // Nithin
      stats: [
        { title: 'Total Portfolio Value', value: '$1,425,800', color: '#0f172a' },
        { title: 'Total Return', value: '+8.75%', color: '#10b981' },
        { title: 'Today Positions', value: '4', color: '#0f172a' },
        { title: 'Asset Classes', value: '2', color: '#0f172a' }
      ],
      assetClasses: [
        { title: 'Equities', value: '$350,000', badge: '25%', badgeColor: '#eefdf3', trend: '+22.1% YTD', trendColor: '#10b981' },
        { title: 'Bonds', value: '$0', badge: '0%', badgeColor: '#f3f4f6', trend: 'N/A', trendColor: '#9ca3af' },
        { title: 'Mutual Funds', value: '$1,075,800', badge: '75%', badgeColor: '#fffbeb', trend: '+6.8% YTD', trendColor: '#f59e0b' }
      ],
      portfolio: [
        { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity', qty: 200, marketValue: 35000, return: 14.2 },
        { symbol: 'VFIAX', name: 'Vanguard 500 Index', type: 'Mutual Fund', qty: 2500, marketValue: 1030750, return: 6.9 },
        { symbol: 'VTSAX', name: 'Vanguard Total Stock', type: 'Mutual Fund', qty: 800, marketValue: 45050, return: 7.4 },
        { symbol: 'NFLX', name: 'Netflix Inc.', type: 'Equity', qty: 50, marketValue: 28500, return: 11.1 }
      ]
    },
    4: { // Harshit
    stats: [
      { title: 'Total Portfolio Value', value: '$2,105,400', color: '#0f172a' },
      { title: 'Total Return', value: '+32.40%', color: '#10b981' },
      { title: 'Today Positions', value: '6', color: '#0f172a' },
      { title: 'Asset Classes', value: '3', color: '#0f172a' }
    ],
    assetClasses: [
      { title: 'Equities', value: '$1,550,000', badge: '74%', badgeColor: '#eefdf3', trend: '+28.5% YTD', trendColor: '#10b981' },
      { title: 'Bonds', value: '$255,400', badge: '12%', badgeColor: '#eff6ff', trend: '+0.8% YTD', trendColor: '#3b82f6' },
      { title: 'Mutual Funds', value: '$300,000', badge: '14%', badgeColor: '#fffbeb', trend: '+12.1% YTD', trendColor: '#f59e0b' }
    ],
    portfolio: [
      { symbol: 'META', name: 'Meta Platforms', type: 'Equity', qty: 250, marketValue: 125000, return: 45.2 },
      { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'Equity', qty: 400, marketValue: 68000, return: 38.7 },
      { symbol: 'BTC', name: 'Bitcoin Proxy', type: 'Equity', qty: 1000, marketValue: 95000, return: 112.5 },
      { symbol: 'VGT', name: 'Vanguard Info Tech', type: 'Mutual Fund', qty: 300, marketValue: 152000, return: 22.4 },
      { symbol: 'AGG', name: 'Core US Bond ETF', type: 'Bond', qty: 2500, marketValue: 245000, return: 1.1 },
      { symbol: 'COIN', name: 'Coinbase Global', type: 'Equity', qty: 150, marketValue: 32000, return: 15.6 }
    ]
  },
  5: { // Kiran
    stats: [
      { title: 'Total Portfolio Value', value: '$842,200', color: '#0f172a' },
      { title: 'Total Return', value: '+14.20%', color: '#10b981' },
      { title: 'Today Positions', value: '5', color: '#0f172a' },
      { title: 'Asset Classes', value: '2', color: '#0f172a' }
    ],
    assetClasses: [
      { title: 'Equities', value: '$642,200', badge: '76%', badgeColor: '#eefdf3', trend: '+12.4% YTD', trendColor: '#10b981' },
      { title: 'Bonds', value: '$0', badge: '0%', badgeColor: '#f3f4f6', trend: 'N/A', trendColor: '#9ca3af' },
      { title: 'Mutual Funds', value: '$200,000', badge: '24%', badgeColor: '#fffbeb', trend: '+5.2% YTD', trendColor: '#f59e0b' }
    ],
    portfolio: [
      { symbol: 'VOO', name: 'Vanguard S&P 500', type: 'Equity', qty: 400, marketValue: 192000, return: 14.8 },
      { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Equity', qty: 500, marketValue: 80000, return: 4.2 },
      { symbol: 'PG', name: 'Procter & Gamble', type: 'Equity', qty: 300, marketValue: 48000, return: 6.7 },
      { symbol: 'SCHD', name: 'Schwab Dividend Equity', type: 'Equity', qty: 1200, marketValue: 96000, return: 9.1 },
      { symbol: 'SWVXX', name: 'Schwab Money Fund', type: 'Mutual Fund', qty: 200000, marketValue: 200000, return: 5.2 }
    ]
  },
  6: { // Ganesh
    stats: [
      { title: 'Total Portfolio Value', value: '$1,250,000', color: '#0f172a' },
      { title: 'Total Return', value: '+4.50%', color: '#10b981' },
      { title: 'Today Positions', value: '4', color: '#0f172a' },
      { title: 'Asset Classes', value: '2', color: '#0f172a' }
    ],
    assetClasses: [
      { title: 'Equities', value: '$250,000', badge: '20%', badgeColor: '#eefdf3', trend: '+8.2% YTD', trendColor: '#10b981' },
      { title: 'Bonds', value: '$1,000,000', badge: '80%', badgeColor: '#eff6ff', trend: '+3.8% YTD', trendColor: '#3b82f6' },
      { title: 'Mutual Funds', value: '$0', badge: '0%', badgeColor: '#f3f4f6', trend: 'N/A', trendColor: '#9ca3af' }
    ],
    portfolio: [
      { symbol: 'BND', name: 'Total Bond Market', type: 'Bond', qty: 8000, marketValue: 600000, return: 2.4 },
      { symbol: 'TIP', name: 'Inflation Protected', type: 'Bond', qty: 4000, marketValue: 400000, return: 1.2 },
      { symbol: 'KO', name: 'Coca-Cola Co', type: 'Equity', qty: 2000, marketValue: 120000, return: 7.5 },
      { symbol: 'PEP', name: 'PepsiCo Inc', type: 'Equity', qty: 750, marketValue: 130000, return: 5.8 }
    ]
  }
  };

  private selectedClientId = new BehaviorSubject<number>(1); 
  selectedClient$ = this.selectedClientId.asObservable();

  updateClient(id: number) {
    this.selectedClientId.next(id);
  }

  getCurrentData(id: number) {
    return this.allData[id];
  }

  // UPDATED: Logic to add an investment to the central store
  addInvestment(clientId: number, investment: any) {
    if (this.allData[clientId]) {
      this.allData[clientId].portfolio = [...this.allData[clientId].portfolio, investment];
      // Trigger a refresh for anyone listening to the selected client stream
      this.updateClient(clientId);
    }
  }

  private openAddInvestmentSource = new Subject<void>();
  openAddInvestment$ = this.openAddInvestmentSource.asObservable();

  triggerAddInvestment() {
    this.openAddInvestmentSource.next();
  }
}