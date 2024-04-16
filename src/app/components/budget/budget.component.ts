import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit{

invoices: any[] = [];
constructor(private apiService: ApiService){}

ngOnInit(): void {
  this.getInvoices();
}
getInvoices(): void {
  this.apiService.getInvoices().subscribe(
    (response: any[]) => {
      console.log('Respuesta del servicio:', response);
      this.invoices = response;
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

}

