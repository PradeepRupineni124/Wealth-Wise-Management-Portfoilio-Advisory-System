import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home.component',
  imports: [CommonModule, RouterModule, MenubarModule, CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  items: MenuItem[] | undefined;
  

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.items = [];
  }

  /**
   * Helper method to handle smooth scrolling to specific section IDs
   * @param sectionId The ID of the HTML element to scroll to
   */
  scrollToSection(sectionId: string) {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
