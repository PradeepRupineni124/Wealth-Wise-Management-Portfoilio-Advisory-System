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

  defaultColDef: ColDef = { sortable: true, filter: true, resizable: true, flex: 1,editable:true };

  colDefs: ColDef[] = [
    { field: 'symbol', headerName: 'Symbol', cellStyle: { fontWeight: '700' } },
    { field: 'name', headerName: 'Name', flex: 1.5 },
    { field: 'type', cellRenderer: (p: any) => `<span class="type-pill ${p.value?.toLowerCase().replace(/\s+/g, '-')}">${p.value}</span>` },
    { field: 'qty', headerName: 'Qty', type: 'numericColumn' },
    { field: 'marketValue', headerName: 'Market Value', valueFormatter: p => '$' + p.value.toLocaleString() },
    { 
      field: 'return', 
      headerName: 'Return %',
      cellRenderer: (p: any) => {
        const isPos = p.value >= 0;
        return `<span style="color: ${isPos ? '#10b981' : '#ef4444'}; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                  <i class="pi ${isPos ? 'pi-arrow-up-right' : 'pi-arrow-down-left'}" style="font-size: 0.8rem"></i> ${isPos ? '+' : ''}${p.value}%
                </span>`;
      }
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('domLayout', 'autoHeight');
  }

  onSearch() {
    this.gridApi.setGridOption('quickFilterText', this.searchText);
  }

  setFilter(tab: string) {
    this.activeTab = tab;
    const filterMap: any = { 'Equities': 'Equity', 'Bonds': 'Bond', 'Mutual Funds': 'Mutual Fund' };
    const val = filterMap[tab] || tab;

    const filterModel = tab === 'All' ? null : { filterType: 'text', type: 'equals', filter: val };

    this.gridApi.setColumnFilterModel('type', filterModel).then(() => {
      this.gridApi.onFilterChanged();
      this.gridApi.setGridOption('domLayout', 'autoHeight');
    });
  }
}