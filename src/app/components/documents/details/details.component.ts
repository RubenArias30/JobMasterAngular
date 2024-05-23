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
  showDropdown: boolean = false;
  documentTypes: string[] = ['contracts', 'nif', 'curriculum', 'laboral_life', 'payroll', 'proof','others'];
  selectedType: string = '';
  documentTypeTranslations: any = {
    'contracts': 'Contratos',
    'nif': 'NIF',
    'curriculum': 'Currículum',
    'laboral_life': 'Vida Laboral',
    'payroll': 'Nómina',
    'proof': 'Justificante',
    'others': 'Otros'
  };

  constructor(private router: Router, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['employeeId'];
      this.getEmployeeName(this.employeeId);

      this.getDocuments(this.employeeId);
    });
    // Set selectedType to 'all' to display all documents by default
    this.selectedType = 'all';
  }

   /**
   * Fetches documents by employee ID.
   * @param employeeId - The ID of the employee.
   */
  getDocuments(employeeId: number): void {
    this.apiService.getDocumentsByEmployeeId(employeeId).subscribe(
      (response: any[]) => {
        // Check if "Ver Todos" is selected
        if (this.selectedType === 'all') {
          this.documents = response; // Assign all documents
        } else {
          // Apply filter if a type is selected
          this.documents = response.filter(document => document.type_documents === this.selectedType);
        }
      },
      (error) => {
        console.error('Error al obtener la lista de documentos:', error);
      }
    );
  }

    /**
   * Fetches the name of the employee.
   * @param employeeId - The ID of the employee.
   */
  getEmployeeName(employeeId: number): void {
    this.apiService.getEmployeeDetails(employeeId).subscribe(
      (response: any) => {
        this.employeeName = response.name;
      },
      (error) => {
        console.error('Error al obtener el nombre del empleado:', error);
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
   * Filters documents by type.
   * @param documentType - The type of document to filter by.
   */
  filterDocuments(documentType: string): void {
    // Update the selected type
    this.selectedType = documentType;
    // Ensure employeeId is defined before fetching documents
    if (this.employeeId !== undefined) {
      // Reload documents
      this.getDocuments(this.employeeId);
    } else {
      console.error("Employee ID is undefined.");
    }
    // Close the dropdown after selection
    this.showDropdown = false;
  }

   /**
   * Deletes a document.
   * @param documentId - The ID of the document to delete.
   */
  deleteDocument(documentId: number): void {
    if (confirm('¿Estás seguro de que deseas borrar este documento?')) {
      this.apiService.deleteDocument(documentId).subscribe(
        () => {
         // Remove the document from the local list
          this.documents = this.documents.filter(doc => doc.id !== documentId);
          console.log('Documento eliminado exitosamente');
        },
        (error) => {
          console.error('Error al borrar el documento:', error);
        }
      );
    }
  }

    /**
   * Translates the document type.
   * @param documentType - The document type to translate.
   * @returns The translated document type.
   */
  translateDocumentType(documentType: string): string {
    return this.documentTypeTranslations[documentType] || documentType;
  }

    /**
   * Downloads a document.
   * @param documentId - The ID of the document to download.
   * @param documentName - The name of the document.
   */
  downloadDocument(documentId: number, documentName: string): void {
    this.apiService.downloadDocument(documentId).subscribe(
      (response) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentName; // Use documentName as the file name
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading the document:', error);
      }
    );
  }

}
