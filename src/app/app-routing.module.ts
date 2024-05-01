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
import { DocumentsComponent } from './components/documents/documents.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DetailsComponent } from './components/documents/details/details.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AddScheduleComponent } from './components/schedule/add-schedule/add-schedule.component';
import { AddDocumentsComponent } from './components/documents/add-documents/add-documents.component';
import { AusenciasComponent } from './components/ausencias/ausencias/ausencias.component';
import { IncidentsComponent } from './components/incidents/incidents.component';
import { AddIncidentsComponent } from './components/incidents/add-incidents/add-incidents.component';



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
  { path: 'ausencias', component: LayoutComponent,
  canActivate:[MyGuardGuard],data: { roles: ['admin'] },
  children: [
    { path: '', component: AusenciasComponent },
    // { path: 'add_employee', component: AddEmployeeComponent },
    // { path: 'edit_employee/:id', component: EditEmployeeComponent }

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
  path: 'incidents',
  component: LayoutComponent,
  canActivate:[MyGuardGuard],data: { roles: ['admin'] },
  children: [
    { path: '', component: IncidentsComponent },
    // {  path: 'add_incidents',
    // component: AddIncidentsComponent,
    // canActivate: [MyGuardGuard],
    // data: { roles: ['empleado'] } }

  ],

  },
  {
    path: 'add_incidents',
    component: LayoutComponent,
    canActivate:[MyGuardGuard],
    data: { roles: ['empleado'] },
    children: [
      { path: '', component: AddIncidentsComponent },
    ],
  },


  {
    path: 'documents',
    component: LayoutComponent,
    canActivate: [MyGuardGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', component: DocumentsComponent },
      { path: 'details/:employeeId', component: DetailsComponent },
      { path: 'add_document/:employeeId', component: AddDocumentsComponent }

    ]
  },



{
  path: 'schedule',
  component: LayoutComponent,
  canActivate: [MyGuardGuard],
  data: { roles: ['admin'] },
  children: [
    { path: '', component: ScheduleComponent },
    { path: 'add_schedule/:id', component: AddScheduleComponent },

  ]
},



{ path: '**', component: PageNotFoundComponent } ,

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
