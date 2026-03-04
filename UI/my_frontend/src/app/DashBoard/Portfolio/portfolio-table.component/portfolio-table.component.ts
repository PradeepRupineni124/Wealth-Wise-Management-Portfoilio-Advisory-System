import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
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
  
  // NEW: Emit an event when a cell is edited so the parent can call the backend!
  @Output() quantityChanged = new EventEmitter<{holdingId: number, newQty: number, oldQty: number}>();
  
  private gridApi!: GridApi;
  searchText = '';
  activeTab = 'All';
  isBrowser: boolean;

  defaultColDef: ColDef = { 
    sortable: true, 
    resizable: true, 
    suppressHeaderMenuButton: true, 
    filter: false 
  };

  colDefs: ColDef[] = [
    { field: 'symbol', headerName: 'Symbol', flex: 1, minWidth: 100, cellStyle: { fontWeight: '700' } },
    { field: 'name', headerName: 'Name', flex: 1.5, minWidth: 150 },
    { 
      field: 'type', 
      headerName: 'Type',
      flex: 1,
      minWidth: 120,
      cellRenderer: (p: any) => {
        const modifier = p.value ? p.value.toLowerCase().replace(/\s+/g, '-') : '';
        return `<span class="asset-badge asset-badge--${modifier}">${p.value}</span>`;
      }
    },
    { 
      field: 'qty', 
      headerName: 'Quantity', 
      flex: 1, 
      minWidth: 100, 
      type: 'numericColumn',
      editable: true, 
      cellEditor: 'agNumberCellEditor', 
      // The cellStyle line has been completely removed!
      valueFormatter: p => p.value != null ? p.value.toString() : '-' 
    },
    { 
      field: 'avgPrice', 
      headerName: 'Avg. Price', 
      flex: 1, 
      minWidth: 110, 
      type: 'numericColumn',
      valueFormatter: p => p.value != null ? '$' + p.value.toFixed(2) : '-' 
    },
    { 
      field: 'currentPrice', 
      headerName: 'Current Price', 
      flex: 1, 
      minWidth: 120, 
      type: 'numericColumn',
      valueFormatter: p => p.value != null ? '$' + p.value.toFixed(2) : '-' 
    },
    { 
      field: 'marketValue', 
      headerName: 'Market Value', 
      flex: 1.2, 
      minWidth: 130, 
      type: 'numericColumn',
      cellStyle: { fontWeight: '700' }, 
      valueFormatter: p => p.value != null ? '$' + p.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '$0' 
    },
    { 
      field: 'liquidityAssets', 
      headerName: 'Liquidity Assets', 
      flex: 1.2, 
      minWidth: 130, 
      type: 'numericColumn',
      valueFormatter: p => p.value != null ? '$' + p.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0}) : '-' 
    },
    { 
      field: 'returnPct', 
      headerName: 'Return %',
      flex: 1.2,
      minWidth: 120,
      type: 'numericColumn',
      cellRenderer: (p: any) => {
        if (p.value == null) return '<span style="color: #94a3b8; font-weight: 500;">-</span>';
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
    this.gridApi.sizeColumnsToFit(); 
  }

  onSearch() {
    this.gridApi.setGridOption('quickFilterText', this.searchText);
  }

  setFilter(tab: string) {
    this.activeTab = tab;
    const filterMap: any = { 
        'Equities': 'Equity', 
        'Bonds': 'Bond', 
        'Mutual Funds': 'Mutual Fund',
        'Liquidity Assets': 'Liquidity Asset' 
    };
    const val = filterMap[tab] || tab;

    if (tab === 'All') {
        this.gridApi.setGridOption('quickFilterText', this.searchText); 
    } else {
        this.gridApi.setGridOption('quickFilterText', val);
    }
  }

  // NEW: Catches the edit event and emits it to the parent
  onCellValueChanged(event: any) {
    if (event.colDef.field === 'qty') {
      const newValue = Number(event.newValue);
      const oldValue = Number(event.oldValue);
      
      // Ensure the value actually changed and is a valid number
      if (newValue !== oldValue && !isNaN(newValue) && event.data.holdingId) {
         this.quantityChanged.emit({
            holdingId: event.data.holdingId,
            newQty: newValue,
            oldQty: oldValue
         });
      }
    }
  }
}