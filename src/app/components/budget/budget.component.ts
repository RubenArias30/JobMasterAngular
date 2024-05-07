import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

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




}

