import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
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
  showErrorInvalid: boolean = false;

  // Controls for real-time value calculations
  subtotal = new FormControl(0);
  invoice_discount = new FormControl(0);
  invoice_iva = new FormControl(0);
  invoice_irpf = new FormControl(0);
  total = new FormControl(0);

  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    this.budgetForm = this.fb.group({
       // Define the validation of the form
      client_name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      client_telephone: ['', [Validators.required,  this.phoneNumberValidator()]],
      client_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      client_nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      client_street: ['', [Validators.required]],
      client_city: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\' ]+$')]],
      client_postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      company_name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      company_telephone: ['', [Validators.required,  this.phoneNumberValidator()]],
      company_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      company_nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      company_street: ['', [Validators.required]],
      company_city: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\' ]+$')]],
      company_postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      concepts: this.fb.array([], [Validators.required])
    });
  }

  ngOnInit(): void {
     // Add a default concept when initializing the component
    this.addConcept();

     // Subscribe to changes in the FormArray of concepts
    this.concepts.valueChanges.subscribe(() => {
      this.calculateValues();
    });

    // Calculate initial values
    this.calculateValues();
  }

  /**
   * Gets the control of concepts as FormArray.
   * @returns The FormArray control of concepts.
   */
    get concepts() {
    return this.budgetForm.get('concepts') as FormArray;
  }

 /**
   * Adds a new concept to the FormArray.
   */
    addConcept(): void {
    const newConcept = this.fb.group({
      concept: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      concept_discount: [''],
      concept_iva: [21],
      concept_irpf: ['']
    });
    this.concepts.push(newConcept);

   // Check if there is more than one line of concept to enable the deletion of the first line
    if (this.concepts.length > 1) {
      this.canRemoveConcept = true;
    }
  }

/**
   * Removes a concept from the FormArray.
   * @param index The index of the concept to remove.
   */
    removeConcept(index: number): void {
    this.concepts.removeAt(index);

    // Check if only one line of concept remains to disable the deletion of the first line
    if (this.concepts.length === 1) {
      this.canRemoveConcept = false;
    }
  }

  /**
   * Calculates all values.
   */
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

  /**
   * Calculates the subtotal.
   * @returns The calculated subtotal.
   */
    calculateSubtotal(): number {
    let subtotal = 0;
    const concepts = this.concepts.value;
    concepts.forEach((concept: any) => {
      subtotal += concept.price * concept.quantity;
    });
    return subtotal;
  }

 /**
   * Calculates the total discount.
   * @returns The calculated total discount.
   */
    calculateTotalDiscount(): number {
    let totalDiscount = 0;
    const concepts = this.concepts.value;
    concepts.forEach((concept: any) => {
      const discount = concept.concept_discount ? concept.concept_discount : 0;
      totalDiscount += (concept.price * concept.quantity * discount) / 100;
    });
    return totalDiscount;
  }

  /**
   * Calculates the total IVA.
   * @returns The calculated total IVA.
   */
    calculateTotalIVA(): number {
    let totalIVA = 0;
    const concepts = this.concepts.value;
    concepts.forEach((concept: any) => {
      const iva = concept.concept_iva ? concept.concept_iva : 0;
      totalIVA += (concept.price * concept.quantity * iva) / 100;
    });
    return totalIVA;
  }

  /**
   * Calculates the total IRPF.
   * @returns The calculated total IRPF.
   */
    calculateTotalIRPF(): number {
    let totalIRPF = 0;
    const concepts = this.concepts.value;
    concepts.forEach((concept: any) => {
      const irpf = concept.concept_irpf ? concept.concept_irpf : 0;
      totalIRPF += ((concept.price * concept.quantity) - concept.concept_discount) * irpf / 100;
    });
    return totalIRPF;
  }

/**
   * Calculates the total.
   * @param subtotal The subtotal value.
   * @param totalDiscount The total discount value.
   * @param totalIVA The total IVA value.
   * @param totalIRPF The total IRPF value.
   * @returns The calculated total.
   */
    calculateTotal(subtotal: number, totalDiscount: number, totalIVA: number, totalIRPF: number): number {
    return subtotal - totalDiscount + totalIVA - totalIRPF;
  }

 /**
   * Sends the budget to the server.
   */
    addBudget(): void {

    if (this.budgetForm.invalid) {
      this.showErrorInvalid = true;
      return;
    }
    const formData = {
      ...this.budgetForm.value,
      subtotal: this.subtotal.value,
      invoice_discount: this.invoice_discount.value,
      invoice_iva: this.invoice_iva.value,
      invoice_irpf: this.invoice_irpf.value,
      total: this.total.value
    };


    if (this.budgetForm.invalid) {
      this.showError = true; // Show error message
      return; // Stop method execution if the form is invalid
    }

    if (this.budgetForm.valid) {
       // Call the API service method to create the budget with all the data
    this.apiService.createInvoice(formData).subscribe(
      (response) => {
        this.router.navigate(['/budget']);
      },
      (error) => {
        console.error('Error al crear el presupuesto:', error);
      }
    );
    }else{
      console.log('El formulario no es válido. Por favor, completa todos los campos correctamente.');
    }

  }

    /**
   * Cancels the edit process.
   */
    cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      this.router.navigate(['/budget']);
    }
  }
  /**
   * Validates the phone number.
   * @returns The phone number validator.
   */
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
