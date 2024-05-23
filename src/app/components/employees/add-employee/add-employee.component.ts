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


   /**
   * Constructor of the component.
   * @param apiService - API service to interact with the backend.
   * @param router - Routing service for navigation.
   * @param fb - Form builder to create instances of FormGroup.
   */
  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    // Initialize the form and define validation rules
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

    // Subscribe to changes in the NIF field
    this.employeeForm.get('nif')?.valueChanges.subscribe(() => {
      this.errorMessage = ''; // Hide error message when NIF changes
    });
  }

  /**
   * Function to handle image upload.
   * @param event - File upload event.
   */
  imageUpload(event: any) {
    //console.log(event)
    this.file = event.target.files[0];
  }

  /**
   * Function to add a new employee.
   */
  addEmployee(): void {
    if (this.employeeForm.invalid) {
      this.showError = true;
      return;
    }

    const formData = new FormData();
    formData.append('photo', this.file);

    const employeeData = this.employeeForm.value;

   // Create Employee object
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
      new User(
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

     // Append employee data to form data
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

    // Check if NIF already exists
    if (employee.users && employee.users.nif) {
      this.apiService.checkNifExists(employee.users.nif).subscribe(
        (exists) => {
          if (exists) {
            this.errorMessageNif = 'El NIF ya existe. Por favor, ingresa un NIF diferente.';
            this.showError = true;
          } else {
           // Add employee if NIF does not exist
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

     // Subscribe to changes in the NIF field
      this.employeeForm.get('nif')?.valueChanges.subscribe(() => {
        this.errorMessageNif = ''; // Hide NIF error message when value changes
      });
    }
  }

  /**
   * Function to open the modal dialog.
   */
  openModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

    /**
   * Function to close the modal dialog.
   */
  closeModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

    /**
   * Function to confirm cancellation of editing.
   */
  confirmCancelEdit(): void {
    this.closeModal();
    this.router.navigate(['/employees']);
  }


  /**
   * Custom validation function for image extension.
   * @param control - Form control for image upload.
   * @returns Validation result.
   */
  imageExtensionValidator(control: any) {
    if (control.value) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.test(control.value)) {
        return { invalidImageExtension: true };
      }
    }
    return null;
  }

  /**
   * Custom validation function for password.
   * @param control - Form control for password.
   * @returns Validation result.
   */
  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(control.value)) {
      return { 'invalidPassword': true };
    }
    return null;
  }

    /**
   * Custom validation function for age and date of birth.
   * @param control - Form control for date of birth.
   * @returns Validation result.
   */
  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const dob = new Date(control.value);
    const today = new Date();

    // Calculate the age of the employee
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Check if the age is under 18 or if the date is in the future
    if (age < 18 || dob >= today) {
      return { 'invalidAgeOrDate': true };
    }

    // Check if the date of birth is older than 70 years from today
    const maxAllowedDate = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());
    if (dob < maxAllowedDate) {
      return { 'invalidDateInThePast': true };
    }

    return null;
  }

   /**
   * Custom validation function for phone number.
   * @returns Validation result.
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

   /**
   * Function to toggle password visibility.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
