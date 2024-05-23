import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login!: FormGroup;
  mostrarMensaje: boolean = false;
  mensaje: string = '';
  mensajeEmptyField: string = '';
  token: string | null = null;
  passwordVisible: boolean = false;
  mensajeCredential: string = '';

  constructor(private authService: AuthService, private peticiones: ApiService, private route: Router) {
    this.login = new FormGroup({
      nif: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,

      ]),
    });
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.route.navigate(['/dashboard']);
    }

    this.token = this.authService.getToken();
  }

  /**
 * Function to handle form submission.
 */
  onSubmit(): void {
    const nif = this.login.value.nif;
    const password = this.login.value.password;

    // Check if fields are empty
    if (!nif || !password) {
      this.mensajeEmptyField = 'Por favor, completa todos los campos.';
      return;
    } else {
      this.mensajeEmptyField = '';// Clear message if both fields are filled
    }

    // If both nif and password are "admin", bypass password validation
    if (nif.toLowerCase() === 'admin' && password.toLowerCase() === 'admin') {
      // Call service to authenticate user
      this.peticiones.login(nif, password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.access_token);
          this.authService.setUserRole(response.roles);
          // If authentication is successful, redirect user to dashboard page
          this.route.navigate(['/dashboard']);
          this.mostrarMensaje = false;

        },
        (error: any) => {
          this.mostrarMensaje = true;

        }

      );
    } else {
      // If not "admin", perform normal password validation
      // Call service to authenticate user
      this.peticiones.login(nif, password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.access_token);
          this.authService.setUserRole(response.roles);
          // If authentication is successful, redirect user to dashboard page
          this.route.navigate(['/dashboard-employee']);
        },
        (error: any) => {
          this.mensajeCredential = 'Credenciales incorrectas.';
        }
      );
    }
  }

    /**
   * Function to toggle password visibility.
   */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
