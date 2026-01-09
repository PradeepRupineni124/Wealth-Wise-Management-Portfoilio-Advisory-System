import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, DrawerModule, ButtonModule, RippleModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  visible: boolean = true;
  activeItem: string = 'Overview'; 

  // Icons matched to your screenshot
  menuItems = [
    { label: 'Overview',   icon: 'pi pi-th-large' },   // Grid icon
    { label: 'Portfolio',  icon: 'pi pi-briefcase' },  // Briefcase icon
    { label: 'Advisory',   icon: 'pi pi-lightbulb' },  // Bulb icon
    { label: 'Compliance', icon: 'pi pi-shield' },     // Shield icon
    { label: 'Analytics',  icon: 'pi pi-chart-bar' },  // Chart icon
    { label: 'Profile',    icon: 'pi pi-user' }        // User icon
  ];

  selectItem(label: string) {
    this.activeItem = label;
  }
}