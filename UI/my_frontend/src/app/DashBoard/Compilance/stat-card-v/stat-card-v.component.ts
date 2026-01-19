import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card-v',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card-v.component.html',
  styleUrls: ['./stat-card-v.component.css']
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() subtext: string = '';
  @Input() icon: string = '';


  @Input() colorClass: 'green' | 'orange' | 'blue' | 'red' = 'green';

  @Input() showProgress: boolean = false;
  @Input() progressValue: number = 0;


  @Input() textColor: string = '#0f172a';
}