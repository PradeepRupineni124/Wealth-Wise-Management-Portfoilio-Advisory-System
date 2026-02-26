import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-portfolio-table',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './portfolio-table.component.html',
  styleUrls: ['./portfolio-table.component.css']
})
export class PortfolioTableComponent {
  @Input() rowData: any[] = [];
  private gridApi!: GridApi;
  searchText = '';
  activeTab = 'All';
  isBrowser: boolean;

  // 1. CLEANED UP DEFAULTS: Removed the ugly filter icons and menus!
  defaultColDef: ColDef = { 
    sortable: true, 
    resizable: true, 
    suppressHeaderMenuButton: true, // Hides the hamburger menu
    filter: false // We use your custom search bar instead!
  };

  // 2. PERFECTED COLUMNS: Added flex, minWidth, and right-alignment
  colDefs: ColDef[] = [
    { field: 'symbol', headerName: 'Symbol', flex: 1, minWidth: 100, cellStyle: { fontWeight: '700' } },
    { field: 'name', headerName: 'Name', flex: 1.5, minWidth: 150 },
    { 
      field: 'type', 
      headerName: 'Type',
      flex: 1,
      minWidth: 120,
      cellRenderer: (p: any) => {
        // Formats 'Mutual Fund' to 'mutual-fund' to match the CSS modifier
        const modifier = p.value ? p.value.toLowerCase().replace(/\s+/g, '-') : '';
        return `<span class="asset-badge asset-badge--${modifier}">${p.value}</span>`;
      }
    },
    // type: 'numericColumn' automatically aligns numbers to the right!
    { field: 'qty', headerName: 'Quantity', flex: 1, minWidth: 100, type: 'numericColumn' },
    { 
      field: 'avgPrice', 
      headerName: 'Avg. Price', 
      flex: 1, 
      minWidth: 110, 
      type: 'numericColumn',
      valueFormatter: p => p.value != null ? '$' + p.value.toFixed(2) : '$0.00' 
    },
    { 
      field: 'currentPrice', 
      headerName: 'Current Price', 
      flex: 1, 
      minWidth: 120, 
      type: 'numericColumn',
      valueFormatter: p => p.value != null ? '$' + p.value.toFixed(2) : '$0.00' 
    },
    { 
      field: 'marketValue', 
      headerName: 'Market Value', 
      flex: 1.2, 
      minWidth: 130, 
      type: 'numericColumn',
      cellStyle: { fontWeight: '700' }, // Bold market value to match image
      valueFormatter: p => p.value != null ? '$' + p.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '$0' 
    },
    { 
      field: 'returnPct', 
      headerName: 'Return %',
      flex: 1.2,
      minWidth: 120,
      type: 'numericColumn',
      cellRenderer: (p: any) => {
        if (p.value == null) return '0%';
        const isPos = p.value >= 0;
        return `<span style="color: ${isPos ? '#10b981' : '#ef4444'}; font-weight: 600; display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                  <i class="pi ${isPos ? 'pi-arrow-up-right' : 'pi-arrow-down-left'}" style="font-size: 0.8rem"></i> ${isPos ? '+' : ''}${p.value.toFixed(1)}%
                </span>`;
      }
    },
    { 
      field: 'allocationPct', 
      headerName: 'Allocation %', 
      flex: 1, 
      minWidth: 120, 
      type: 'numericColumn',
      valueFormatter: p => p.value != null ? p.value.toFixed(1) + '%' : '0.0%' 
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('domLayout', 'autoHeight');
    // Forces grid to stretch columns to fit the container perfectly
    this.gridApi.sizeColumnsToFit(); 
  }

  onSearch() {
    this.gridApi.setGridOption('quickFilterText', this.searchText);
  }

  setFilter(tab: string) {
    this.activeTab = tab;
    const filterMap: any = { 'Equities': 'Equity', 'Bonds': 'Bond', 'Mutual Funds': 'Mutual Fund' };
    const val = filterMap[tab] || tab;

    // Use quick filter logic for the tabs to keep it simple since we disabled column filters
    if (tab === 'All') {
        this.gridApi.setGridOption('quickFilterText', this.searchText); // Reset to just search bar
    } else {
        this.gridApi.setGridOption('quickFilterText', val);
    }
  }
}