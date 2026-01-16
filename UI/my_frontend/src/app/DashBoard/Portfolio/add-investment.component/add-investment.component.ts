import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog'; 
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-add-investment',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, SelectModule],
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.css']
})
export class AddInvestmentComponent {
  display = false;
  @Output() investmentAdded = new EventEmitter<any>();

  assetTypes = [
    { label: 'Equity', value: 'Equity' },
    { label: 'Bond', value: 'Bond' },
    { label: 'Mutual Fund', value: 'Mutual Fund' }
  ];

  newInvestment: any = { type: '', symbol: '', qty: null, purchasePrice: null, allocation: null };

  showDialog() { this.display = true; }

  onSubmit() {
    const { qty, purchasePrice, symbol, type } = this.newInvestment;
    
    this.investmentAdded.emit({
      symbol: symbol.toUpperCase(),
      name: `${symbol} Holdings`,
      type,
      qty,
      marketValue: (qty || 0) * (purchasePrice || 0),
      return: 0
    });

    this.display = false;
    this.resetForm();
  }

  resetForm() {
    this.newInvestment = { type: '', symbol: '', qty: null, purchasePrice: null, allocation: null };
  }
}