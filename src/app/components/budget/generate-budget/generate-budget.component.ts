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

  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    // Inicializa el formulario y define las reglas de validación
    this.budgetForm = this.fb.group({
      client_name: ['', [Validators.required,Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      client_telephone: ['', [Validators.required,Validators.pattern('^[0-9]+$')]],
      client_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      client_nif: ['', [Validators.required,Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      client_street: ['', [Validators.required]],
      client_city: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      client_postal_code: ['', [Validators.required, Validators.minLength(5),Validators.pattern('^[0-9]+$')]],


      company_name: ['', [Validators.required,Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      company_telephone: ['', [Validators.required,Validators.pattern('^[0-9]+$')]],
      company_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      company_nif: ['', [Validators.required,Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]], 
      company_street: ['', [Validators.required]],
      company_city: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      company_postal_code: ['', [Validators.required, Validators.minLength(5),Validators.pattern('^[0-9]+$')]],
      concepts: this.fb.array([]) // No se inicializa con ningún concepto
    });

    // Agregar un concepto por defecto al cargar el componente
    this.addConcept();
  }

  // Método para agregar un concepto al formulario
  addConcept(): void {
    const concepts = this.budgetForm.get('concepts') as FormArray;
    concepts.push(this.fb.group({
      concept: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      concept_discount: ['', Validators.required],
      concept_iva: ['', Validators.required],
      concept_irpf: ['', Validators.required],
    }));
  }


  // Método para eliminar un concepto del formulario
  removeConcept(index: number): void {
    const concepts = this.budgetForm.get('concepts') as FormArray;
    concepts.removeAt(index);
  }

  // Método para enviar el presupuesto al servidor
  addBudget(): void {
    console.log(this.budgetForm.value)

    // Obtén los datos del formulario principal (datos del presupuesto)
    const budgetData = this.budgetForm.value;

    // Obtén los datos de los conceptos del formulario y agrégalos a los datos del presupuesto
    const concepts = this.budgetForm.get('concepts')!;
    budgetData.concepts = concepts ? concepts.value : [];

    // Llama al método del servicio API para crear el presupuesto con todos los datos
    this.apiService.createInvoice(budgetData).subscribe(
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
      // Si el usuario confirma la cancelación, redirige a la página de administración de empleados
      this.router.navigate(['/budget']);
    }
  }
  // Método para obtener los controles de los conceptos
  get conceptsControls() {
    return (this.budgetForm.get('concepts') as FormArray)?.controls;
  }
}