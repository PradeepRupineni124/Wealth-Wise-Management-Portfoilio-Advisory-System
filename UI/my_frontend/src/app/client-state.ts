import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ClientState {
   // Default to Pradeep (ID: 1)
  private defaultClient = { name: 'Pradeep', id: 1 };

  private clientSource = new BehaviorSubject<any>(this.defaultClient);
  currentClient$ = this.clientSource.asObservable();

  constructor() {}

  updateClient(client: any) {
    this.clientSource.next(client);
  }
}
