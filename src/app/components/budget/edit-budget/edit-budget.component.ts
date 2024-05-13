import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-edit-budget',
  templateUrl: './edit-budget.component.html',
  styleUrls: ['./edit-budget.component.css']
})
export class EditBudgetComponent implements OnInit {
  invoiceForm: FormGroup;
  invoiceId: number | null = null;
  showError: boolean = false;
  invoiceData: any;
  formModified: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.invoiceForm = this.formBuilder.group({
      client_name: ['', Validators.required],
      client_telephone: ['', Validators.required],
      client_nif: ['', Validators.required],
      client_email: ['', [Validators.required, Validators.email]],
      company_name: ['', Validators.required],
      company_telephone: ['', Validators.required],
      company_nif: ['', Validators.required],
      company_email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      invoice_discount: [null],
      invoice_iva: ['', Validators.required],
      invoice_irpf: [null],
      total: ['', Validators.required],
      concepts: this.formBuilder.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Convertir el parámetro de la URL a number
      if (!isNaN(id)) { // Verificar si la conversión fue exitosa
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
    this.apiService.getInvoiceById(this.invoiceId.toString()).subscribe(
      (data) => {
        this.invoiceData = data;
        if (this.invoiceData) {
          this.invoiceForm.patchValue({
            client_name: this.invoiceData.client_name || '',
            client_telephone: this.invoiceData.client_telephone || '',
            client_nif: this.invoiceData.client_nif || '',
            client_email: this.invoiceData.client_email || '',
            company_name: this.invoiceData.company_name || '',
            company_telephone: this.invoiceData.company_telephone || '',
            company_nif: this.invoiceData.company_nif || '',
            company_email: this.invoiceData.company_email || '',
            street: this.invoiceData.street || '',
            city: this.invoiceData.city || '',
            postal_code: this.invoiceData.postal_code || '',
            invoice_discount: this.invoiceData.invoice_discount || null,
            invoice_iva: this.invoiceData.invoice_iva || '',
            invoice_irpf: this.invoiceData.invoice_irpf || null,
            total: this.invoiceData.total || ''
          });

          // Limpia los controles de los conceptos para volver a cargarlos
          const conceptsFormArray = this.invoiceForm.get('concepts') as FormArray;
          conceptsFormArray.clear();

          // Recorre los conceptos de la factura y agrega dinámicamente los controles
          for (const concept of this.invoiceData.concepts) {
            conceptsFormArray.push(
              this.formBuilder.group({
                description: [concept.description, Validators.required],
                price: [concept.price, Validators.required],
                quantity: [concept.quantity, Validators.required],
                concept_discount: [concept.concept_discount],
                concept_iva: [concept.concept_iva],
                concept_irpf: [concept.concept_irpf]
                // Agrega más controles según los datos de tu concepto
              })
            );
          }
        } else {
          console.error('Datos de la factura no encontrados');
        }
      },
      (error) => {
        console.error('Error al cargar los datos de la factura:', error);
      }
    );
  }

  updateInvoice(): void {
    if (this.invoiceId === null) {
      console.error('No se ha proporcionado un ID de factura válido');
      return;
    }

    if (this.invoiceForm.valid) {
      // Si el formulario es válido, envía los datos actualizados de la factura
      this.apiService.updateInvoice(this.invoiceId, this.invoiceForm.value).subscribe(
        (response) => {
          this.router.navigate(['/budget']); // Redirige a la lista de facturas después de la actualización
        },
        (error) => {
          console.error('Error al actualizar la factura:', error);
        }
      );
    } else {
      console.error('El formulario de la factura no es válido');
    }
  }

  cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      this.router.navigate(['/budget']);
    }
  }

  // Define aquí las funciones de validación personalizadas según tus requisitos
}
