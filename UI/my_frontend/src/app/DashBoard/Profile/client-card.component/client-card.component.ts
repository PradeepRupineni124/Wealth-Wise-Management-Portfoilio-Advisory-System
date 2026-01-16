import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
@Component({
  selector: 'app-client-card',
  imports: [CommonModule],
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.css',
})
export class ClientCardComponent {
  // These receive data from the parent
  @Input() name: string = '';
  @Input() clientId: string = '';
  @Input() riskProfile: string = '';
  @Input() goal: string = '';
  @Input() isVerified: boolean = false;

  // Helper to get initials like "JA"
  getInitials() {
    return this.name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
