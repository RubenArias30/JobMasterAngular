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
  showError: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    // Inicializa el formulario y define las reglas de validación
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      surname: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      date_of_birth: ['', [Validators.required, this.ageValidator]],
      country: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      telephone: ['', [Validators.required, this.phoneNumberValidator()]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      photo: ['', [Validators.required, this.imageExtensionValidator]],
      password: ['', [Validators.required, this.passwordValidator]]
    });

    // Suscribirse a los cambios en el campo de NIF
    this.employeeForm.get('nif')?.valueChanges.subscribe(() => {
      // Al cambiar el valor del campo de NIF, ocultar el mensaje de error
      this.errorMessage = '';
    });
  }

  addEmployee(): void {
    if (this.employeeForm.invalid) {
      this.showError = true;
      return;
    }

    this.apiService.addEmployees(this.employeeForm.value).subscribe(
      (response) => {
        console.log('Empleado agregado exitosamente:', response);
        this.router.navigate(['/employees']);
      },
      (error) => {
        console.error('Error al agregar el empleado:', error);
        if (error.status === 500) {
          this.errorMessage = 'Ya existe un empleado con este NIF. Por favor, intente con otro NIF.';
        } else {
          this.errorMessage = 'Se produjo un error al agregar el empleado. Por favor, inténtelo de nuevo más tarde.';
        }
        this.showError = true;
      }
    );
  }


  cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      // Si el usuario confirma la cancelación, redirige a la página de administración de empleados
      this.router.navigate(['/employees']);
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

  // Función de validación personalizada para verificar la edad mínima y la fecha futura
  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const dob = new Date(control.value);
    const today = new Date();

    // Calcula la edad del empleado
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Verifica si la edad es menor de 18 años o si la fecha es en el futuro
    if (age < 18 || dob >= today) {
      return { 'invalidAgeOrDate': true };
    }

    // Verifica si la fecha de nacimiento es anterior a 70 años desde hoy
    const maxAllowedDate = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());
    if (dob < maxAllowedDate) {
      return { 'invalidDateInThePast': true };
    }

    return null;
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
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
