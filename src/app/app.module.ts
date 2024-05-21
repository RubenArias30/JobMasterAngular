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
import { IncidentsComponent } from './components/incidents/incidents.component';
import { AddIncidentsComponent } from './components/incidents/add-incidents/add-incidents.component';
import { HistoryIncidentsComponent } from './components/incidents/history-incidents/history-incidents.component';
import { AttendancesComponent } from './components/attendances/attendances.component';
import { AbsencesComponent } from './components/absences/absences.component';
import { AddAbsencesComponent } from './components/absences/add-absences/add-absences.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DeleteConfirmationModalComponent } from './components/alert-messages/delete-confirmation-modal/delete-confirmation-modal.component';
import { SuccessAlertComponent } from './components/alert-messages/success-alert/success-alert.component';
import { ViewDocumentsComponent } from './components/documents/view-documents/view-documents.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ViewScheduleComponent } from './components/schedule/view-schedule/view-schedule.component';
import { EditScheduleComponent } from './components/schedule/edit-schedule/edit-schedule.component';
import { DasboardEmployeeComponent } from './components/dashboard/dasboard-employee/dasboard-employee.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from './components/alert-messages/loading-spinner/loading-spinner.component';
import { CancelmodalComponent } from './components/alert-messages/cancelmodal/cancelmodal.component';





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
    IncidentsComponent,
    AddIncidentsComponent,
    HistoryIncidentsComponent,
    AttendancesComponent,
    AbsencesComponent,
    AddAbsencesComponent,
    ProfileComponent,
    DeleteConfirmationModalComponent,
    SuccessAlertComponent,
    ViewDocumentsComponent,
    RequestResetComponent,
    ResponseResetComponent,
    ViewScheduleComponent,
    EditScheduleComponent,
    LoadingSpinnerComponent,
    CancelmodalComponent,





  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    AppRoutingModule,
    NgxExtendedPdfViewerModule,
      NgxPaginationModule



  ],
  providers: [

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
