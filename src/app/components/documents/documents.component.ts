import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  employees: Employee[] = [];
  isLoading = true;
  isError = false;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    // Calls the method to fetch employee data on component initialization
    this.getEmployees();
  }

  // Method to fetch employee data
  getEmployees(): void {
    this.apiService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener la lista de empleados:', error);
        this.isError = true;
        this.isLoading = false;
      }
    );
  }

  // Method to navigate to employee details page
  navigateToDetails(employeeId: string): void {
    this.router.navigate(['/documents/details', employeeId]);
  }

}
