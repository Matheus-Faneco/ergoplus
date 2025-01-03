import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {HomeComponent} from './home/home.component';
import {MonitorComponent} from './monitor/monitor.component';
import {IndividualReportComponent} from './individual-report/individual-report.component';
import {GeneralReportComponent} from './general-report/general-report.component';
import {RegistrationComponent} from './registration/registration.component';
import {UserManualComponent} from './user-manual/user-manual.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {UserPerfilComponent} from './user-perfil/user-perfil.component';

const routes: Routes = [
  { path: 'home', component: SidebarComponent, children: [
      {
        path: 'acompanhamento',
        component: MonitorComponent
      },
      {
        path: 'relatorio-individual',
        component: IndividualReportComponent
      },
      {
        path: 'relatorio-geral',
        component: GeneralReportComponent
      },
      {
        path: 'cadastro',
        component: RegistrationComponent
      },
      {
        path: 'manual',
        component: UserManualComponent
      },
      {
        path: 'perfil',
        component: UserPerfilComponent
      },
    ] },
  { path: 'login', component: LoginComponent },
  { path: 'recovery', component: ForgotPasswordComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
