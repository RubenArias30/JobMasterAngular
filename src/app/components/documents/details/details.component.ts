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
  employeeId: number | undefined;
  showDropdown: boolean = false;
  documentTypes: string[] = ['contracts', 'nif', 'curriculum', 'laboral_life', 'payroll', 'proof', 'others'];
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


  showConfirmationModal: boolean = false;
  documentToDelete: number | null = null;


  // success messages
  showSuccessAlert: boolean = false;
  successMessage: string = '';




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
   * Retrieves documents for the specified employee ID.
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
   * Retrieves the name of the employee.
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
   * Toggles the dropdown visibility.
   */
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

    /**
   * Filters documents by document type.
   * @param documentType - The document type to filter by.
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
   * Opens the delete modal for the specified document.
   * @param documentId - The ID of the document to delete.
   */
  openDeleteModal(documentId: number): void {
    this.documentToDelete = documentId;
    this.showConfirmationModal = true;
  }

  /**
   * Closes the delete modal.
   */
  closeDeleteModal(): void {
    this.showConfirmationModal = false;
    this.documentToDelete = null;
  }

 /**
   * Confirms the deletion of the document.
   */
  confirmDeletion(): void {
    if (this.documentToDelete !== null) {
      this.apiService.deleteDocument(this.documentToDelete).subscribe(
        () => {
          this.documents = this.documents.filter(doc => doc.id !== this.documentToDelete);
          this.showSuccessAlertMessage('Documento eliminado con éxito');
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Error al borrar el documento:', error);
        }
      );
    }
  }

    /**
   * Translates document type into the corresponding translated value.
   * @param documentType - The document type to translate.
   * @returns The translated document type.
   */
  translateDocumentType(documentType: string): string {
    return this.documentTypeTranslations[documentType] || documentType;
  }

  /**
   * Downloads the specified document.
   * @param documentId - The ID of the document to download.
   * @param documentName - The name of the document to download.
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
    /**
   * Displays a success alert message for a specified duration.
   * @param message - The message to display in the success alert.
   */
  showSuccessAlertMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);  // Hide the alert after 3 seconds
  }


}
