import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,AbstractControl,Validators} from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string | null = null;
  showError: boolean = false;
  employeeData: any;
  formModified: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService

  ) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    this.employeeForm = this.formBuilder.group({
      name: ['',this.validateField],
      surname: ['',this.validateField],
      date_of_birth: ['', [this.ageValidator.bind(this)]],
      country: ['',this.validateField],
      gender: [''],
       email: ['', [Validators.pattern(emailPattern)]],
       telephone: ['', [ this.phoneNumberValidator()]],
       photo: ['', this.imageExtensionValidator],
      street: [''],
      city: [''],
      postal_code: [''],
      nif: [''],
      password: ['', [this.passwordValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
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

  loadEmployeeData(): void {
    if (this.employeeId === null) {
      console.error('No se ha proporcionado un ID de empleado válido');
      return;
    }
    this.apiService.getEmployeeById(this.employeeId).subscribe(
      (data) => {
        this.employeeData = data;
        if (this.employeeData) {
          // Cargar datos de la tabla 'addresses'
          const addressData = this.employeeData.addresses;
          if (addressData) {
            this.employeeForm.patchValue({
              street: addressData.street || '',
              city: addressData.city || '',
              postal_code: addressData.postal_code || ''
            });
          }

          // Cargar datos de la tabla 'users'
          const userData = this.employeeData.users;
          if (userData) {
            this.employeeForm.patchValue({
              nif: userData.nif || '',
              password: userData.password || ''
            });
          }

          // Cargar datos de la tabla 'employees'
          this.employeeForm.patchValue({
            name: this.employeeData.name || '',
            surname: this.employeeData.surname || '',
            date_of_birth: this.employeeData.date_of_birth || '',
            country: this.employeeData.country || '',
            gender: this.employeeData.gender || '',
            email: this.employeeData.email || '',
            telephone: this.employeeData.telephone || '',
            photo: this.employeeData.photo || ''
          });
        } else {
          console.error('Datos del empleado no encontrados');
        }
      },
      (error) => {
        console.error('Error al cargar los datos del empleado:', error);
      }
    );
  }


  updateEmployee(): void {
    if (this.employeeId === null) {
      console.error('No se ha proporcionado un ID de empleado válido.');
      return;
    }

    // Si el formulario es válido, enviar los datos actualizados del empleado
    this.apiService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe(
      (response) => {
        console.log('Empleado actualizado exitosamente:', response);
        this.router.navigate(['/employees']); // Redirigir a la lista de empleados después de la actualización
      },
      (error) => {
        console.error('Error al actualizar el empleado:', error);
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


   // Función de validación personalizada para los campos name y surname
   validateField(control: AbstractControl) {
    const fieldPattern = /^[a-zA-Z\s]*$/; // Expresión regular para validar solo letras y espacios
    if (fieldPattern.test(control.value)) {
      return null; // La validación pasa
    } else {
      return { 'invalidField': true }; // La validación falla
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

   // Función de validación personalizada para verificar la edad mínima y la fecha futura
   ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    // Obtiene la fecha de nacimiento del control
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
    return null;
  }
}
