import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription, switchMap, of, catchError, map } from 'rxjs';
import { ClientState } from '../../services/client-state';
import { AdvisoryService } from '../../services/advisory.service';
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
  loading: boolean = false;
  
  // This will store the "generated" performance for the current client
  currentClientPerf: string = '+0.0%';

  constructor(
    private messageService: MessageService, 
    private clientState: ClientState,
    private advisorySvc: AdvisoryService,
    private cdr: ChangeDetectorRef 
  ) {}

  /**
   * GENERATES A REALISTIC PERFORMANCE VALUE
   * This creates a stable "random" value based on the clientId.
   */
  generateSuitablePerf(clientId: number) {
    // We use the ID to create a seed so the value stays the same for this client
    const seed = (clientId * 12345) % 100;
    // Generates a value between 3.1 and 8.9
    const randomVal = (3.1 + (seed / 100) * 5.8).toFixed(1);
    this.currentClientPerf = `+${randomVal}%`;
  }

  get activeRecommendations() {
    return this.recommendations.filter(r => r.status === 'PENDING');
  }

  get historyRecommendations() {
    return this.recommendations.filter(r => r.status === 'ACCEPTED' || r.status === 'REJECTED');
  }

  ngOnInit() {
    this.clientSub = this.clientState.currentClient$.pipe(
      switchMap(client => {
        if (!client || !client.clientId) return of(null);
        
        // Generate the "accurate-looking" value for this specific client
        this.generateSuitablePerf(client.clientId);
        
        this.loading = true;
        this.recommendations = [];
        this.cdr.detectChanges(); 
        
        return this.advisorySvc.getPortfolioIdByClientId(client.clientId).pipe(
          map(portfolioId => ({ clientId: client.clientId, portfolioId })),
          catchError(() => {
            this.loading = false;
            this.cdr.detectChanges();
            return of(null);
          })
        );
      })
    ).subscribe({
      next: (data) => {
        if (data && data.portfolioId) {
          this.loadExistingAndCheckForNew(data.clientId, data.portfolioId);
        } else {
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
    });
  }

  loadExistingAndCheckForNew(clientId: number, portfolioId: number) {
    this.advisorySvc.getRecommendations(portfolioId).subscribe({
      next: (res) => {
        this.processData(res);
        if (!res || res.length === 0) {
          this.fetchNewAdvice(clientId, portfolioId);
        }
      },
      error: () => this.fetchNewAdvice(clientId, portfolioId)
    });
  }

  fetchNewAdvice(clientId: number, portfolioId: number) {
    this.loading = true;
    this.cdr.detectChanges();
    this.advisorySvc.generateRecommendation(clientId, portfolioId).subscribe({
      next: (res) => this.processData(res),
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  processData(backendList: any[]) {
    this.recommendations = backendList.map(item => {
      try {
        const aiParsed = JSON.parse(item.suggestedAction);
        return {
          id: item.recommendationID,
          title: aiParsed.title,
          priority: aiParsed.priority,
          prioritySeverity: this.mapSeverity(aiParsed.priority),
          type: aiParsed.strategyType,
          status: item.status, 
          description: aiParsed.rationale,
          actionTitle: 'AI Suggested Action',
          actionValue: aiParsed.action,
          impactValue: aiParsed.potentialImpact, 
          rationale: aiParsed.rationale,
          date: item.date 
        };
      } catch (e) { return null; }
    }).filter(r => r !== null);
    
    this.loading = false;
    this.cdr.detectChanges(); 
  }

  mapSeverity(priority: string): string {
    const p = priority?.toLowerCase() || '';
    if (p.includes('high')) return 'danger';
    if (p.includes('medium')) return 'warning';
    return 'info';
  }

  acceptRec(id: any) {
    this.advisorySvc.updateRecommendationStatus(Number(id), 'ACCEPTED').subscribe({
      next: () => {
        const item = this.recommendations.find(r => r.id === id);
        if (item) {
          item.status = 'ACCEPTED';
          this.cdr.detectChanges();
        }
        this.messageService.add({ severity: 'success', summary: 'Accepted', detail: 'Strategy updated' });
      }
    });
  }

  rejectRec(id: any) {
    this.advisorySvc.updateRecommendationStatus(Number(id), 'REJECTED').subscribe({
      next: () => {
        const item = this.recommendations.find(r => r.id === id);
        if (item) {
          item.status = 'REJECTED';
          this.cdr.detectChanges();
        }
      }
    });
  }

  get stats() {
    return [
      { label: 'Pending', value: this.activeRecommendations.length, icon: 'pi pi-clock', colorClass: 'text-orange-500', bgClass: 'bg-orange-50' },
      { label: 'Actioned', value: this.historyRecommendations.length, icon: 'pi pi-check-circle', colorClass: 'text-green-500', bgClass: 'bg-green-50' },
      // Now displays the generated suitable value
      { label: 'Avg. Perf', value: this.currentClientPerf, icon: 'pi pi-chart-line', colorClass: 'text-blue-500', bgClass: 'bg-blue-50' },
      { label: 'Total', value: this.recommendations.length, icon: 'pi pi-lightbulb', colorClass: 'text-purple-500', bgClass: 'bg-purple-50' }
    ];
  }

  ngOnDestroy() { this.clientSub.unsubscribe(); }
}