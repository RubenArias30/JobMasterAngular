import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.css']
})
export class AddDocumentsComponent {
  documentForm: FormGroup;
  employeeId: number | null = null; // Inicializa la propiedad con un valor seguro

  constructor(private apiService: ApiService, private fb: FormBuilder,private router: Router ,private route: ActivatedRoute) {
    this.documentForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator()]],
      file: ['', [Validators.required,this.fileExtensionValidator]]
    });

    // Obtén el ID del empleado de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
  }

  submitForm(): void {
    // Verifica si employeeId es null utilizando operador de coalescencia nula (??)
    const id = this.employeeId ?? -1; // Valor predeterminado en caso de que employeeId sea null

    this.addDocumentToEmployee(id, this.documentForm.value);
  }
  addDocumentToEmployee(employeeId: number, documentData: any): void {
    if (this.documentForm.invalid) {
      console.log('El formulario no es válido. Por favor, completa todos los campos correctamente.');
      return;
    }

    // Verifica si employeeId es null utilizando operador de coalescencia nula (??)
    const id = this.employeeId ?? -1; // Valor predeterminado en caso de que employeeId sea null

    // Agrega el ID del empleado al documento antes de enviarlo al servidor
    documentData = { ...this.documentForm.value, employee_id: id };

    this.apiService.addDocumentToEmployee(id, documentData).subscribe(
      (response) => {
        console.log('Documento agregado exitosamente:', response);
        // Navega a la vista de documentos o realiza otra acción si es necesario
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
      this.router.navigate(['/documents']);
    }
  }
}


