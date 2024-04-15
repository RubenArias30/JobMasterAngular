import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string | undefined;
  showError: boolean = false;

  constructor(private route: ActivatedRoute,private router: Router,private formBuilder: FormBuilder,private apiService: ApiService
  ) {

    this.employeeForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      date_of_birth: ['', [Validators.required,this.ageValidator]],
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

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';

    if (this.employeeId) {
      this.loadEmployeeData(this.employeeId);
    }
  }

  loadEmployeeData(employeeId: string): void {
    this.apiService.getEmployeeById(employeeId).subscribe(
      (employee: any) => {
        this.employeeForm.patchValue(employee);
      },
      (error) => {
        console.error('Error al cargar los datos del empleado', error);
      }
    );
  }
  saveEmployee(): void {
    if (this.employeeId && this.employeeForm.valid) { // Verifica si employeeId está definido y el formulario es válido
      this.apiService.updateEmployee(this.employeeId, this.employeeForm.value).subscribe(
        () => {
          this.router.navigate(['/employees']);
        },
        (error) => {
          console.error('Error al actualizar el empleado', error);
        }
      );
    } else {
      this.showError = true;
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
  cancelEdit(): void {
    if (confirm('¿Estás seguro de cancelar la edición?')) {
      // Si el usuario confirma la cancelación, redirige a la página de administración de empleados
      this.router.navigate(['/employees']);
    }
  }
}
