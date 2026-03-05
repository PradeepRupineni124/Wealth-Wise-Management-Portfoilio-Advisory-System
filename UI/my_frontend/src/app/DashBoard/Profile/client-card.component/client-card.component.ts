import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.css',
})
export class ClientCardComponent {
  @Input() name: string = '';
  @Input() clientId: string = '';
  @Input() riskProfile: string = '';
  @Input() goal: string = '';
  
  // 🚨 FIX: Changed from boolean to string to support "PENDING"
  @Input() kycStatus: string = 'NOT_VERIFIED'; 

  getInitials() {
    if (!this.name) return '??';
    return this.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  formatText(value: string): string {
    // Safely handle null or undefined values for newly created clients
    if (!value) return 'N/A'; 
    
    // Convert to string and handle raw backend enums (e.g., "WEALTH_ACCUMULATION" -> "Wealth Accumulation")
    return String(value)
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}