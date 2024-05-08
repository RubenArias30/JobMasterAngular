import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
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
  showError: boolean = false;

  // Controles para calcular los valores en tiempo real
  subtotal = new FormControl(0);
  invoice_discount = new FormControl(0);
  invoice_iva = new FormControl(0);
  invoice_irpf = new FormControl(0);
  total = new FormControl(0);

  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      client_telephone: ['', [Validators.required,  this.phoneNumberValidator()]],
      client_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      client_nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      client_street: ['', [Validators.required]],
      client_city: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      client_postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      company_name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      company_telephone: ['', [Validators.required,  this.phoneNumberValidator()]],
      company_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      company_nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      company_street: ['', [Validators.required]],
      company_city: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      company_postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      concepts: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Agrega un concepto por defecto al iniciar el componente
    this.addConcept();

    // Suscribirse a los cambios en el FormArray de conceptos
    this.concepts.valueChanges.subscribe(() => {
      this.calculateValues();
    });

    // Calcular los valores iniciales
    this.calculateValues();
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

  // Método para calcular todos los valores
  calculateValues(): void {
    const subtotal = this.calculateSubtotal();
    const totalDiscount = this.calculateTotalDiscount();
    const totalIVA = this.calculateTotalIVA();
    const totalIRPF = this.calculateTotalIRPF();
    const totalInvoice = this.calculateTotal(subtotal, totalDiscount, totalIVA, totalIRPF);

    this.subtotal.setValue(subtotal);
    this.invoice_discount.setValue(totalDiscount);
    this.invoice_iva.setValue(totalIVA);
    this.invoice_irpf.setValue(totalIRPF);
    this.total.setValue(totalInvoice);
  }

  // Método para calcular el subtotal
  calculateSubtotal(): number {
    let subtotal = 0;
    const concepts = this.concepts.value;
    concepts.forEach((concept: any) => {
      subtotal += concept.price * concept.quantity;
    });
    return subtotal;
  }

  // Método para calcular el descuento total
  calculateTotalDiscount(): number {
    let totalDiscount = 0;
    const concepts = this.concepts.value;
    concepts.forEach((concept: any) => {
      const discount = concept.concept_discount ? concept.concept_discount : 0;
      totalDiscount += (concept.price * concept.quantity * discount) / 100;
    });
    return totalDiscount;
  }

  // Método para calcular el IVA total
  calculateTotalIVA(): number {
    let totalIVA = 0;
    const concepts = this.concepts.value;
    concepts.forEach((concept: any) => {
      const iva = concept.concept_iva ? concept.concept_iva : 0;
      totalIVA += (concept.price * concept.quantity * iva) / 100;
    });
    return totalIVA;
  }

  // Método para calcular el IRPF total
  calculateTotalIRPF(): number {
    let totalIRPF = 0;
    const concepts = this.concepts.value;
    concepts.forEach((concept: any) => {
      const irpf = concept.concept_irpf ? concept.concept_irpf : 0;
      totalIRPF += ((concept.price * concept.quantity) - concept.concept_discount) * irpf / 100;
    });
    return totalIRPF;
  }

  // Método para calcular el total
  calculateTotal(subtotal: number, totalDiscount: number, totalIVA: number, totalIRPF: number): number {
    return subtotal - totalDiscount + totalIVA - totalIRPF;
  }

  // Método para enviar el presupuesto al servidor
  addBudget(): void {
    const formData = {
      ...this.budgetForm.value,
      subtotal: this.subtotal.value,
      invoice_discount: this.invoice_discount.value,
      invoice_iva: this.invoice_iva.value,
      invoice_irpf: this.invoice_irpf.value,
      total: this.total.value
    };

    console.log(formData);

    if (this.budgetForm.invalid) {
      this.showError = true; // Mostrar el mensaje de error
      return; // Detener la ejecución del método si el formulario es inválido
    }

    if (this.budgetForm.valid) {
       // Llama al método del servicio API para crear el presupuesto con todos los datos
    this.apiService.createInvoice(formData).subscribe(
      (response) => {
        console.log('Presupuesto creado exitosamente:', response);
        this.router.navigate(['/budget']);
      },
      (error) => {
        console.error('Error al crear el presupuesto:', error);
        // Podrías manejar el error aquí
      }
    );
    }else{
      console.log('El formulario no es válido. Por favor, completa todos los campos correctamente.');
    }

  }

  cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      this.router.navigate(['/budget']);
    }
  }
   // Función de validación del número de teléfono
   phoneNumberValidator(): Validators {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumberRegex = /^[679]{1}[0-9]{8}$/; // Expresión regular para validar números de teléfono
      if (control.value && !phoneNumberRegex.test(control.value)) {
        return { 'invalidPhoneNumber': true };
      }
      return null;
    };
  }
}
