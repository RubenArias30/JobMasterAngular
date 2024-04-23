import { Component, OnInit  } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit{
  employees: any[] = [];
  employeeName: string = '';

  constructor(private router: Router,private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEmployees();
    this.route.params.subscribe(params => {
      this.employeeName = params['employeeName'];
    });
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

//Redirecion:
navigateToContracts(employeeId: string): void {
  this.router.navigate(['/documents/contracts', employeeId]);
}

}
