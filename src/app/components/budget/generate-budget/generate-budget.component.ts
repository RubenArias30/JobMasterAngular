import { Component,OnInit  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray  } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-budget',
  templateUrl: './generate-budget.component.html',
  styleUrls: ['./generate-budget.component.css']
})
export class GenerateBudgetComponent implements OnInit {
  budgetForm: FormGroup;

  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      client_telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      client_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      client_nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      company_name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      company_telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      company_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      company_nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      concepts: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Agrega un concepto por defecto al iniciar el componente
    this.addConcept();
  }

  // Método para obtener el control de concepts como FormArray
  get concepts() {
    return this.budgetForm.get('concepts') as FormArray;
  }

  // Método para agregar un nuevo concepto al FormArray
  addConcept(): void {
    const newConcept = this.fb.group({
      concept: ['', Validators.required], // Nombre del concepto
      price: ['', Validators.required],       // Precio
      quantity: ['', Validators.required],    // Cantidad
      concept_discount: [''],                          // Descuento (opcional)
      concept_iva: [''],                               // IVA (opcional)
      concept_irpf: ['']                               // IRPF (opcional)
    });
    this.concepts.push(newConcept);
  }

  // Método para eliminar un concepto del FormArray
  removeConcept(index: number): void {
    this.concepts.removeAt(index);
  }

  // Método para enviar el presupuesto al servidor
  addBudget(): void {
    console.log(this.budgetForm.value);

    // Llama al método del servicio API para crear el presupuesto con todos los datos
    this.apiService.createInvoice(this.budgetForm.value).subscribe(
      (response) => {
        console.log('Presupuesto creado exitosamente:', response);
        this.router.navigate(['/budget']);
      },
      (error) => {
        console.error('Error al crear el presupuesto:', error);
        // Podrías manejar el error aquí
      }
    );
  }
  cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      this.router.navigate(['/budget']);
    }
  }
}
