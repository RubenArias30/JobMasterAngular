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
import { NifComponent } from './components/documents/nif/nif.component';
import { ContractsComponent } from './components/documents/contracts/contracts.component';
import { CurriculumComponent } from './components/documents/curriculum/curriculum.component';
import { LaboralLifeComponent } from './components/documents/laboral-life/laboral-life.component';
import { PayrollComponent } from './components/documents/payroll/payroll.component';
import { ProofComponent } from './components/documents/proof/proof.component';

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
     NifComponent,
     ContractsComponent,
     CurriculumComponent,
     LaboralLifeComponent,
     PayrollComponent,
     ProofComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
