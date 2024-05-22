import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Document } from '../../../models/documents.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent implements OnInit {

  documents: Document[] = [];
  documentTypes: any = {
    'contracts': 'Contratos',
    'nif': 'NIF',
    'curriculum': 'Currículum',
    'laboral_life': 'Vida Laboral',
    'payroll': 'Nómina',
    'proof': 'Justificante',
    'others': 'Otros'
  };
  selectedType: string = '';
  showDropdown: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDocuments();
  }
  loadDocuments() {
    this.apiService.getMyDocuments().subscribe(
      (response: any[]) => {
        this.documents = response;
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
    this.selectedType = type;
    this.loadDocuments();
  }

  downloadDocument(documentId: number, documentName: string): void {
    this.apiService.downloadDocument(documentId).subscribe(
      (response: Blob) => {
        saveAs(response, documentName);
      },
      (error) => {
        console.error('Error al descargar el documento:', error);
      }
    );
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  translateDocumentType(documentType: string): string {
    return this.documentTypes[documentType] || documentType;
  }
}
