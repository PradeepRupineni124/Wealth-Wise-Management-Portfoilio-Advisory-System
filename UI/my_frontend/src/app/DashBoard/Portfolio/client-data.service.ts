import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientDataService {
  
  // CHANGED: Default is now 'null' instead of 1
  private selectedClientId = new BehaviorSubject<number | null>(null); 
  selectedClient$ = this.selectedClientId.asObservable();

  updateClient(id: number | null) {
    this.selectedClientId.next(id);
  }

  private openAddInvestmentSource = new Subject<void>();
  openAddInvestment$ = this.openAddInvestmentSource.asObservable();

  triggerAddInvestment() {
    this.openAddInvestmentSource.next();
  }
}