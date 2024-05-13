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
                content: 'JOBMASTER PRESUPUESTO',
                colSpan: 2,
                styles: {
                    halign: 'center',
                    fontSize: 20,
                    textColor: '#000000', // Adjust text color for better visibility
                },
            },
        ],

    ],
    theme: 'plain',
    styles: {
        fillColor: '#ffffff', // Set the background color of the heading
        lineColor: '#000000', // Set the border color
        lineWidth: 0.1, // Set border width
        font: 'helvetica', // Set font family
    },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: `Datos del cliente:\nNombre: ${invoice.clients.client_name}\nTeléfono:${invoice.clients.client_telephone}\nEmail:${invoice.clients.client_email}\nDirección:${invoice.clients.client_street}\nCiudad:${invoice.clients.client_city}\nCódigo Postal:${invoice.clients.client_postal_code}`,
            styles: {
              // fillColor: '#F2F2F2', // Light gray background
              textColor: '#333333', // Dark gray text color
              fontStyle: 'bold', // Bold font for header
              fontSize: 10, // Font size
              cellPadding: 6, // Padding
              // lineWidth: 0.5, // Grid line width
            }
          },
          {
            content: `Datos de la empresa:\nNombre:${invoice.companies.company_name}\nTeléfono${invoice.companies.company_telephone}\nEmail:${invoice.companies.company_email}\nDirección:${invoice.companies.company_street}\nCiudad:${invoice.companies.company_city}\nCódigo Postal:${invoice.companies.company_postal_code}`,
            styles: {
              // fillColor: '#E8E8E8', // Lighter gray background
              textColor: '#333333', // Dark gray text color
              fontStyle: 'bold', // Bold font for header
              fontSize: 10, // Font size
              cellPadding: 6, // Padding
              // lineWidth: 0.5, // Grid line width
            }
          }
        ]
      ],
      theme: 'grid', // Apply grid theme
    });


    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: `Subtotal: ${invoice.subtotal}€`
    //       },
    //       {
    //         content: `Total: ${invoice.total}€`
    //       }
    //     ]
    //   ],
    //   theme: 'plain'
    // });


     autoTable(doc, {
      body: [
        [
          {
            content: 'Conceptos y información',
            styles: {
              halign:'left',
              fontSize: 14,
              fontStyle: 'bold', // Bold font for header


            }
          }
        ]
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      head: [['Concepto', 'Precio', 'Cantidad', 'Descuento', 'IVA', 'IRPF']],
      body: [
        [invoice.concepts.concepts, invoice.price,invoice.quantity,invoice.invoice_discount,invoice.invoice_iva,invoice.invoice_irpf, /* Add more data here if needed */]

      ],
      theme: 'striped',
      headStyles:{
        fillColor: '#343a40'
      }
    });
    autoTable(doc, {
      body: [
        [
          {
            content: 'Total:',
            styles: {
              halign:'right',
              fontSize: 14,
              fontStyle: 'bold', // Bold font for header

            }
          }
        ],
        [
          {
            content: ` ${invoice.total}€`, // Assuming invoice.amount_due contains the amount due fetched from the database
            styles: {
            halign: 'right',
            fontSize: 20,
            textColor: '#3366ff'
            }
          }
        ],
        [
          {
            content: ` Fecha: ${new Date().toLocaleDateString()}`, // Assuming invoice.amount_due contains the amount due fetched from the database
            styles: {
              halign:'right'
            }
          }
        ],


      ],
      theme: 'plain'
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

