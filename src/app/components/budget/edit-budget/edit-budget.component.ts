import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-edit-budget',
  templateUrl: './edit-budget.component.html',
  styleUrls: ['./edit-budget.component.css']
})
export class EditBudgetComponent implements OnInit {
  invoiceForm: FormGroup;
  invoiceId: string | null = null;
  showError: boolean = false;
  invoiceData: any;
  formModified: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService // Asegúrate de importar el servicio correcto
  ) {
    this.invoiceForm = this.formBuilder.group({
      // Define aquí los campos del formulario de la factura y las validaciones necesarias
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.formModified = true;
        this.invoiceId = id;
        this.loadInvoiceData();
      } else {
        console.error('ID de factura no válido');
      }
    });
  }

  loadInvoiceData(): void {
    if (!this.invoiceId) {
      console.error('No se ha proporcionado un ID de factura válido');
      return;
    }
    this.apiService.getInvoiceById(this.invoiceId).subscribe(
      (data) => {
        this.invoiceData = data;
        if (this.invoiceData) {
          // Cargar datos de la factura en el formulario
          this.invoiceForm.patchValue({
            // Asigna los valores correspondientes a los campos del formulario según la estructura de tu factura
          });
        } else {
          console.error('Datos de la factura no encontrados');
        }
      },
      (error) => {
        console.error('Error al cargar los datos de la factura:', error);
      }
    );
  }

  // updateInvoice(): void {
  //   if (!this.invoiceId) {
  //     console.error('No se ha proporcionado un ID de factura válido');
  //     return;
  //   }

  //   if (this.invoiceForm.valid) {
  //     // Si el formulario es válido, envía los datos actualizados de la factura
  //     this.apiService.updateInvoice(this.invoiceId, this.invoiceForm.value).subscribe(
  //       (response) => {
  //         console.log('Factura actualizada exitosamente:', response);
  //         this.router.navigate(['/budget']); // Redirige a la lista de facturas después de la actualización
  //       },
  //       (error) => {
  //         console.error('Error al actualizar la factura:', error);
  //       }
  //     );
  //   } else {
  //     console.error('El formulario de la factura no es válido');
  //   }
  // }

  cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      this.router.navigate(['/budget']);
    }
  }

  // Define aquí las funciones de validación personalizadas según tus requisitos
}
