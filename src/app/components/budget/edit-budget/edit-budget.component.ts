import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-budget',
  templateUrl: './edit-budget.component.html',
  styleUrls: ['./edit-budget.component.css']
})
export class EditBudgetComponent implements OnInit {
  budgetForm: FormGroup;
  canRemoveConcept = false;
  showError: boolean = false;
  budgetId: number | null = null;
  budgetData: any;

    // Controls for real-time value calculations
  subtotal = new FormControl(0);
  invoice_discount = new FormControl(0);
  invoice_iva = new FormControl(0);
  invoice_irpf = new FormControl(0);
  total = new FormControl(0);

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.budgetForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      client_telephone: ['', [Validators.required, this.phoneNumberValidator()]],
      client_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      client_nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      client_street: ['', [Validators.required]],
      client_city: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\' ]+$')]],
      client_postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      company_name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      company_telephone: ['', [Validators.required, this.phoneNumberValidator()]],
      company_email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      company_nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      company_street: ['', [Validators.required]],
      company_city: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\' ]+$')]],
      company_postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      concepts: this.fb.array([])
    });
  }

  ngOnInit(): void {
     // Subscribe to route params to get the budget ID
    this.route.params.subscribe(params => {
      const id = +params['id']; // Convert the URL parameter to a number
      if (!isNaN(id)) { // Check if conversion was successful
        this.budgetId = id;
        this.loadBudgetData();
      } else {
        console.error('ID de presupuesto no válido');
      }
    });
  }

 /**
   * Loads the budget data for editing.
   */
  loadBudgetData(): void {
    if (!this.budgetId) {
      console.error('No se ha proporcionado un ID de presupuesto válido');
      return;
    }
    this.apiService.getInvoiceById(this.budgetId.toString()).subscribe(
      (data) => {
        console.log(data)
        this.budgetData = data;
        if (this.budgetData) {
          this.patchFormValues();
        } else {
          console.error('Datos del presupuesto no encontrados');
        }
      },
      (error) => {
        console.error('Error al cargar los datos del presupuesto:', error);
      }
    );
  }

    /**
   * Formats the postal code.
   * @param postalCode The postal code to format.
   * @returns The formatted postal code.
   */
  formatPostalCode(postalCode: string): string {
  if (postalCode && postalCode.length === 4 && postalCode.startsWith('0')) {
    return '0' + postalCode;
  }
  return postalCode;
}

  /**
   * Assigns budget data values to form controls.
   */  
  patchFormValues(): void {
    // Assign values to client fields
    const clientData = this.budgetData.clients;
    this.budgetForm.patchValue({
      client_name: clientData.client_name || '',
      client_telephone: clientData.client_telephone || '',
      client_email: clientData.client_email || '',
      client_nif: clientData.client_nif || '',
      client_street: clientData.client_street || '',
      client_city: clientData.client_city || '',
      client_postal_code: clientData.client_postal_code && clientData.client_postal_code.toString().length === 4 ? '0' + clientData.client_postal_code : clientData.client_postal_code || ''
    });

    // Assign values to company fields
    const companyData = this.budgetData.companies;
    this.budgetForm.patchValue({
      company_name: companyData.company_name || '',
      company_telephone: companyData.company_telephone || '',
      company_email: companyData.company_email || '',
      company_nif: companyData.company_nif || '',
      company_street: companyData.company_street || '',
      company_city: companyData.company_city || '',
      company_postal_code: companyData.company_postal_code && companyData.company_postal_code.toString().length === 4 ? '0' + companyData.company_postal_code : companyData.company_postal_code || ''
    });

   // Assign values to form concepts
    const conceptsArray = this.budgetForm.get('concepts') as FormArray;
    conceptsArray.clear();
    this.budgetData.concepts.forEach((concept: any) => {
      conceptsArray.push(
        this.fb.group({
          concept: [concept.concept || '', Validators.required],
          price: [concept.price || '', Validators.required],
          quantity: [
            concept.quantity || '', Validators.required],
          concept_discount: [concept.concept_discount || 0],
          concept_iva: [concept.concept_iva || 0],
          concept_irpf: [concept.concept_irpf || 0]
        })
      );
    });

    // Calculate values when loading budget data
    this.calculateValues();

  }

  /**
   * Gets the control of concepts as FormArray.
   */
    get concepts() {
    return this.budgetForm.get('concepts') as FormArray;
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
   * Updates the edited budget on the server.
   */
    updateBudget(): void {
    if (this.budgetId === null) {
      console.error('No se ha proporcionado un ID de presupuesto válido');
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

    this.apiService.updateBudget(this.budgetId, formData).subscribe(
      (response) => {
        this.router.navigate(['/budget']);
      },
      (error) => {
        console.error('Error al actualizar el presupuesto:', error);
      }
    );
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
   * Phone number validation function.
   * @returns A validator function for phone numbers.
   */

  // Method to cancel the edit process
  // cancelEdit(): void {
  //   if (confirm('¿Estás seguro de cancelar la edición?')) {
  //     this.router.navigate(['/budget']);
  //   }
  // }

  // Method to cancel the edit
  openModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  confirmCancelEdit(): void {
    this.closeModal();
    this.router.navigate(['/budget']);
  }


   // Phone number validation function
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
