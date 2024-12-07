import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {PasswordModule} from 'primeng/password';
import {PaginatorModule} from 'primeng/paginator';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MonitorComponent } from './monitor/monitor.component';
import { ReportComponent } from './report/report.component';
import { IndividualReportComponent } from './individual-report/individual-report.component';
import { GeneralReportComponent } from './general-report/general-report.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserManualComponent } from './user-manual/user-manual.component';
import {MatButton} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    HomeComponent,
    SidebarComponent,
    MonitorComponent,
    ReportComponent,
    IndividualReportComponent,
    GeneralReportComponent,
    RegistrationComponent,
    UserManualComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PasswordModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    MatSidenavModule,
    MatButton,
  ],
  providers: [
    provideAnimationsAsync('noop')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
