import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/models/adress.model';
import { Employee } from 'src/app/models/employee.model';
import { User } from 'src/app/models/user.model';
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
  errorMessageNif: string = '';
  showPassword: boolean = false;
  file: any;


  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    // Inicializa el formulario y define las reglas de validación
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      surname: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      date_of_birth: ['', [Validators.required, this.ageValidator]],
      country: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\' ]+$')]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      telephone: ['', [Validators.required, this.phoneNumberValidator()]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\' ]+$')]],
      postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      photo: [null, [Validators.required, this.imageExtensionValidator]],
      password: ['', [Validators.required, this.passwordValidator]]
    });

    // Suscribirse a los cambios en el campo de NIF
    this.employeeForm.get('nif')?.valueChanges.subscribe(() => {
      // Al cambiar el valor del campo de NIF, ocultar el mensaje de error
      this.errorMessage = '';
    });
  }

  imageUpload(event: any) {
    //console.log(event)
    this.file = event.target.files[0];
  }



  addEmployee(): void {
    if (this.employeeForm.invalid) {
      this.showError = true;
      return;
    }

    const formData = new FormData();
    formData.append('photo', this.file);

    const employeeData = this.employeeForm.value;

  // Crear el objeto Employee
  const employee = new Employee(
    0,
    employeeData.name,
    employeeData.surname,
    employeeData.email,
    employeeData.telephone,
    employeeData.country,
    employeeData.gender,
    employeeData.date_of_birth,
    '',
    new User (
      0,
      employeeData.nif,
      employeeData.password,
      'empleado'

    ),
   new Address(
    0,
    employeeData.street,
    employeeData.city,
    employeeData.postal_code
   )
  );

    formData.append('name', employee.name);
    formData.append('surname', employee.surname);
    formData.append('date_of_birth', employee.date_of_birth);
    formData.append('country', employee.country);
    formData.append('gender', employee.gender);
    formData.append('email', employee.email);
    formData.append('telephone', employee.telephone);
    formData.append('street', employee.addresses?.street || '');
    formData.append('city', employee.addresses?.city || '');
    formData.append('postal_code', (employee.addresses && employee.addresses.postal_code)?.toString() || '');
    formData.append('nif', employee.users?.nif || '');
    formData.append('password', employee.users?.password || '');

    // Verificar si el NIF ya existe
    if (employee.users && employee.users.nif) {
      this.apiService.checkNifExists(employee.users.nif).subscribe(

      (exists) => {
        if (exists) {
          this.errorMessageNif = 'El NIF ya existe. Por favor, ingresa un NIF diferente.';
          this.showError = true;
        } else {
          // El NIF no existe, agregar el empleado
          this.apiService.addEmployees(formData).subscribe(
            (response) => {
              this.router.navigate(['/employees']);
            },
            (error) => {
              console.error('Error al agregar el empleado:', error);
              if (error.status === 500) {
                this.errorMessage = 'Error 500 - Error interno del servidor';
              } else {
                this.errorMessage = 'Se produjo un error al agregar el empleado. Por favor, inténtelo de nuevo más tarde.';
              }
              this.showError = true;
            }
          );
        }
      },
      (error) => {
        console.error('Error al verificar el NIF:', error);
        this.errorMessage = 'Se produjo un error al verificar el NIF. Por favor, inténtelo de nuevo más tarde.';
        this.showError = true;
      }
    );

    // Suscribirse a los cambios en el campo de NIF
    this.employeeForm.get('nif')?.valueChanges.subscribe(() => {
      // Al cambiar el valor del campo de NIF, ocultar el mensaje de error
      this.errorMessageNif = '';
    });
  }
}





  // cancelEdit(): void {
  //   if (confirm('¿Estás seguro de cancelar la edición?')) {
  //     // Si el usuario confirma la cancelación, redirige a la página de administración de empleados
  //     this.router.navigate(['/employees']);
  //   }
  // }

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
    this.router.navigate(['/employees']);
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
