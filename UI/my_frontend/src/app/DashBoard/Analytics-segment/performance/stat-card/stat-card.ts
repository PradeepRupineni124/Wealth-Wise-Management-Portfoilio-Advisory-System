import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './stat-card.html',
  styleUrls: ['./stat-card.css']
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() subtext: string = '';
  @Input() isPositive: boolean = false;
}