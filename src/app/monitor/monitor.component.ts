import { Component } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent {
  openSubMenu: string | null = null;


  toggleSubMenu(subMenuName: string) {
    if (this.openSubMenu === subMenuName) {
      this.openSubMenu = null;
    } else {
      this.openSubMenu = subMenuName;
    }
  }
}
