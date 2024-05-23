import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GenerateBudgetComponent } from './generate-budget/generate-budget.component'; // Import the sibling component

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice } from 'src/app/models/invoices.model';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  @ViewChild(GenerateBudgetComponent, { static: true }) // Initialize ViewChild in the constructor
  private generateBudgetComponent!: GenerateBudgetComponent; // Ensure it's initialized
  invoices: Invoice[] = [];
  showDropdown: boolean = false;
  sortBy: string = 'default';
  filterButtonText: string = 'Filtros';
  p: number = 1;
  isLoading = true;
  isError = false;


  showConfirmationModal = false;  // To control the visibility of the modal
  invoiceIdToDelete: string | null = null; // To store the ID of the invoice to be deleted

  // success messages
  showSuccessAlert: boolean = false;
  successMessage: string = '';

  //search bar
  searchQuery: string = '';
  originalinvoices: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getInvoices();

  }


  /**
   * Fetches the list of invoices from the API and updates the component state.
   */
  getInvoices(): void {
    this.apiService.getInvoices().subscribe(
      (response: Invoice[]) => {
        this.invoices = response;
        this.originalinvoices = this.invoices;
        console.log(response)
        this.sortInvoices(this.sortBy);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener la lista de facturas:', error);
        this.isError = true; // Set error flag to true
        this.isLoading = false;
      }
    );
  }


  /**
   * Confirms deletion of an invoice by showing a confirmation dialog.
   * @param invoiceId - The ID of the invoice to delete.
   */
  confirmDeleteInvoice(invoiceId: string): void {
    this.invoiceIdToDelete = invoiceId;
    this.showConfirmationModal = true;
  }

  onCloseModal(): void {
    this.showConfirmationModal = false;
    this.invoiceIdToDelete = null;
  }

  onConfirmDelete(): void {
    if (this.invoiceIdToDelete) {
      this.deleteInvoice(this.invoiceIdToDelete);
      this.onCloseModal();
    }
  }

    /**
   * Deletes an invoice by its ID and updates the local list of invoices.
   * @param invoiceId - The ID of the invoice to delete.
   */
  deleteInvoice(invoiceId: string): void {
    this.apiService.deleteInvoice(invoiceId.toString()).subscribe(
      () => {
         // Remove the invoice from the local list after deleting it from the server
        this.invoices = this.invoices.filter(invoice => invoice.id.toString() !== invoiceId);
        this.showSuccessAlertMessage('Presupuesto eliminado con éxito');

      },
      (error) => {
        console.error('Error al eliminar la factura:', error);
        alert('Hubo un error al eliminar la factura. Por favor, inténtalo de nuevo más tarde.');
      });
  }

   /**
   * Toggles the visibility of the sorting dropdown.
   */
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

   /**
   * Resets the pagination to the first page.
   */
  resetPagination() {
    this.p = 1; // Reset the current page to 1
  }

    /**
   * Sorts the list of invoices based on the selected option.
   * @param option - The sorting option ('asc', 'desc', or 'default').
   */
  sortInvoices(option: string): void {
    if (option === 'asc') {
      this.invoices.sort((a, b) => a.total - b.total); // Sort ascending
      this.filterButtonText = 'ASC'; // Update filter button text
    } else if (option === 'desc') {
      this.invoices.sort((a, b) => b.total - a.total); // Sort descending
      this.filterButtonText = 'DESC'; // Update filter button text
    } else {
      // Show as default (no sorting)
      this.apiService.getInvoices().subscribe(
        (response: any[]) => {
          this.invoices = response;
          this.filterButtonText = 'Filtros'; // Update filter button text
        },
        (error) => {
          console.error('Error al obtener la lista de facturas:', error);
        }
      );
    }
    this.showDropdown = false; // Close the dropdown after selecting an option
  }

  generatePDF(invoice: any): void {
    const doc = new jsPDF('p', 'mm', 'a4'); // Use 'p' for portrait mode, 'mm' for millimeters, and 'a4' for the page size

    // Logo and title
    const logoUrl = 'assets/img/logopreview.png'; // Replace with your actual logo base64 string
    doc.addImage(logoUrl, 'PNG', 10, 10, 50, 20); // Add logo
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PRESUPUESTO', 70, 20);

    // Client and company information
    autoTable(doc, {
      body: [
        [
          {
            content: `Datos del cliente:\nNombre: ${invoice.clients.client_name}\nTeléfono: ${invoice.clients.client_telephone}\nEmail: ${invoice.clients.client_email}\nDirección: ${invoice.clients.client_street}\nCiudad: ${invoice.clients.client_city}\nCódigo Postal: ${invoice.clients.client_postal_code}`,
            styles: {
              textColor: '#333333',
              fontSize: 10,
              cellPadding: 6,
            }
          },
          {
            content: `Datos de la empresa:\nNombre: ${invoice.companies.company_name}\nTeléfono: ${invoice.companies.company_telephone}\nEmail: ${invoice.companies.company_email}\nDirección: ${invoice.companies.company_street}\nCiudad: ${invoice.companies.company_city}\nCódigo Postal: ${invoice.companies.company_postal_code}`,
            styles: {
              textColor: '#333333',
              fontSize: 10,
              cellPadding: 6,
            }
          }
        ]
      ],
      theme: 'plain',
      margin: { top: 40 },
    });

    // Concept header
    autoTable(doc, {
      body: [
        [
          {
            content: 'Conceptos y información',
            styles: {
              halign: 'left',
              fontSize: 14,
              fontStyle: 'bold',
            }
          }
        ]
      ],
      theme: 'plain',
      margin: { top: 10 },
    });

    // Concepts table
    autoTable(doc, {
      head: [['Concepto', 'Precio', 'Cantidad', 'Descuento', 'IVA', 'IRPF']],
      body: invoice.concepts.map((concept: any) => [
        concept.concept,
        `${concept.price}€`,
        concept.quantity,
        `${concept.concept_discount}%`,
        `${concept.concept_iva}%`,
        `${concept.concept_irpf}%`
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: '#92E3A9',
        textColor: '#ffffff'
      },
      margin: { top: 10 },
    });

    // Subtotal, total, and date
    autoTable(doc, {
      body: [
        [
          {
            content: 'Subtotal:',
            styles: {
              halign: 'right',
              fontSize: 12,
              fontStyle: 'bold',
            }
          },
          {
            content: `${invoice.subtotal}€`,
            styles: {
              halign: 'right',
              fontSize: 12,
            }
          }
        ],
        [
          {
            content: 'Total:',
            styles: {
              halign: 'right',
              fontSize: 12,
              fontStyle: 'bold',
            }
          },
          {
            content: `${invoice.total}€`,
            styles: {
              halign: 'right',
              fontStyle: 'bold',
              fontSize: 12,
              textColor: '#92E3A9'
            }
          }
        ],
        [
          {
            content: `Fecha: ${new Date().toLocaleDateString()}`,
            styles: {
              halign: 'right',
              fontSize: 12,
            }
          },
          {
            content: '',
            styles: {
              halign: 'right',
              fontSize: 12,
            }
          }
        ],
      ],
      theme: 'plain',
      margin: { top: 10 },
    });

    // Save the PDF
    doc.save('presupuesto.pdf');
  }


  // message is shown after the delete is done
  showSuccessAlertMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);  // Hide the alert after 3 seconds
  }

  searchInvoices(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery.toLowerCase().trim();

    if (query === '') {
        this.invoices = this.originalinvoices;
    } else {
      this.invoices = this.originalinvoices.filter(invoice => {
          const clientName = invoice.clients?.client_name?.toLowerCase() || '';
          const companyName = invoice.companies?.company_name?.toLowerCase() || '';

          if (query.length === 1) {
              // If the query is a single character, check if the name starts with this character
              return clientName.startsWith(query) || companyName.startsWith(query);
          } else {
              // For longer queries, check if the name contains the query string
              return clientName.includes(query) || companyName.includes(query);
          }
      });
    }
}


}
