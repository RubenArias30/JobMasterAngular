import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray,FormControl  } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-budget',
  templateUrl: './generate-budget.component.html',
  styleUrls: ['./generate-budget.component.css']
})
export class GenerateBudgetComponent implements OnInit {
  budgetForm: FormGroup;
  canRemoveConcept = false;

   // Controles para calcular los valores en tiempo real
   subtotalControl = new FormControl(0);
   totalDiscountControl = new FormControl(0);
   totalIVAControl = new FormControl(0);
   totalIRPFControl = new FormControl(0);
   totalControl = new FormControl(0);

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

    this.budgetForm.valueChanges.subscribe(value => {
      const subtotal = this.calculateSubtotal(value);
      const totalDiscount = this.calculateTotalDiscount(value);
      const totalIVA = this.calculateTotalIVA(value);
      const totalIRPF = this.calculateTotalIRPF(value);
      const total = this.calculateTotal(subtotal, totalDiscount, totalIVA, totalIRPF);

      this.subtotalControl.setValue(subtotal);
      this.totalDiscountControl.setValue(totalDiscount);
      this.totalIVAControl.setValue(totalIVA);
      this.totalIRPFControl.setValue(totalIRPF);
      this.totalControl.setValue(total);
    });
  }

  // Método para obtener el control de concepts como FormArray
  get concepts() {
    return this.budgetForm.get('concepts') as FormArray;
  }

  // Método para agregar un nuevo concepto al FormArray
  addConcept(): void {
    const newConcept = this.fb.group({
      concept: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      concept_discount: [''],
      concept_iva: [''],
      concept_irpf: ['']
    });
    this.concepts.push(newConcept);

     // Verifica si hay más de una línea de concepto para habilitar la eliminación de la primera línea
  if (this.concepts.length > 1) {
    this.canRemoveConcept = true;
  }
  }

  // Método para eliminar un concepto del FormArray
  removeConcept(index: number): void {
    this.concepts.removeAt(index);

    // Verifica si solo queda una línea de concepto para deshabilitar la eliminación de la primera línea
    if (this.concepts.length === 1) {
      this.canRemoveConcept = false;
    }
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

  calculateSubtotal(value: any): number {
    let subtotal = 0;
    const concepts = value.concepts;
    concepts.forEach((concept: any) => {
      subtotal += concept.price * concept.quantity;
    });
    return subtotal;
  }

  calculateTotalDiscount(value: any): number {
    let totalDiscount = 0;
    const concepts = value.concepts;
    concepts.forEach((concept: any) => {
      const discount = concept.concept_discount ? concept.concept_discount : 0;
      totalDiscount += (concept.price * concept.quantity * discount) / 100;
    });
    return totalDiscount;
  }

  calculateTotalIVA(value: any): number {
    let totalIVA = 0;
    const concepts = value.concepts;
    concepts.forEach((concept: any) => {
      const iva = concept.concept_iva ? concept.concept_iva : 0;
      totalIVA += ((concept.price * concept.quantity) - concept.concept_discount) * iva / 100;
    });
    return totalIVA;
  }

  calculateTotalIRPF(value: any): number {
    let totalIRPF = 0;
    const concepts = value.concepts;
    concepts.forEach((concept: any) => {
      const irpf = concept.concept_irpf ? concept.concept_irpf : 0;
      totalIRPF += ((concept.price * concept.quantity) - concept.concept_discount) * irpf / 100;
    });
    return totalIRPF;
  }

  calculateTotal(subtotal: number, totalDiscount: number, totalIVA: number, totalIRPF: number): number {
    return subtotal - totalDiscount + totalIVA - totalIRPF;
  }


}
