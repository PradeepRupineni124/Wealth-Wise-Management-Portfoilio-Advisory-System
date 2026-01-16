import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  
  menuItems: MenuItem[] = [
    { label: 'Overview', icon: 'pi pi-th-large', route: '/overview' },
    { label: 'Portfolio', icon: 'pi pi-briefcase', route: '/portfolio' },
    { label: 'Advisory', icon: 'pi pi-lightbulb', route: '/advisory' },
    { label: 'Compliance', icon: 'pi pi-shield', route: '/compliance' },
    { label: 'Analytics', icon: 'pi pi-chart-bar', route: '/analytics' },
    { label: 'Profile', icon: 'pi pi-user', route: '/admin/profile' },
  ];
}