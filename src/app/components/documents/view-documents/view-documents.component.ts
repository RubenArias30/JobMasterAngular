import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Document } from '../../../models/documents/documents.model';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent implements OnInit {

  documents: Document[] = [];
  documentTypes: string[] = ['contracts', 'nif', 'curriculum', 'laboral_life', 'payroll', 'proof'];
  selectedType: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.apiService.getMyDocuments().subscribe(
      (response: Document[]) => {
        this.documents = response;
        // Aplicar filtro si hay un tipo seleccionado
        if (this.selectedType !== '') {
          this.documents = this.documents.filter(document => document.type_documents === this.selectedType);
        }
      },
      (error) => {
        console.error('Error al cargar los documentos:', error);
      }
    );
  }

  filterDocumentsByType(type: string) {
    // Actualizar el tipo seleccionado y volver a cargar los documentos
    this.selectedType = type;
    this.loadDocuments();
  }
}
