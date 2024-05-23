import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  employees: Employee[] = [];
  isLoading = true;
  isError = false;
  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getEmployees();
  }

    /**
   * Fetches the list of employees.
   */
  getEmployees(): void {
    this.apiService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener la lista de empleados:', error);
        this.isError = true; // Set error flag to true
        this.isLoading = false;
      }
    );
  }
}
