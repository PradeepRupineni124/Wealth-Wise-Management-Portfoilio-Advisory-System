import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ClientState } from '../../client-state';
import { RecommendationCardComponent } from './recommendation-card.component/recommendation-card.component';

@Component({
  selector: 'app-advisory',
  standalone: true,
  imports: [CommonModule, TabsModule, ToastModule, RecommendationCardComponent],
  providers: [MessageService],
  templateUrl: './advisory.component.html',
  styleUrls: ['./advisory.component.css']
})
export class AdvisoryComponent implements OnInit, OnDestroy {
  private clientSub: Subscription = new Subscription();
  recommendations: any[] = [];
  historyList: any[] = [];
  
  // This object holds all the dynamic summary values
  clientSummary = {
    avgPerf: '+0.0%',
    totalGain: '+$0',
    winRate: '0%',
    count: 0,
    textPerf: '+0.0%'
  };

  private allClientData: any = {
    'Pradeep': {
      summary: { avgPerf: '+8.2%', totalGain: '+$28,400', winRate: '92%', count: 18, textPerf: '+8.2%' },
      recs: [{ id: 'p1', title: 'Tech Growth', priority: 'High Priority', prioritySeverity: 'danger', type: 'Growth', status: 'Pending', description: 'Increase NASDAQ exposure.', actionTitle: 'Action', actionValue: 'Buy QQQ', impactValue: '+4.2%', rationale: 'Growth focus.' }],
      history: [{ title: 'S&P 500 Entry', desc: 'Index Fund', val: '+$8,400', percent: '+15%', date: '2025-11-10' }]
    },
    'Venu': {
      summary: { avgPerf: '+5.4%', totalGain: '+$15,200', winRate: '85%', count: 12, textPerf: '+5.4%' },
      recs: [{ id: 'v1', title: 'Dividend Shield', priority: 'Medium Priority', prioritySeverity: 'warning', type: 'Income', status: 'Pending', description: 'Shift to dividends.', actionTitle: 'Action', actionValue: 'Buy SCHD', impactValue: '+$1.2k/yr', rationale: 'Income.' }],
      history: [{ title: 'Bond Ladder', desc: 'Treasury', val: '+$1,100', percent: '+4.5%', date: '2025-09-05' }]
    },
    'Nithin': {
      summary: { avgPerf: '+3.9%', totalGain: '+$9,800', winRate: '78%', count: 8, textPerf: '+3.9%' },
      recs: [{ id: 'n1', title: 'REIT Entry', priority: 'Low Priority', prioritySeverity: 'info', type: 'REITs', status: 'Pending', description: 'Real estate exposure.', actionTitle: 'Action', actionValue: 'Invest VNQ', impactValue: '+1.8%', rationale: 'Diversify.' }],
      history: [{ title: 'Gold Sell', desc: 'Profit booking', val: '+$2,100', percent: '+5%', date: '2025-08-01' }]
    },
    'Harshit': {
      summary: { avgPerf: '+12.1%', totalGain: '+$42,000', winRate: '95%', count: 25, textPerf: '+12.1%' },
      recs: [{ id: 'h1', title: 'Tax Harvesting', priority: 'High Priority', prioritySeverity: 'danger', type: 'Tax', status: 'Pending', description: 'Offset gains.', actionTitle: 'Action', actionValue: 'Sell losses', impactValue: '$4.5k Saved', rationale: 'Tax opt.' }],
      history: [{ title: 'IPO Buy', desc: 'FinTech', val: '+$12k', percent: '+22%', date: '2025-10-20' }]
    },
    'Kiran': {
      summary: { avgPerf: '+6.7%', totalGain: '+$18,900', winRate: '88%', count: 14, textPerf: '+6.7%' },
      recs: [{ id: 'k1', title: 'Emerging Markets', priority: 'Medium Priority', prioritySeverity: 'warning', type: 'Growth', status: 'Pending', description: 'India indices.', actionTitle: 'Action', actionValue: 'Buy INDA', impactValue: '+3.5%', rationale: 'Growth.' }],
      history: [{ title: 'Bond Entry', desc: 'Fixed income', val: '+$1k', percent: '+2%', date: '2025-07-01' }]
    },
    'Ganesh': {
      summary: { avgPerf: '+4.1%', totalGain: '+$11,500', winRate: '82%', count: 10, textPerf: '+4.1%' },
      recs: [],
      history: [{ title: 'Clean Energy', desc: 'ESG Swap', val: '+$4k', percent: '+5%', date: '2025-08-30' }]
    }
  };

  constructor(private messageService: MessageService, private clientState: ClientState) {}

  ngOnInit() {
    // FIX: client is an object { name: string, id: number }
    this.clientSub = this.clientState.currentClient$.subscribe(client => {
      if (client && client.name) {
        this.loadClientData(client.name);
      }
    });
  }

  ngOnDestroy() {
    this.clientSub.unsubscribe();
  }

  loadClientData(name: string) {
    // FIX: Using the string name to access the key in allClientData
    const data = this.allClientData[name] || this.allClientData['Pradeep'];
    this.recommendations = JSON.parse(JSON.stringify(data.recs));
    this.historyList = [...data.history];
    
    // Update the summary object with values specific to the user
    this.clientSummary = data.summary;
  }

  get stats() {
    const pending = this.recommendations.filter(r => r.status === 'Pending').length;
    const accepted = this.recommendations.filter(r => r.status === 'Accepted').length;
    const total = this.recommendations.length + this.historyList.length;

    return [
      { label: 'Pending', value: pending, icon: 'pi pi-clock', colorClass: 'text-orange-500', bgClass: 'bg-orange-50' },
      { label: 'Accepted', value: accepted, icon: 'pi pi-check-circle', colorClass: 'text-green-500', bgClass: 'bg-green-50' },
      // Dynamically display avgPerf from clientSummary
      { label: 'Avg. Perf', value: this.clientSummary.avgPerf, icon: 'pi pi-chart-line', colorClass: 'text-blue-500', bgClass: 'bg-blue-50' },
      { label: 'Total', value: total, icon: 'pi pi-lightbulb', colorClass: 'text-purple-500', bgClass: 'bg-purple-50' }
    ];
  }

  acceptRec(id: string) {
    const item = this.recommendations.find(r => r.id === id);
    if (item) {
      item.status = 'Accepted';
      this.messageService.add({ severity: 'success', summary: 'Accepted', detail: 'Applied to portfolio' });
    }
  }

  rejectRec(id: string) {
    this.recommendations = this.recommendations.filter(item => item.id !== id);
    this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'Recommendation removed' });
  }
}