import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: any;
  showError: boolean = false;
  showErrorInvalid: boolean = false;
  employeeData: any;
  formModified: boolean = false;
  updateError: boolean = false;
  errorMessage: string = '';
  file!: File | null;
  selectedFileName: string | null = null;
  selectedImageUrl: string | null = null;
  errorMessageNif: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
     // Initialize the form and define validation rules
    this.employeeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      surname: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      date_of_birth: ['', [Validators.required, this.ageValidator]],
      country: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\' ]+$')]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\' ]+$')]],
      postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]+$')]],
      nif: ['', [Validators.required, Validators.pattern('^(?=.*[XYZ0-9])[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$')]],
      photo: [null, [this.imageExtensionValidator]],

    });

    // Subscribe to changes in the NIF field
    this.employeeForm.get('nif')?.valueChanges.subscribe(() => {
      this.errorMessage = '';  // Hide error message when NIF field value changes
    });
  }

  ngOnInit(): void {
    // Subscribe to route parameters to get employee ID
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.formModified = true;
        this.employeeId = id;
        this.loadEmployeeData();
      } else {
        console.error('ID de empleado no válido');
      }
    });
  }

   /**
   * Load employee data from the API.
   */
  loadEmployeeData(): void {
    if (this.employeeId === null) {
      console.error('No se ha proporcionado un ID de empleado válido');
      return;
    }
    this.apiService.getEmployeeById(this.employeeId).subscribe(
      (data) => {
        this.employeeData = data;

        if (this.employeeData) {
          const addressData = this.employeeData.addresses;
          if (addressData) {
            this.employeeForm.patchValue({
              street: addressData.street || '',
              city: addressData.city || '',
              postal_code: addressData.postal_code && addressData.postal_code.toString().length === 4 ? '0' + addressData.postal_code : addressData.postal_code || ''
            });
          }

          const userData = this.employeeData.users;
          if (userData) {
            this.employeeForm.patchValue({
              nif: userData.nif || '',
            });
          }

          this.employeeForm.patchValue({
            name: this.employeeData.name || '',
            surname: this.employeeData.surname || '',
            date_of_birth: this.employeeData.date_of_birth || '',
            country: this.employeeData.country || '',
            gender: this.employeeData.gender || '',
            email: this.employeeData.email || '',
            telephone: this.employeeData.telephone || '',
          });

          if (this.employeeData.photo) {
            this.selectedImageUrl = this.employeeData.photo;
          }
        } else {
          console.error('Datos del empleado no encontrados');
        }
      },
      (error) => {
        console.error('Error al cargar los datos del empleado:', error);
      }
    );
  }

    /**
   * Handler for file selection.
   * @param event - File selection event.
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      this.selectedFileName = file.name;
      this.previewImage(file);
    }
  }

    /**
   * Preview selected image.
   * @param file - Selected image file.
   */
  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Update employee data.
   */
  updateEmployee(): void {
      // Check if a valid employee ID is provided
    if (this.employeeId === null) {
      console.error('No se ha proporcionado un ID de empleado válido.');
      return;
    }

    // Check if form is valid
    if (this.employeeForm.invalid) {
      this.showErrorInvalid = true;
      return;
    }

     // Check if the NIF has changed
    const originalNif = this.employeeData ? this.employeeData.users.nif : '';
    const newNif = this.employeeForm.value.nif;

    if (newNif !== originalNif) {
     // The NIF has changed, check if it already exists in the database
      this.apiService.checkNifExists(newNif).subscribe(
        (exists) => {
          if (exists) {
            this.errorMessageNif = 'Ya existe un empleado con este NIF. Por favor, intente con otro NIF.';
          } else {
            // The NIF does not exist, proceed with employee update
            this.updateEmployeeData();
          }
        },
        (error) => {
          console.error('Error al verificar el NIF:', error);
          this.errorMessage = 'Se produjo un error al verificar el NIF. Por favor, inténtelo de nuevo más tarde.';
        }
      );
    } else {
      // The NIF has not changed, proceed with employee update without checking the NIF
      this.updateEmployeeData();
    }
  }

    /**
   * Update employee data after validation.
   */
  updateEmployeeData(): void {
    // Proceed with updating employee data
    this.apiService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe(
      (response) => {
        console.log(response)
        this.updateError = false;
        this.errorMessage = '';
        this.router.navigate(['/employees']);
      },
      (error) => {
        console.error('Error al actualizar el empleado:', error);
        if (error.status === 500) {
          this.errorMessage = 'Se produjo un error interno del servidor al actualizar el empleado.';
        } else {
          this.errorMessage = 'Se produjo un error al actualizar el empleado. Por favor, inténtelo de nuevo más tarde.';
        }
        this.updateError = true;
      }
    );
  }

   /**
   * Update employee photo.
   */
  updatePhoto(): void {
    if (!this.file || !this.employeeId) {
      console.error('No se ha proporcionado un archivo o ID de empleado válido.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', this.file);

    this.apiService.updateEmployeePhoto(this.employeeId, formData)
      .subscribe(
        response => {
          console.log('Foto del empleado actualizada:', response);
          // Update image URL in view if necessary
          this.selectedImageUrl = response.photo;
           // Reset file selection state
          this.file = null;
          this.selectedFileName = null;
        },
        error => {
          console.error('Error al actualizar la foto del empleado:', error);
        }
      );
  }

  /**
   * Cancel edit operation.
   */
  cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      this.router.navigate(['/employees']);
    }
  }

    /**
   * Open modal dialog.
   */
  openModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

    /**
   * Close modal dialog.
   */
  closeModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }


  /**
   * Confirm cancel edit operation and close modal dialog.
   */
  confirmCancelEdit(): void {
    this.closeModal();
    this.router.navigate(['/employees']);
  }

    /**
   * Custom validator function for image extension.
   */
  imageExtensionValidator(control: any) {
    if (control.value) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.test(control.value)) {
        return { invalidImageExtension: true };
      }
    }
    return null;
  }

 /**
   * Custom validator function to validate fields.
   */
  validateField(control: AbstractControl) {
    const fieldPattern = /^[a-zA-Z\s]*$/;
    if (fieldPattern.test(control.value)) {
      return null;
    } else {
      return { 'invalidField': true };
    }
  }

    /**
   * Custom validator function for phone number.
   */
  phoneNumberValidator(): Validators {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumberRegex = /^[679]{1}[0-9]{8}$/;
      if (control.value && !phoneNumberRegex.test(control.value)) {
        return { 'invalidPhoneNumber': true };
      }
      return null;
    };
  }

   /**
   * Custom validator function for age.
   */
  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const dob = new Date(control.value);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18 || dob >= today) {
      return { 'invalidAgeOrDate': true };
    }

    const maxAllowedDate = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());
    if (dob < maxAllowedDate) {
      return { 'invalidDateInThePast': true };
    }

    return null;
  }

}
