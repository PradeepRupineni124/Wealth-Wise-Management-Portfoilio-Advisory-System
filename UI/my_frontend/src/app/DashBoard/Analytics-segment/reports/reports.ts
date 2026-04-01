import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AllocationService, Report } from '../../../services/allocation.service';
// ---> 1. IMPORT YOUR PDF SERVICE <---
import { PdfExport } from '../../../services/pdf-export';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  
  private allocationService = inject(AllocationService);
  
  // ---> 2. INJECT THE PDF SERVICE <---
  private pdfService = inject(PdfExport);

  reports: Report[] = [];

  ngOnInit() {
    this.allocationService.getReports().subscribe(data => {
      this.reports = data;
    });
  }

  // ---> 3. REPLACE THE CSV LOGIC WITH ONE LINE <---
  downloadReport(report: Report) {
    console.log(`Downloading ${report.title} as PDF...`);
    
    // This tells your PdfExportService to generate the document
    this.pdfService.downloadReport(report.type);
  }
}