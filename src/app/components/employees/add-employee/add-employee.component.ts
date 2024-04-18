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
      name: ['', [Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-Z]+$')]],
      surname: ['', [Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-Z]+$')]],
      date_of_birth: ['', [Validators.required,this.ageValidator]],
      country: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      street: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      postal_code: ['', [Validators.required, Validators.minLength(5),Validators.pattern('^[0-9]+$')]],
      nif: ['', [Validators.required, Validators.pattern('^[0-9]{8}[A-Za-z]$')]],
      photo: ['', [Validators.required, this.imageExtensionValidator]],
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
}
