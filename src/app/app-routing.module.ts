import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { EditEmployeeComponent } from './components/employees/edit-employee/edit-employee.component';
import { MyGuardGuard } from './auth/my-guard.guard';
import { BudgetComponent } from './components/budget/budget.component';
import { GenerateBudgetComponent } from './components/budget/generate-budget/generate-budget.component';
import { EditBudgetComponent } from './components/budget/edit-budget/edit-budget.component';

import { IncidenciaComponent } from './components/incidencia/incidencia.component';
import { ContractsComponent } from './components/documents/contracts/contracts.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent, },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent, canActivate:[MyGuardGuard] ,data: { roles: ['admin','empleado'] }}
    ]
  },
  { path: 'employees', component: LayoutComponent,
  canActivate:[MyGuardGuard],data: { roles: ['admin'] },
  children: [
    { path: '', component: EmployeesComponent },
    { path: 'add_employee', component: AddEmployeeComponent },
    { path: 'edit_employee/:id', component: EditEmployeeComponent }

  ]
},
{
  path: 'budget',
  component: LayoutComponent,
  canActivate:[MyGuardGuard],data: { roles: ['admin'] },
  children: [
    { path: '', component: BudgetComponent },
    { path: 'generate_budget', component: GenerateBudgetComponent },
    { path: 'edit_budget', component: EditBudgetComponent }

  ]
},
{
  path: 'incidencia',
  component: LayoutComponent,
  canActivate:[MyGuardGuard],data: { roles: ['admin'] },
  children: [
    { path: '', component: IncidenciaComponent }],
  },
  {
  path: 'documents',
  component: LayoutComponent,
  canActivate: [MyGuardGuard],
  data: { roles: ['admin'] },
  children: [
    { path: '', component: DocumentsComponent }
  ]
},
{
  path: 'documents/contracts/:employeeId',
  component: LayoutComponent,
  canActivate: [MyGuardGuard],
  data: { roles: ['admin'] },
  children: [
    { path: '', component: ContractsComponent }

  ]
},
{ path: '**', component: PageNotFoundComponent } ,// Wildcard route for Page Not Found
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
