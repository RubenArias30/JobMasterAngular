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

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.apiService.getEmployees().subscribe(
      (response: any[]) => {
        console.log('Respuesta del servicio:', response);
        this.employees = response;
      },
      (error) => {
        console.error('Error al obtener la lista de empleados:', error);
      }
    );
  }

  navigateToDetails(employeeId: string): void {
    this.router.navigate(['/documents/details', employeeId]);
  }

}
