import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employees.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  // employeeForm?: FormGroup;
  employeeDatos: any = {};

<<<<<<< Updated upstream
  constructor(private apiService: ApiService, private router: Router) { }

  addEmployee(): void {
    this.apiService.addEmployees(this.employeeDatos).subscribe(
      (response) => {
        console.log('Empleado agregado exitosamente:', response);
        //te devuelve a la vista de todos los empleados
        this.router.navigate(['/employees']);
      },
      (error) => {
        console.error('Error al agregar el empleado:', error);
=======
  constructor(private apiService: ApiService, private router: Router, private fb: FormBuilder) {
    // Inicializa el formulario y define las reglas de validación
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      surname: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$')]],
      date_of_birth: ['', [Validators.required,this.ageValidator]],
      country: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.pattern('^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]+$')]],
      postal_code: ['', [Validators.required, Validators.minLength(5),Validators.pattern('^[0-9]+$')]],
      nif: ['', [Validators.required, Validators.pattern('^[XYZ0-9][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$',)    ]],
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
>>>>>>> Stashed changes
      }
    );
  }


  ngOnInit(): void {
    // this.employeeForm = this.formBuilder.group({
    //   nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[A-Za-z\s]+$/)]],
    //   apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[A-Za-z\s]+$/)]],
    //   fechaNacimiento: ['', Validators.required],
    //   nacionalidad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    //   genero: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   telefono: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern(/^\d+$/)]],
    //   direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    //   direccion2: ['', [Validators.minLength(5), Validators.maxLength(100)]],
    //   foto: ['', Validators.required]
      // Agrega las demás propiedades del formulario aquí, con sus respectivas validaciones
    };
  }

<<<<<<< Updated upstream
  // onSubmit() {
  //   if (this.employeeForm.invalid) {
  //     return;
  //   }
    // Aquí puedes enviar el formulario si es válido
=======
  checkNifExists(nif: string): void {
    const nifControl = this.employeeForm.get('nif');
    if (nifControl) { // Verifica si nifControl no es null
      nifControl.valueChanges.subscribe(() => {
        this.apiService.checkNifExists(nifControl.value).subscribe(
          (exists: boolean) => {
            if (exists) {
              nifControl.setErrors({ 'nifExists': true });
            }
          },
          (error) => {
            console.error('Error al verificar el NIF:', error);
          }
        );
      });
    }
  }
>>>>>>> Stashed changes

