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

  // Controles para calcular los valores en tiempo real
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
    this.route.params.subscribe(params => {
      const id = +params['id']; // Convertir el parámetro de la URL a number
      if (!isNaN(id)) { // Verificar si la conversión fue exitosa
        this.budgetId = id;
        this.loadBudgetData();
      } else {
        console.error('ID de presupuesto no válido');
      }
    });
  }

  // Método para cargar los datos del presupuesto a editar
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

formatPostalCode(postalCode: string): string {
  if (postalCode && postalCode.length === 4 && postalCode.startsWith('0')) {
    return '0' + postalCode;
  }
  return postalCode;
}

  // Método para asignar los valores del presupuesto a los controles del formulario
  patchFormValues(): void {
    // Asignar valores a los campos del cliente
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

    // Asignar valores a los campos de la empresa
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



    // Asignar valores a los conceptos del formulario
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

    // Calcular los valores al cargar los datos del presupuesto
    this.calculateValues();

  }



  // Método para obtener el control de concepts como FormArray
  get concepts() {
    return this.budgetForm.get('concepts') as FormArray;
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

  // Método para enviar el presupuesto editado al servidor
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
      this.showError = true; // Mostrar el mensaje de error
      return; // Detener la ejecución del método si el formulario es inválido
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
