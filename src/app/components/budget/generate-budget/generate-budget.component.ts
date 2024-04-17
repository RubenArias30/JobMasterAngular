import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-budget',
  templateUrl: './generate-budget.component.html',
  styleUrls: ['./generate-budget.component.css']
})
export class GenerateBudgetComponent {
  budgetForm!: FormGroup;
  conceptControls: FormGroup[] = [];

  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    // Inicializa el formulario y define las reglas de validación
    this.budgetForm = this.fb.group({
      name: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      nif: ['', Validators.required],
      concept: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      discount: ['', Validators.required],
      concept_iva: ['', Validators.required],
      concept_irpf: ['', Validators.required],
    });

    this.addNewConcept();
  }

  addBudget(): void {
    // Llamar al método del servicio para crear una factura
    this.apiService.createInvoice(this.budgetForm.value).subscribe(
      (response) => {
        // Manejar la respuesta si la factura se crea correctamente
        console.log('Factura creada exitosamente:', response);
        this.router.navigate(['/budget']);
      },
      (error) => {
        // Manejar el error si la creación de la factura falla
        console.error('Error al crear la factura:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    );
  }

  addNewConcept(): void {
    // Agregar un nuevo FormGroup para un concepto al arreglo
    const newConceptFormGroup = this.fb.group({
      concept: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      discount: ['', Validators.required],
      concept_iva: ['', Validators.required],
      concept_irpf: ['', Validators.required],
    });
    // if (this.conceptControls.length > 0) {
    //   const nextConceptIndex = this.conceptControls.length - 1;
    //   this.conceptControls[nextConceptIndex].reset();
    // }
    newConceptFormGroup.reset();
    this.conceptControls.push(newConceptFormGroup);
  }

  removeConcept(index: number): void {
    this.conceptControls.splice(index, 1);
  }

}
