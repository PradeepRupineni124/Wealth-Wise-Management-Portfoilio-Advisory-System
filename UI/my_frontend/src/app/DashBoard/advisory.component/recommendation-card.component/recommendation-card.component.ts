import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-recommendation-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule],
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.css']
})
export class RecommendationCardComponent {
  @Input() data: any;
  @Output() onAccept = new EventEmitter<string>();
  @Output() onReject = new EventEmitter<string>();
}