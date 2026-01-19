import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AllocationService,Report } from '../../../allocation.service';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  
  private allocationService = inject(AllocationService);
  reports: Report[] = [];

  ngOnInit() {
    this.allocationService.getReports().subscribe(data => {
      this.reports = data;
    });
  }

  downloadReport(report: Report) {
    console.log(`Downloading ${report.title}...`);

    
    let csvContent = '';
    
    switch (report.type) {
      case 'performance':
        csvContent = 'Metric,Value\nTotal Return,+18.2%\nBenchmark,+13.7%\nAlpha,+4.5%';
        break;
      case 'tax':
        csvContent = 'Category,Amount\nRealized Gains,$12,500\nRealized Losses,$3,200\nNet Taxable,$9,300';
        break;
      case 'risk':
        csvContent = 'Metric,Score\nSharpe Ratio,1.82\nBeta,0.92\nVolatility,12.4%';
        break;
      case 'holdings':
        csvContent = 'Ticker,Name,Value,Allocation\nAAPL,Apple Inc,$15000,15%\nMSFT,Microsoft,$12000,12%\nGOOGL,Google,$8000,8%';
        break;
      default:
        csvContent = 'Report,Date\nGeneric Report,' + report.date;
    }

    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', `${report.title.replace(/ /g, '_')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}