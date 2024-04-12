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
}
confirmDeleteInvoice(invoicesId: string): void {
  // Mostrar un cuadro de diálogo de confirmación
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este empleado?');

  // Procesar la eliminación si el usuario confirma la acción
  if (confirmDelete) {
    this.deleteInvoice(invoicesId);
  }
}

deleteInvoice(invoicesId: string): void {
  this.apiService.deleteEmployee(invoicesId).subscribe(
    () => {
      // Eliminar el empleado de la lista localmente después de eliminarlo del servidor
      this.invoices = this.invoices.filter(invoices => invoices.id !== invoicesId);
    },
    (error) => {
      console.error('Error al eliminar el empleado:', error);
    }
  );
}
}


