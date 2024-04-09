import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  // employeeForm?: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

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

  // onSubmit() {
  //   if (this.employeeForm.invalid) {
  //     return;
  //   }
    // Aquí puedes enviar el formulario si es válido

