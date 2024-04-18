import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-budget',
  templateUrl: './generate-budget.component.html',
  styleUrls: ['./generate-budget.component.css']
})
export class GenerateBudgetComponent {
  budgetForm: FormGroup;
  conceptControls: FormArray;

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
      concepts: this.fb.array([]) // Inicializando un FormArray vacío para los conceptos
    });

    // Obtén una referencia al FormArray de conceptos
    this.conceptControls = this.budgetForm.get('concepts') as FormArray;

    // Agrega un nuevo concepto al inicializar el componente
    this.addNewConcept();
  }

  // Método para agregar un presupuesto
  addBudget(): void {
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

  // Método para agregar un nuevo concepto al FormArray
  addNewConcept(): void {
    this.conceptControls.push(this.fb.group({
      concept: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      discount: ['', Validators.required],
      concept_iva: ['', Validators.required],
      concept_irpf: ['', Validators.required],
    }));
  }

  // Método para eliminar un concepto del FormArray
  removeConcept(index: number): void {
    this.conceptControls.removeAt(index);
  }
}
