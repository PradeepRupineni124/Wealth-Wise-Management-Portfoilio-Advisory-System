import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { Asset } from '../models/overview.model';

@Component({
  selector: 'app-asset-allocation',
  standalone: true,
  imports: [CommonModule, ProgressBarModule],
  template: `
    <div class="surface-card p-4 shadow-1 border-round-xl h-full flex flex-column">
      <h3 class="m-0 mb-4 text-900 font-bold">Asset Allocation</h3>
      <div class="flex-grow-1 flex flex-column justify-content-center gap-4">
        <div *ngFor="let asset of assets">
          <div class="flex justify-content-between mb-2">
            <span class="text-900 font-medium">{{ asset.name }}</span>
            <span class="text-900 font-bold">{{ asset.percent }}%</span>
          </div>
          <p-progressBar [value]="asset.percent" [showValue]="false" 
                         [style]="{'height': '8px', 'background': '#f1f5f9'}" 
                         [color]="asset.color"></p-progressBar>
          <div class="mt-2 text-500 text-sm">{{ asset.amount | currency:'USD':'symbol':'1.0-0' }}</div>
        </div>
      </div>
      <div class="border-top-1 surface-border mt-4 pt-3 flex justify-content-between align-items-center">
         <span class="text-500 font-medium">Total Allocated</span>
         <span class="text-900 font-bold">100%</span>
      </div>
    </div>
  `
})
export class AssetAllocationComponent {
  @Input() assets: Asset[] = [];
}