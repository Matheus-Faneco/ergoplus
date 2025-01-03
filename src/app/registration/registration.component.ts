import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  openSubMenu: string | null = null;


  toggleSubMenu(subMenuName: string) {
    if (this.openSubMenu === subMenuName) {
      this.openSubMenu = null;
    } else {
      this.openSubMenu = subMenuName;
    }
  }
}
