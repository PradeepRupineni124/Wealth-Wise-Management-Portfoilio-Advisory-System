import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AllocationService } from './allocation.service';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PdfExport {

  constructor(private allocationService: AllocationService) { }

  public downloadReport(type: 'performance' | 'tax' | 'risk' | 'holdings' | 'comprehensive'): void {
    
    forkJoin({
      metrics: this.allocationService.getKeyMetrics().pipe(take(1)),
      riskMetrics: this.allocationService.getRiskMetrics().pipe(take(1)),
      riskAssessment: this.allocationService.getRiskAssessment().pipe(take(1)),
      varData: this.allocationService.getVaRData().pipe(take(1)),
      sectors: this.allocationService.getAllocationData().pipe(take(1)),
      regions: this.allocationService.getGeographicData().pipe(take(1))
    }).subscribe(data => {
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // ==========================================
      // 1. DRAW CORPORATE HEADER BACKGROUND & TEXT
      // ==========================================
      doc.setFillColor(15, 23, 42); // Deep Navy Blue
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('WealthWise Advisory', 14, 22);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175); // Light gray subtitle
      
      let reportTitle = '';
      if (type === 'performance') reportTitle = 'Quarterly Performance & Yield Report';
      if (type === 'risk') reportTitle = 'Comprehensive Risk & Stress Test Analysis';
      if (type === 'holdings') reportTitle = 'Portfolio Asset & Sector Allocation Summary';
      if (type === 'tax') reportTitle = 'Annual Tax Optimization Overview';
      if (type === 'comprehensive') reportTitle = 'Comprehensive Master Portfolio Snapshot';
      doc.text(reportTitle, 14, 32);

      // ==========================================
      // 2. HELPER FUNCTION TO DRAW TABLES & FOOTER
      // ==========================================
      const drawContentAndSave = () => {
        doc.setTextColor(0, 0, 0);

        if (type === 'performance') {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Executive Summary', 14, 60);
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.text('This document outlines the year-to-date performance metrics of your portfolio compared', 14, 68);
          doc.text('against standard market benchmarks. Returns are calculated net of standard fees.', 14, 74);

          autoTable(doc, {
            startY: 85,
            head: [['Performance Metric', 'Current Value', 'Market Trend']],
            body: data.metrics.map(m => [m.title, m.value, m.subtext]),
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129], fontSize: 12, halign: 'left' },
            styles: { cellPadding: 8, fontSize: 11 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: 14, right: 14 }
          });
        }

        if (type === 'risk') {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`Overall Risk Assessment: ${data.riskAssessment.level}`, 14, 60);
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(71, 85, 105);
          
          const splitDesc = doc.splitTextToSize(`Analyst Note: ${data.riskAssessment.description}`, pageWidth - 28);
          doc.text(splitDesc, 14, 68);

          autoTable(doc, {
            startY: 85,
            head: [['Risk Indicator', 'Your Portfolio', 'Market Benchmark']],
            body: data.riskMetrics.map(r => [r.title, r.portfolioValue, r.benchmarkValue]),
            theme: 'striped',
            headStyles: { fillColor: [139, 92, 246], fontSize: 12 },
            styles: { cellPadding: 8, fontSize: 11 },
            margin: { left: 14, right: 14 }
          });

          const finalY = (doc as any).lastAutoTable.finalY + 20;
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Value at Risk (VaR) - 95% Confidence Interval', 14, finalY);

          autoTable(doc, {
            startY: finalY + 8,
            head: [['Projection Period', 'Expected Maximum Loss', 'Portfolio Impact']],
            body: data.varData.map(v => [v.period, v.value, v.percentage]),
            theme: 'grid',
            headStyles: { fillColor: [239, 68, 68], fontSize: 12 },
            styles: { cellPadding: 8, fontSize: 11, halign: 'center' },
            margin: { left: 14, right: 14 }
          });
        }

        if (type === 'holdings') {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Sector Allocation Breakdown', 14, 60);
          
          autoTable(doc, {
            startY: 68,
            head: [['Sector', 'Target Allocation %', 'Capital Deployed']],
            body: data.sectors.map(s => [s.name, `${s.value}%`, s.color.startsWith('bg') ? 'Distributed' : s.color]), 
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], fontSize: 12 },
            styles: { cellPadding: 8, fontSize: 11 },
            margin: { left: 14, right: 14 }
          });

          const finalY = (doc as any).lastAutoTable.finalY + 20;
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Geographic Diversification', 14, finalY);

          autoTable(doc, {
            startY: finalY + 8,
            head: [['Global Region', 'Exposure %']],
            body: data.regions.map(r => [r.name, r.value]),
            theme: 'striped',
            headStyles: { fillColor: [30, 64, 175], fontSize: 12 },
            styles: { cellPadding: 8, fontSize: 11 },
            margin: { left: 14, right: 14 }
          });
        }

        if (type === 'tax') {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Tax Efficiency & Harvesting Notice', 14, 60);
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.text('This document provides an overview of portfolio tax efficiency. Please note that WealthWise', 14, 68);
          doc.text('does not provide official tax advice. Please consult your CPA for official IRS filings.', 14, 74);
          
          autoTable(doc, {
            startY: 85,
            head: [['Tax Category', 'Current Status', 'Advisory Notes']],
            body: [
              ['Short-Term Capital Gains', 'Pending Review', 'Applicable on holdings < 1 year'],
              ['Long-Term Capital Gains', 'Optimized', 'Tax-loss harvesting strategies applied'],
              ['Dividend Income', 'Reportable', 'See consolidated 1099-DIV summary']
            ],
            theme: 'striped',
            headStyles: { fillColor: [71, 85, 105], fontSize: 12 },
            styles: { cellPadding: 8, fontSize: 11 },
            margin: { left: 14, right: 14 }
          });
        }

        if (type === 'comprehensive') {
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text('Comprehensive Portfolio Snapshot', 14, 60);
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.text('This master report provides a high-level executive summary of your portfolio\'s', 14, 68);
          doc.text('performance, risk metrics, and current asset allocation strategy.', 14, 74);

          // Table 1: Performance
          autoTable(doc, {
            startY: 85,
            head: [['Key Performance Indicators', 'Value', 'Trend']],
            body: data.metrics.map(m => [m.title, m.value, m.subtext]),
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42], fontSize: 12 }, // Corporate Navy Blue
            styles: { cellPadding: 6, fontSize: 10 },
            margin: { left: 14, right: 14 }
          });

          // Table 2: Risk
          const finalY1 = (doc as any).lastAutoTable.finalY + 12;
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`Risk Profile: ${data.riskAssessment.level}`, 14, finalY1);

          autoTable(doc, {
            startY: finalY1 + 6,
            head: [['Risk Metric', 'Your Portfolio', 'Benchmark']],
            body: data.riskMetrics.map(r => [r.title, r.portfolioValue, r.benchmarkValue]),
            theme: 'striped',
            headStyles: { fillColor: [139, 92, 246], fontSize: 12 }, // Purple
            styles: { cellPadding: 6, fontSize: 10 },
            margin: { left: 14, right: 14 }
          });

          // Table 3: Allocation
          const finalY2 = (doc as any).lastAutoTable.finalY + 12;
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Top Sector Allocations', 14, finalY2);

          autoTable(doc, {
            startY: finalY2 + 6,
            head: [['Sector', 'Target Allocation %']],
            body: data.sectors.map(s => [s.name, `${s.value}%`]),
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], fontSize: 12 }, // Blue
            styles: { cellPadding: 6, fontSize: 10 },
            margin: { left: 14, right: 14 }
          });
        }

        // --- DRAW CORPORATE FOOTER ON ALL PAGES ---
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFillColor(248, 250, 252); 
          doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
          
          doc.setTextColor(156, 163, 175);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.text('CONFIDENTIAL - Generated by WealthWise Management Portfolio Advisory System', 14, pageHeight - 8);
          
          doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 65, pageHeight - 8);
          doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 8);
        }

        // --- TRIGGER DOWNLOAD ---
        doc.save(`WealthWise_${reportTitle.replace(/ /g, '_')}.pdf`);
      };

      // ==========================================
      // 3. LOAD THE IMAGE & EXECUTE
      // ==========================================
      const logoImg = new Image();
      // Points to the public folder where your logo is located
      logoImg.src = '/Wealth_full.png'; 

      logoImg.onload = () => {
        doc.addImage(logoImg, 'PNG', pageWidth - 55, 12, 45, 18);
        drawContentAndSave(); 
      };

      logoImg.onerror = () => {
        console.warn('Logo failed to load. Generating PDF without logo.');
        drawContentAndSave(); 
      };

    });
  }
}