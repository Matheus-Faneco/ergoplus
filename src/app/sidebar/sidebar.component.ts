import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

//NÃO ESTÁ FUNCIONANDO COMO DEVERIA
export class SidebarComponent {
  activeMenu: string | null = null;
  openSubMenu: string | null = null;

  //setActiveMenu marca qual a opção de aba está marcada
  //activeMenu armazena a string que é classe da aba que está selecionada
  //Era a partir da aba ativa, que poderia ser usado como referência para manter esta aba azul.
  //As funções estão OK, deve ser algo no CSS
  setActiveMenu(menuName: string) {
    if (this.activeMenu === menuName) {
      this.activeMenu = null;
    } else {
      this.activeMenu = menuName;
    }
    this.openSubMenu = null;
  }
  //toggleSubMenu verifica se a aba "Relatório" está aberto ou não, se não estiver, ele aciona a abertura via Event Binding (click no HTML).
  //Foi implementado pra fazer a abertura do submenu da aba "Relatório"
  toggleSubMenu(subMenuName: string) {
    if (this.openSubMenu === subMenuName) {
      this.openSubMenu = null;
    } else {
      this.openSubMenu = subMenuName;
    }
  }
}
