import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employeeForm!: FormGroup;
  employeeDatos: any = {};
  showError: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    // Inicializa el formulario y define las reglas de validación
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      country: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, this.phoneNumberValidator()]],
      photo: ['', [Validators.required, this.imageExtensionValidator]],
      street: ['', Validators.required],
      number: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      nif: ['', Validators.required],
      password: ['', [Validators.required, this.passwordValidator]]
    });
  }

  addEmployee(): void {
    // Verifica si el formulario es válido

    if (this.employeeForm.invalid) {
      this.showError = true; // Mostrar el mensaje de error
      return; // Detener la ejecución del método si el formulario es inválido
    }
    if (this.employeeForm.valid) {
      // Si es válido, envía los datos del empleado
      this.apiService.addEmployees(this.employeeForm.value).subscribe(
        (response) => {
          console.log('Empleado agregado exitosamente:', response);
          // Navega a la vista de todos los empleados
          this.router.navigate(['/employees']);
        },
        (error) => {
          console.error('Error al agregar el empleado:', error);
        }
      );
    } else {
      // Si el formulario no es válido, muestra un mensaje de error o realiza otra acción
      console.log('El formulario no es válido. Por favor, completa todos los campos correctamente.');
    }
  }

  // Función de validación personalizada para la extensión de imagen
  imageExtensionValidator(control: any) {
    if (control.value) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.test(control.value)) {
        return { invalidImageExtension: true };
      }
    }
    return null;
  }


  // Función de validación personalizada para la contraseña
  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(control.value)) {
      return { 'invalidPassword': true };
    }
    return null;
  }

  // Función de validación del número de teléfono
  phoneNumberValidator(): Validators {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumberRegex = /^[679]{1}[0-9]{8}$/; // Expresión regular para validar números de teléfono españoles
      if (control.value && !phoneNumberRegex.test(control.value)) {
        return { 'invalidPhoneNumber': true };
      }
      return null;
    };
  }
}
