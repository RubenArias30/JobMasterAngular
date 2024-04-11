import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  employees: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getEmployees();
  }
  getEmployees(): void {
    this.apiService .getEmployees().subscribe(
      (response: any[]) => {
        this.employees = response;
      },
      (error) => {
        console.error('Error al obtener la lista de empleados:', error);
      }
    );
  }

}
