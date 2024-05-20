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
import { IncidentsComponent } from './components/incidents/incidents.component';
import { AddIncidentsComponent } from './components/incidents/add-incidents/add-incidents.component';
import { HistoryIncidentsComponent } from './components/incidents/history-incidents/history-incidents.component';
import { AttendancesComponent } from './components/attendances/attendances.component';
import { AbsencesComponent } from './components/absences/absences.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ViewDocumentsComponent } from './components/documents/view-documents/view-documents.component';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { AddAbsencesComponent } from './components/absences/add-absences/add-absences.component';
import { ViewScheduleComponent } from './components/schedule/view-schedule/view-schedule.component';
import { EditScheduleComponent } from './components/schedule/edit-schedule/edit-schedule.component';
import { DasboardEmployeeComponent } from './components/dashboard/dasboard-employee/dasboard-employee.component';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent, },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent, canActivate:[MyGuardGuard] ,data: { roles: ['admin'] }}
    ]
  },
  {
    path: 'dashboard-employee',
    component: LayoutComponent,
    children: [
      { path: '', component: DasboardEmployeeComponent, canActivate:[MyGuardGuard] ,data: { roles: ['empleado'] }}
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
  { path: 'absences', component: LayoutComponent,
  canActivate:[MyGuardGuard],data: { roles: ['admin'] },
  children: [
    { path: '', component: AbsencesComponent },

    { path: 'add-absence', component: AddAbsencesComponent }
    //  { path: 'edit-absences', component: EditAbsenceComponent },
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
    { path: 'edit_budget/:id', component: EditBudgetComponent }

  ]
},
{
  path: 'incidents',
  component: LayoutComponent,
  canActivate:[MyGuardGuard],data: { roles: ['admin'] },
  children: [
    { path: '', component: IncidentsComponent },

  ],

  },
  {
    path: 'history_incidents',
    component: LayoutComponent,
    canActivate:[MyGuardGuard],
    data: { roles: ['empleado'] },
    children: [
      { path: '', component: HistoryIncidentsComponent },
      { path: 'add_incidents', component: AddIncidentsComponent },
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
    path: 'view-documents',
    component: LayoutComponent,
    canActivate: [MyGuardGuard],
    data: { roles: ['empleado'] },
    children: [
      { path: '', component: ViewDocumentsComponent },

    ]
  },

  {
    path: 'request-password-reset',
    component: RequestResetComponent,

  },
  {
    path: 'response-password-reset',
    component: ResponseResetComponent,

  },


{
  path: 'schedule',
  component: LayoutComponent,
  canActivate: [MyGuardGuard],
  data: { roles: ['admin']},
  children: [
    { path: '', component: ScheduleComponent },
    { path: 'add_schedule/:id', component: AddScheduleComponent },
    { path: 'edit_schedule/:id', component: EditScheduleComponent },

  ]
},

{
  path: 'view-schedule',
  component: LayoutComponent,
  canActivate: [MyGuardGuard],
  data: { roles: ['empleado']},
  children: [
    { path: '', component: ViewScheduleComponent },

  ]
},

{
  path: 'attendances',
  component: LayoutComponent,
  canActivate: [MyGuardGuard],
  data: { roles: ['empleado'] },
  children: [
    { path: '', component: AttendancesComponent },

  ]
},

{
  path: 'profile',
  component: LayoutComponent,
  canActivate: [MyGuardGuard],
  data: { roles: ['empleado'] },
  children: [
    { path: '', component: ProfileComponent }
  ]
},

{ path: '**', component: PageNotFoundComponent } ,

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
