import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientState {
  
  // 🚨 FIX: Start with 'null' so the app knows NO client is selected yet!
  private clientSource = new BehaviorSubject<any>(null);
  
  currentClient$ = this.clientSource.asObservable();

  constructor() {}

  updateClient(client: any) {
    this.clientSource.next(client);
  }
}