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
  mensaje: string='';
  mensajeEmptyField: string='';
  token: string | null = null;
  passwordVisible: boolean = false; // Variable para controlar la visibilidad de la contraseña

  mensajeCredenttial: string='';

  constructor(private authService: AuthService, private peticiones: ApiService, private route: Router) {
    this.login = new FormGroup({
      nif: new FormControl('', [
        Validators.required, // Campo obligatorio
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

  onSubmit(): void {
    const nif = this.login.value.nif;
    const password = this.login.value.password;

     // Verifica si los campos están vacíos
  if (!nif || !password) {
    this.mensajeEmptyField = 'Por favor, completa todos los campos.';
    return;
  } else {
    this.mensajeEmptyField = ''; // Vaciar el mensaje si ambos campos están llenos
  }


    // Si el NIF y la contraseña son "admin", omitir la validación de la contraseña
    if (nif.toLowerCase() === 'admin' && password.toLowerCase() === 'admin') {
      // Llamada al servicio para autenticar al usuario
      this.peticiones.login(nif, password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.access_token);
          this.authService.setUserRole(response.roles);
          // Si la autenticación es exitosa, redirige al usuario a la página de dashboard
          this.route.navigate(['/dashboard']);
          this.mostrarMensaje = false;

        },
        (error: any) => {
          this.mostrarMensaje = true;

        }

      );
    } else {
      // Si no son "admin", realizar la validación normal de la contraseña
      // Llamada al servicio para autenticar al usuario
      this.peticiones.login(nif, password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.access_token);
          this.authService.setUserRole(response.roles);
          // Si la autenticación es exitosa, redirige al usuario a la página de dashboard
          this.route.navigate(['/dashboard-employee']);
        },
        (error: any) => {
          // Manejo de error
          this.mensajeCredenttial = 'Credenciales incorrectas.';
        }
      );
    }
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
