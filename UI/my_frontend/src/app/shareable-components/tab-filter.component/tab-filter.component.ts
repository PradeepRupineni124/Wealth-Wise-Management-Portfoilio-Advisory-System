import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-tab-filter',
  imports: [],
  templateUrl: './tab-filter.component.html',
  styleUrl: './tab-filter.component.css',
})
export class TabFilterComponent {
  @Input() tabs: string[] = [];
  @Output() tabChanged = new EventEmitter<string>();
  
  activeTab: string = '';

  ngOnInit() {
    
    if (this.tabs && this.tabs.length > 0) {
      this.activeTab = this.tabs[0];
    }
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
  }
}
