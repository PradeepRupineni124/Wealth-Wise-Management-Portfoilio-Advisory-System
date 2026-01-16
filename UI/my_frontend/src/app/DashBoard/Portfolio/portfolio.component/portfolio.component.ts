import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioCardComponent } from "../portfolio-card.component/portfolio-card.component";
import { AddInvestmentComponent } from '../add-investment.component/add-investment.component';
import { ClientDataService } from '../client-data.service';
import { PortfolioTableComponent } from "../portfolio-table.component/portfolio-table.component";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, PortfolioCardComponent, AddInvestmentComponent, PortfolioTableComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {
  portfolioStats: any[] = [];
  assetClasses: any[] = [];
  portfolioData: any[] = [];
  currentClientId = 1;

  constructor(private clientService: ClientDataService) {}

  ngOnInit() {
    this.clientService.selectedClient$.subscribe(id => {
      this.currentClientId = id;
      const data = this.clientService.getCurrentData(id);
      
      if (data) {
        this.portfolioStats = data.stats;
        this.portfolioData = data.portfolio;
        this.assetClasses = data.assetClasses || []; 
      }
    });
  }

  onInvestmentAdded(newInvestment: any) {
    this.clientService.addInvestment(this.currentClientId, newInvestment);
  }
}