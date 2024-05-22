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
  sortBy: string = 'default'; // Default sorting option
  filterButtonText: string = 'Filtros'; // Initialize filter button text
  p: number = 1;
  isLoading = true;
  isError = false;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices(): void {
    this.apiService.getInvoices().subscribe(
      (response: Invoice[]) => {
        this.invoices = response;
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

  confirmDeleteInvoice(invoiceId: string): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta factura?');
    if (confirmDelete) {
      this.deleteInvoice(invoiceId);
    }
  }

  deleteInvoice(invoiceId: string): void {
    this.apiService.deleteInvoice(invoiceId.toString()).subscribe(
      () => {
        // Eliminar la factura de la lista localmente después de eliminarla del servidor
        this.invoices = this.invoices.filter(invoice => invoice.id.toString() !== invoiceId);
      },
      (error) => {
        console.error('Error al eliminar la factura:', error);
        alert('Hubo un error al eliminar la factura. Por favor, inténtalo de nuevo más tarde.');
      });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  resetPagination() {
    this.p = 1; // Reset the current page to 1
  }

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
}
