import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  employees: any[] = [];
  isLoading = true;
  isError = false;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.apiService.getEmployees().subscribe(
      (response: any[]) => {
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

  navigateToDetails(employeeId: string): void {
    this.router.navigate(['/documents/details', employeeId]);
  }

}
