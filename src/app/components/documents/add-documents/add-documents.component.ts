import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.css']
})
export class AddDocumentsComponent implements OnInit {
  documentForm: FormGroup;
  employeeId: number | null = null; // Inicializa la propiedad con un valor seguro
  showMissingFieldsError: boolean = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.documentForm = this.fb.group({
      type_documents: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator()]], 
      route: ['', [Validators.required, this.fileExtensionValidator]]
    });
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'] ? +params['employeeId'] : null;
    });
  }

  submitForm(): void {
    if (this.documentForm.invalid) {
      this.showMissingFieldsError = true; // Mostrar mensaje de error
      return;
    }
    this.showMissingFieldsError = false;

    this.apiService.addDocumentToEmployee(this.employeeId!, this.documentForm.value).subscribe(
      (response) => {
        console.log('Documento agregado exitosamente:', response);
        this.router.navigate(['/documents/details', this.employeeId]);
      },
      (error) => {
        console.error('Error al agregar el documento:', error);
      }
    );
  }



// Función para validar que la fecha no sea del pasado ni del futuro
dateValidator(): any {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    // Validación de fecha pasada
    if (selectedDate > currentDate) {
      return { 'invalidFutureDate': true };
    }

    // Validación de fecha futura
    if (selectedDate < oneYearAgo) {
      return { 'invalidPastDate': true };
    }

    return null;
  };
}


  // Función de validación personalizada para la extensión de imagen
  fileExtensionValidator(control: any) {
    if (control.value) {
      const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
      if (!allowedExtensions.test(control.value)) {
        return { invalidFileExtension: true };
      }
    }
    return null;
  }
  cancelbutton(): void {
    if (confirm('¿Estás seguro de cancelar la operacion?')) {
      // Si el usuario confirma la cancelación, redirige a la página de administración de empleados
      this.router.navigate(['/documents/details', this.employeeId]);
    }
  }
}


