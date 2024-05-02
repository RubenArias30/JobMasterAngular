import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { JwtInterceptor } from '../app/interceptor/jwt.interceptor';
import { NifValidatorDirective } from './directive/nif-validator.directive';
import { BudgetComponent } from './components/budget/budget.component';
import { GenerateBudgetComponent } from './components/budget/generate-budget/generate-budget.component';
import { EditBudgetComponent } from './components/budget/edit-budget/edit-budget.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { DetailsComponent } from './components/documents/details/details.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AddScheduleComponent } from './components/schedule/add-schedule/add-schedule.component';
import { AddDocumentsComponent } from './components/documents/add-documents/add-documents.component';
import { AusenciasComponent } from './components/ausencias/ausencias/ausencias.component';
import { IncidentsComponent } from './components/incidents/incidents.component';
import { AddIncidentsComponent } from './components/incidents/add-incidents/add-incidents.component';
import { HistoryIncidentsComponent } from './components/incidents/history-incidents/history-incidents.component';
import { HistoryScheduleComponent } from './components/schedule/history-schedule/history-schedule.component';
import { HistoryDocumentsComponent } from './components/documents/history-documents/history-documents.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    LayoutComponent,
    EmployeesComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    NifValidatorDirective,
    BudgetComponent,
    GenerateBudgetComponent,
    EditBudgetComponent,
    DocumentsComponent,
    PageNotFoundComponent,
    ScheduleComponent,
    DashboardComponent,
    SidebarComponent,
    LayoutComponent,
    EmployeesComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    NifValidatorDirective,
    BudgetComponent,
    GenerateBudgetComponent,
    EditBudgetComponent,
    DocumentsComponent,
    PageNotFoundComponent,
    DetailsComponent,
    AddScheduleComponent,
    AddDocumentsComponent,
    AusenciasComponent,
    IncidentsComponent,
    AddIncidentsComponent,
    HistoryIncidentsComponent,
    HistoryScheduleComponent,
    HistoryDocumentsComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    AppRoutingModule,


  ],
  providers: [

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
