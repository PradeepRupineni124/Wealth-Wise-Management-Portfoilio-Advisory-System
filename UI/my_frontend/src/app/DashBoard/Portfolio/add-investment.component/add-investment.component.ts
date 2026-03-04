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
  
  @Input() totalPortfolioValue: number = 0; 

  assetTypes = [
    { label: 'Equity', value: 'Equity' },
    { label: 'Bond', value: 'Bond' },
    { label: 'Mutual Fund', value: 'Mutual Fund' }
  ];

  // THE FIX: Added 'assetName' to the state object
  newInvestment: any = { type: '', symbol: '', assetName: '', qty: null, purchasePrice: null, allocation: null };
  
  masterAssetList: any[] = [];
  filteredAssetSymbols: string[] = []; 

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioService.getAllAssets().subscribe(data => {
      this.masterAssetList = data;
    });
  }

  showDialog() { this.display = true; }

  searchAssets(event: any) {
    const query = event.query.toLowerCase();
    
    const filteredObjects = this.masterAssetList.filter(asset => {
      const matchesType = this.newInvestment.type ? asset.assetType === this.newInvestment.type : true;
      const matchesText = asset.symbol.toLowerCase().includes(query) || asset.assetName.toLowerCase().includes(query);
      return matchesType && matchesText;
    });

    this.filteredAssetSymbols = filteredObjects.map(asset => asset.symbol);
  }

  onAssetSelected(event: any) {
    const selectedSymbol = event.value || event; 
    this.newInvestment.symbol = selectedSymbol; 
    
    const selectedAsset = this.masterAssetList.find(a => a.symbol === selectedSymbol);
    
    if (selectedAsset) {
        // THE FIX: Grab the name from the matching object!
        this.newInvestment.assetName = selectedAsset.assetName; 
        this.newInvestment.purchasePrice = selectedAsset.currentPrice;
        this.calculateAllocation(); 
    }
  }

  calculateAllocation() {
    if (this.newInvestment.qty && this.newInvestment.purchasePrice && this.totalPortfolioValue > 0) {
        const totalCost = this.newInvestment.qty * this.newInvestment.purchasePrice;
        const alloc = (totalCost / this.totalPortfolioValue) * 100;
        
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
    // THE FIX: Ensure assetName resets when the modal closes
    this.newInvestment = { type: '', symbol: '', assetName: '', qty: null, purchasePrice: null, allocation: null };
  }
}