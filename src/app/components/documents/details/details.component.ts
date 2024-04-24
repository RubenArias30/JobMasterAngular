import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit{
  documents: any[] = [];
  filteredDocuments: any[] = [];
  employeeName: string = '';

  constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeName = params['employeeName'];
      this.getDocuments();
    });
  }

  getDocuments(): void {
    this.apiService.getDocuments().subscribe(
      (response: any[]) => {
        console.log('Respuesta del servicio:', response);
        this.documents = response;
        // Filtrar los documentos por el nombre del empleado
        this.filteredDocuments = this.documents.filter(doc => doc.employee_name === this.employeeName);
      },
      (error) => {
        console.error('Error al obtener la lista de documentos:', error);
      }
    );
  }
}
