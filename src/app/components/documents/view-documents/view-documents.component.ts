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

  //Documents Object
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
    this.loadDocuments(); // Load documents on component initialization
  }


  /**
   * Loads documents.
   */
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

    /**
   * Filters documents by type.
   * @param type - The type of document to filter by.
   */
  filterDocumentsByType(type: string) {
    this.selectedType = type;
    this.loadDocuments();
  }

    /**
   * Downloads a document.
   * @param documentId - The ID of the document to download.
   * @param documentName - The name of the document.
   */
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

 /**
   * Toggles the document type dropdown.
   */
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

    /**
   * Translates the document type.
   * @param documentType - The document type to translate.
   * @returns The translated document type.
   */
  translateDocumentType(documentType: string): string {
    return this.documentTypes[documentType] || documentType;
  }
}
