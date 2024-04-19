import { Component } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-budget',
  templateUrl: './generate-budget.component.html',
  styleUrls: ['./generate-budget.component.css']
})
export class GenerateBudgetComponent {
  // Variables para almacenar los datos del formulario
  name: string = '';
  telephone: string = '';
  nif: string = '';
  email: string = '';
  concept: string = '';
  price: number = 0;
  quantity: number = 0;
  discount: number = 0;
  concept_iva: number = 0;
  concept_irpf: number = 0;
  subtotal: number = 0;
  invoice_iva: number = 0;
  invoice_irpf: number = 0;
  total: number = 0;

  constructor
  (private apiService: ApiService,
  private router: Router,

  ) { }

  // Método para enviar los datos del formulario y crear una factura
  onSubmit() {
    const invoiceData = {
      name: this.name,
      telephone: this.telephone,
      nif: this.nif,
      email: this.email,
      concept: this.concept,
      price: this.price,
      quantity: this.quantity,
      discount: this.discount,
      concept_iva: this.concept_iva,
      concept_irpf: this.concept_irpf,
      subtotal: this.subtotal,
      invoice_iva: this.invoice_iva,
      invoice_irpf: this.invoice_irpf,
      total: this.total
    };

    // Llamar al método del servicio para crear una factura
    this.apiService.createInvoice(invoiceData).subscribe(
      (response) => {
        // Manejar la respuesta si la factura se crea correctamente
        console.log('Factura creada exitosamente:', response);
        // Aquí podrías redirigir a otra página o mostrar un mensaje de éxito
      },
      (error) => {
        // Manejar el error si la creación de la factura falla
        console.error('Error al crear la factura:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }
  cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      // Si el usuario confirma la cancelación, redirige a la página de administración de empleados
      this.router.navigate(['/budget']);
    }
  }

}
