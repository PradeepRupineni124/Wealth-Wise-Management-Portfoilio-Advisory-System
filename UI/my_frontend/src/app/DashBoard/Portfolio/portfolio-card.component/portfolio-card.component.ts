import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-card.component.html',
  styleUrls: ['./portfolio-card.component.css']
})
export class PortfolioCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() valueColor = '#0f172a';
  
  // Detailed design inputs
  @Input() badgeText?: string; 
  @Input() badgeBgColor = '#eefdf3';
  @Input() trendText?: string;
  @Input() trendColor = '#10b981';
}