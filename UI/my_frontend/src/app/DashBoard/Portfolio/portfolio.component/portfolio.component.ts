import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PortfolioCardComponent } from "../portfolio-card.component/portfolio-card.component";
import { AddInvestmentComponent } from '../add-investment.component/add-investment.component';
import { PortfolioTableComponent } from "../portfolio-table.component/portfolio-table.component";
import { PortfolioService } from '../../../services/portfolio.service';
import { ClientDataService } from '../client-data.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, PortfolioCardComponent, AddInvestmentComponent, PortfolioTableComponent, ToastModule],
  providers: [MessageService], 
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolioStats: any[] = [];
  assetClasses: any[] = [];
  portfolioData: any[] = [];
  
  currentClientId: number | null = null; 
  currentPortfolioId!: number; 
  
  currentTotalValue: number = 0; 
  currentCashBalance: number = 0; // <--- THE FIX: Added this variable to clear the TS error!
  
  private clientSub!: Subscription;

  @ViewChild('addInvestmentModal') addInvestmentModal!: AddInvestmentComponent;

  constructor(
    private portfolioService: PortfolioService,
    private clientDataService: ClientDataService, 
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.clientSub = this.clientDataService.selectedClient$.subscribe(newId => {
      this.currentClientId = newId;

      if (this.currentClientId) {
          console.log("Dashboard updating for Client ID:", newId);
          this.portfolioData = []; 
          this.portfolioStats = [];
          this.assetClasses = [];
          this.currentTotalValue = 0;
          this.currentCashBalance = 0; // Reset it when switching clients!
          this.loadDashboard();
      }
    });
  }

  ngOnDestroy() {
    if (this.clientSub) {
      this.clientSub.unsubscribe();
    }
  }

  loadDashboard() {
    if (!this.currentClientId) return;

    this.portfolioService.loadOrCreatePortfolio(this.currentClientId).subscribe({
      next: (summary) => {
        this.currentPortfolioId = summary.portfolioId; 
        
        if (summary.stats && summary.stats.length > 0) {
            const valStr = summary.stats[0].value; 
            this.currentTotalValue = parseFloat(valStr.replace(/[^0-9.-]+/g, "")); 
        }

        const cashIndex = summary.stats.findIndex((s: any) => s.title.includes('Cash') || s.title.includes('Available'));
        if (cashIndex !== -1) {
            const cashStr = summary.stats[cashIndex].value;
            // Now this perfectly assigns the value to our new variable!
            this.currentCashBalance = parseFloat(cashStr.replace(/[^0-9.-]+/g, "")); 
            summary.stats.splice(cashIndex, 1); 
        }

        this.portfolioStats = [...summary.stats];
        this.assetClasses = [...(summary.assetClasses || [])];
        
        this.cdr.detectChanges(); 

        if (this.currentPortfolioId) {
            this.loadHoldings();
        }
      },
      error: (err) => console.error("Error loading portfolio", err)
    });
  }

  loadHoldings() {
    if (!this.currentPortfolioId) return;

    this.portfolioService.getHoldings(this.currentPortfolioId).subscribe({
      next: (data) => {
        setTimeout(() => {
          
          let cashAllocation = 0;
          if (this.currentTotalValue > 0) {
              cashAllocation = (this.currentCashBalance / this.currentTotalValue) * 100;
          }

          const cashRow = {
              holdingId: -1, 
              symbol: 'CASH',
              name: 'Available Cash',
              type: 'Liquidity Asset', 
              qty: null,
              avgPrice: null,
              currentPrice: null,
              marketValue: this.currentCashBalance,
              returnPct: null,
              allocationPct: cashAllocation
          };

          this.portfolioData = [cashRow, ...data]; 
          
          this.cdr.detectChanges(); 
        }, 0);
      },
      error: (err) => console.error("Error loading holdings", err)
    });
  }

  onInvestmentAdded(newInvestment: any) {
    this.portfolioService.addInvestment(this.currentPortfolioId, newInvestment).subscribe({
      next: () => {
        this.messageService.add({ 
            severity: 'success', 
            summary: 'Trade Successful', 
            detail: `Successfully added ${newInvestment.symbol} to your portfolio.` 
        });
        
        this.loadDashboard(); 
      },
      error: (err) => {
        this.messageService.add({ 
            severity: 'error', 
            summary: 'Transaction Failed', 
            detail: err.error?.message || "An unknown error occurred." 
        });
      }
    });
  }

  onInlineQuantityUpdate(event: {holdingId: number, newQty: number, oldQty: number}) {
    const payload = {
        quantity: event.newQty
    };

    this.portfolioService.updateHolding(event.holdingId, payload).subscribe({
        next: () => {
            this.messageService.add({ 
                severity: 'success', 
                summary: 'Position Updated', 
                detail: `Successfully updated quantity to ${event.newQty}.` 
            });
            this.loadDashboard(); 
        },
        error: (err) => {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Update Failed', 
                detail: err.error?.message || 'Could not update quantity. Check cash balance.' 
            });
            this.loadDashboard(); 
        }
    });
  }
}