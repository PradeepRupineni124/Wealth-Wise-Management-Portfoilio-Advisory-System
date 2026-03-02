import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-portfolio-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, ButtonModule, RippleModule],
  template: `
    <div class="p-4 surface-card border-round-xl shadow-1 h-full flex flex-column">
        <div class="flex align-items-center justify-content-between mb-3">
            <div>
                <h3 class="text-900 font-bold m-0">Portfolio Performance</h3>
                <span class="text-500 text-sm">Last {{ selectedRange === 'All' ? '5 years' : selectedRange === '1Y' ? '12 months' : '6 months' }}</span>
            </div>
            
            <div class="flex align-items-center bg-surface-100 p-1 border-round">
                <button 
                    *ngFor="let range of ['6M', '1Y', 'All']"
                    pButton 
                    pRipple
                    type="button" 
                    [label]="range" 
                    (click)="updateRange(range)"
                    class="p-button-rounded p-button-text font-bold h-2rem w-3rem text-sm px-0 transition-all transition-duration-200"
                    [ngClass]="selectedRange === range 
                        ? 'bg-surface-0 text-900 shadow-1' 
                        : 'bg-transparent text-500 hover:text-900 hover:bg-surface-200'">
                </button>
            </div>
        </div>

        <div class="flex-grow-1 relative">
            <p-chart type="line" [data]="data" [options]="options" height="350px"></p-chart>
        </div>
    </div>
  `,
  styles: [`
    
    :host ::ng-deep .p-button.p-button-text:not(:disabled):hover {
        background: transparent; 
    }
    :host ::ng-deep .p-button:focus {
        box-shadow: none !important;
    }
  `]
})
export class PortfolioChartComponent implements OnInit, OnChanges {
  @Input() rawData: any;
  @Output() rangeChange = new EventEmitter<string>();

  selectedRange: string = '6M';
  data: any;
  options: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rawData'] && this.rawData) {
        this.updateChartData();
    }
  }

  ngOnInit() {
    this.initOptions();
  }

  updateRange(range: string) {
    if (this.selectedRange !== range) {
        this.selectedRange = range;
        this.rangeChange.emit(range);
    }
  }

  updateChartData() {
    this.data = {
        labels: this.rawData.labels,
        datasets: [{
          label: 'Portfolio Value',
          data: this.rawData.values,
          fill: true,
          borderColor: '#10b981',
          backgroundColor: (context: any) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 260);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)'); 
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');  
                return gradient;
          },
          tension: 0.4,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#10b981',
          pointBorderWidth: 2,
          pointRadius: 0, 
          pointHoverRadius: 6
        }]
    };
  }

  initOptions() {
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#64748b',
            bodyColor: '#10b981',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            displayColors: false,
            padding: 12,
            callbacks: {
                label: (context: any) => {
                    return 'Value: ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(context.parsed.y);
                }
            }
        }
      },
      scales: {
        x: {
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0', borderDash: [4, 4], drawBorder: false }
        },
        y: {
          beginAtZero: false, 
          ticks: {
            color: '#64748b',
            
            // ---> THE FIX: Dynamic Formatting <---
            callback: (val: any) => {
              if (val >= 1000000) {
                return '$' + (val / 1000000).toFixed(1) + 'M'; // Millions
              } else if (val >= 1000) {
                return '$' + (val / 1000).toFixed(1) + 'K';   // Thousands
              } else if (val === 0) {
                return '$0';
              } else {
                return '$' + val;                             // Hundreds
              }
            },
            // ------------------------------------
            
            maxTicksLimit: 5
          },
          grid: { color: '#e2e8f0', borderDash: [4, 4], drawBorder: false }
        }
      },
      interaction: { mode: 'index', intersect: false }
    };
  }
}