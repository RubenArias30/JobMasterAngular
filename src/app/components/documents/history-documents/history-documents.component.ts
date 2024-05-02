import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-history-documents',
  templateUrl: './history-documents.component.html',
  styleUrls: ['./history-documents.component.css']
})
export class HistoryDocumentsComponent {
  // userDocuments: any[] = []; // Arreglo para almacenar los documentos del usuario

  // constructor(private apiService: ApiService) {}

  // ngOnInit(): void {
  //   // Obtener los documentos del usuario actual al inicializar el componente
  //   this.getUserDocuments();
  // }

  // // Método para obtener los documentos del usuario actual
  // getUserDocuments() {
  //   // Llamada al método del ApiService para obtener los documentos del empleado actual
  //   this.apiService.getDocumentsByEmployeeIdEMPLEADO().subscribe(
  //     (response: any[]) => {
  //       this.userDocuments = response;
  //     },
  //     error => {
  //       console.error('Error al obtener documentos del usuario:', error);
  //     }
  //   );
  // }
}
