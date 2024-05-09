import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GenerateBudgetComponent } from './generate-budget/generate-budget.component'; // Import the sibling component

import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  @ViewChild(GenerateBudgetComponent, { static: true }) // Initialize ViewChild in the constructor
  private generateBudgetComponent!: GenerateBudgetComponent; // Ensure it's initialized
  invoices: any[] = [];
  showDropdown: boolean = false;
  sortBy: string = 'default'; // Default sorting option
  filterButtonText: string = 'Filtros'; // Initialize filter button text




  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getInvoices();
  }

  getInvoices(): void {
    this.apiService.getInvoices().subscribe(
      (response: any[]) => {
        console.log('Respuesta del servicio:', response);
        this.invoices = response;
        this.sortInvoices(this.sortBy);
      },
      (error) => {
        console.error('Error al obtener la lista de inovoices:', error);
      }
    );


  } confirmDeleteInvoice(invoiceId: string): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta factura?');
    if (confirmDelete) {
      this.deleteInvoice(invoiceId);
    }
  }

  deleteInvoice(invoiceId: string): void {
    this.apiService.deleteInvoice(invoiceId).subscribe(
      () => {
        // Eliminar la factura de la lista localmente después de eliminarla del servidor
        this.invoices = this.invoices.filter(invoice => invoice.id !== invoiceId);
      },
      (error) => {
        console.error('Error al eliminar la factura:', error);
        alert('Hubo un error al eliminar la factura. Por favor, inténtalo de nuevo más tarde.');
      });
  }



  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
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
          console.log('Respuesta del servicio:', response);
          this.invoices = response;
          this.filterButtonText = 'Filtros'; // Update filter button text
        },
        (error) => {
          console.error('Error al obtener la lista de inovoices:', error);
        }
      );
    }
    this.showDropdown = false; // Close the dropdown after selecting an option
  }



  generatePDF(invoice: any): void {
    const doc = new jsPDF();

    autoTable(doc, {
      body: [
        [
          {
            content: 'Company brand',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff'
            }
          },
          {
            content: 'JOBMASTER', // Replace with your heading text
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff'
            }
          }
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#3366ff'
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: ` Data: ${new Date().toLocaleDateString()}`, // Assuming invoice.amount_due contains the amount due fetched from the database
            styles: {
            halign: 'left',
            fontSize: 20,

            }
          }
        ],

      ],
      theme: 'plain'
    });

    autoTable(doc, {
      body: [
        [
          {
            content: `Cliente:
            \n${invoice.clients.client_name}
            \n${invoice.clients.client_telephone}
            \n${invoice.clients.client_email}
            \n${invoice.clients.client_street}
            \n${invoice.clients.client_city}
            \n${invoice.clients.client_postal_code}`,
          },
          {
            content: `Empresa:
                  \n${invoice.companies.company_name}
                  \n${invoice.companies.company_telephone}
                  \n${invoice.companies.company_email}
                  \n${invoice.companies.company_street}
                  \n${invoice.companies.company_city}
                  \n${invoice.companies.company_postal_code}`,
          }
        ]
      ],
      theme: 'plain'
    });
    autoTable(doc, {
      body: [
        [
          {
            content: 'Amount due:',
            styles: {
              halign:'left',
              fontSize: 14
            }
          }
        ],
        [
          {
            content: ` ${invoice.total}€`, // Assuming invoice.amount_due contains the amount due fetched from the database
            styles: {
            halign: 'left',
            fontSize: 20,
            textColor: '#3366ff'
            }
          }
        ],

      ],
      theme: 'plain'
    });

    autoTable(doc, {
      body: [
        [
          {
            content: `Subtotal: ${invoice.subtotal}€`
          },
          {
            content: `Total: ${invoice.total}€`
          }
        ]
      ],
      theme: 'plain'
    });


     autoTable(doc, {
      body: [
        [
          {
            content: 'Products & Services',
            styles: {
              halign:'left',
              fontSize: 14
            }
          }
        ]
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      head: [['Concepto', 'Precio', 'Cantidad', 'Descuento', 'IVA', 'IRPF']],
      body: [

      ],
      theme: 'striped',
      headStyles:{
        fillColor: '#343a40'
      }
    });

    // Generate Base64 representation of the PDF
    const pdfDataUri = doc.output('datauristring');

    // Set iframe source to the Base64 representation of the PDF
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', pdfDataUri);
    iframe.setAttribute('style', 'width: 100%; height: 600px;'); // Adjust dimensions as needed

    // Open the PDF preview in a new window
    const previewWindow = window.open();
    if (previewWindow) {
      previewWindow.document.write(iframe.outerHTML);
    } else {
      alert('Please allow pop-ups for this site');
    }
  }

}
