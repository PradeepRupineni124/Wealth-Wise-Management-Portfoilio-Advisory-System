import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

// 1. IMPORT SIDEBAR
import { SidebarComponent } from '../sidebar.component/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 2. ADD TO IMPORTS
  imports: [
    CommonModule, 
    MenubarModule, 
    BadgeModule, 
    AvatarModule, 
    ButtonModule, 
    RippleModule, 
    SidebarComponent 
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
   items: MenuItem[] | undefined;

   constructor(private router: Router) {}

   ngOnInit() {
       this.items = [
           {
               label: 'Users',
               icon: 'pi pi-users',
               styleClass: 'menu-item-users', 
               items: [
                   { label: 'Client 1', icon: 'pi pi-user' },
                   { label: 'Client 2', icon: 'pi pi-user' }
               ]
           }
       ];
   }

   logout() {
       localStorage.removeItem('token'); 
       sessionStorage.clear();
       this.router.navigate(['/login']);
   }
}