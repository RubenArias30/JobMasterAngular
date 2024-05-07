import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.css']
})
export class ResponseResetComponent implements OnInit {
  error: any[] = [];
  resetForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required, this.passwordValidator]],
      password_confirmation: ['', [Validators.required, this.passwordConfirmationValidator]],
      resetToken: ['']
    });

    this.route.queryParams.subscribe(params => {
      this.resetForm.controls['resetToken'].setValue(params['token']);
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.apiService.changedPassword(this.resetForm.value).subscribe(
        data => {
          console.log(data);
          this.router.navigate(['/login']);
        },
        error => {
          console.error(error);
          if (error.error.errors) {
            this.error = error.error.errors;
          }
        }
      );
    }
  }

   // Función de validación personalizada para la contraseña
   passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(control.value)) {
      return { 'invalidPassword': true };
    }
    return null;
  }
  
  // Función de validación personalizada para asegurar que la confirmación de la contraseña coincida con la contraseña
  passwordConfirmationValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.root.get('password');
    const confirmPassword = control.value;
    if (password && confirmPassword !== password.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }
}
