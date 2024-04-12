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

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
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
    { path: 'edit_employee', component: EditEmployeeComponent }

  ]
},
{
  path: 'budget',
  component: LayoutComponent,
  children: [
    { path: '', component: BudgetComponent },
    { path: 'generate_budget', component: BudgetComponent },
    { path: 'edit_budget', component: BudgetComponent }

  ]
}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
