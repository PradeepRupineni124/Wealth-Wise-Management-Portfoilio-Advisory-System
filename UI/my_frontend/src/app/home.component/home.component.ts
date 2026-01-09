import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
 
 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MenubarModule,CardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class Home {
 
  items!: MenuItem[];
 
  ngOnInit() {
    this.items = [
  { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
  { label: 'About', icon: 'pi pi-info-circle', fragment: 'about', routerLink: '/' },
  { label: 'Features', icon: 'pi pi-star', fragment: 'features', routerLink: '/' },
  { label: 'Contact', icon: 'pi pi-envelope', fragment:'footer', routerLink: '/' }
];
}

}
