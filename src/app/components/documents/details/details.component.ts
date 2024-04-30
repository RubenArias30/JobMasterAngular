import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  documents: any[] = [];
  employeeName: string = '';
  employeeId: number | undefined; // Inicializa como indefinido

  constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.route.params.subscribe(params => {
    //   const employeeId = params['employeeId'];
    //   this.getEmployeeName(employeeId);

    //   this.getDocuments(employeeId);
    // });

    this.route.params.subscribe(params => {
      this.employeeId = +params['employeeId']; // Convertir a número si es necesario
      this.getEmployeeName(this.employeeId);

      this.getDocuments(this.employeeId);
    });
  }

  getDocuments(employeeId: number): void {
    this.apiService.getDocumentsByEmployeeId(employeeId).subscribe(
      (response: any[]) => {
        console.log('Respuesta del servicio:', response);
        this.documents = response;
      },
      (error) => {
        console.error('Error al obtener la lista de documentos:', error);
      }
    );
  }


  getEmployeeName(employeeId: number): void {
    this.apiService.getEmployeeDetails(employeeId).subscribe(
      (response: any) => {
        console.log('Respuesta del servicio de detalles de empleado:', response);
        this.employeeName = response.name;
      },
      (error) => {
        console.error('Error al obtener el nombre del empleado:', error);
      }
    );
  }

  deleteDocument(documentId: number): void {
    if (confirm('¿Estás seguro de que deseas borrar este documento?')) {
      this.apiService.deleteDocument(documentId).subscribe(
        () => {
          // Eliminar el documento de la lista localmente
          this.documents = this.documents.filter(doc => doc.id !== documentId);
          console.log('Documento eliminado exitosamente');
        },
        (error) => {
          console.error('Error al borrar el documento:', error);
        }
      );
    }
  }

}
