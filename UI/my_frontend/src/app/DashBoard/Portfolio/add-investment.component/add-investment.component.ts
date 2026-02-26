import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog'; 
import { SelectModule } from 'primeng/select';
import { AutoCompleteModule } from 'primeng/autocomplete'; 
import { PortfolioService } from '../../../portfolio.service';

@Component({
  selector: 'app-add-investment',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, SelectModule, AutoCompleteModule],
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.css']
})
export class AddInvestmentComponent implements OnInit {
  display = false;
  @Output() investmentAdded = new EventEmitter<any>();
  
  // 1. Receives the total value from the dashboard!
  @Input() totalPortfolioValue: number = 0; 

  assetTypes = [
    { label: 'Equity', value: 'Equity' },
    { label: 'Bond', value: 'Bond' },
    { label: 'Mutual Fund', value: 'Mutual Fund' }
  ];

  newInvestment: any = { type: '', symbol: '', qty: null, purchasePrice: null, allocation: null };
  
  masterAssetList: any[] = [];
  filteredAssetSymbols: string[] = []; // 2. Changed to purely store STRINGS!

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioService.getAllAssets().subscribe(data => {
      this.masterAssetList = data;
    });
  }

  showDialog() { this.display = true; }

  searchAssets(event: any) {
    const query = event.query.toLowerCase();
    
    // Filter the full objects based on search
    const filteredObjects = this.masterAssetList.filter(asset => {
      const matchesType = this.newInvestment.type ? asset.assetType === this.newInvestment.type : true;
      const matchesText = asset.symbol.toLowerCase().includes(query) || asset.assetName.toLowerCase().includes(query);
      return matchesType && matchesText;
    });

    // Extract ONLY the symbols (strings). This makes [object Object] impossible!
    this.filteredAssetSymbols = filteredObjects.map(asset => asset.symbol);
  }

  // 1. Changed parameter type from 'string' to 'any' to satisfy the Angular compiler
  onAssetSelected(event: any) {
    // 2. Safely extract the string whether PrimeNG sends an object OR a direct string
    const selectedSymbol = event.value || event; 
    
    this.newInvestment.symbol = selectedSymbol; 
    
    // Manually look up the object to fetch the current price
    const selectedAsset = this.masterAssetList.find(a => a.symbol === selectedSymbol);
    
    if (selectedAsset) {
        this.newInvestment.purchasePrice = selectedAsset.currentPrice;
        this.calculateAllocation(); // Trigger live math!
    }
  }

  // LIVE MATH CALCULATION!
  calculateAllocation() {
    if (this.newInvestment.qty && this.newInvestment.purchasePrice && this.totalPortfolioValue > 0) {
        const totalCost = this.newInvestment.qty * this.newInvestment.purchasePrice;
        const alloc = (totalCost / this.totalPortfolioValue) * 100;
        
        // Truncate to 2 decimal places and assign
        this.newInvestment.allocation = parseFloat(alloc.toFixed(2)); 
    } else {
        this.newInvestment.allocation = null;
    }
  }

  onSubmit() {
    if (!this.newInvestment.symbol) return;

    const payload = {
      type: this.newInvestment.type,
      symbol: this.newInvestment.symbol, 
      qty: this.newInvestment.qty,
      purchasePrice: this.newInvestment.purchasePrice,
      allocation: this.newInvestment.allocation
    };
    
    this.investmentAdded.emit(payload);
    this.display = false;
    this.resetForm();
  }

  resetForm() {
    this.newInvestment = { type: '', symbol: '', qty: null, purchasePrice: null, allocation: null };
  }
}