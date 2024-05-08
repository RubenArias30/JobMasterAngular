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
  mensaje: string='';
  token: string | null = null;

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
    this.mensaje = 'Por favor, completa todos los campos.';
    return;
  } else {
    this.mensaje = ''; // Vaciar el mensaje si ambos campos están llenos
  }

    // Si el NIF y la contraseña son "admin", omitir la validación de la contraseña
    if (nif.toLowerCase() === 'admin' && password.toLowerCase() === 'admin') {
      // Llamada al servicio para autenticar al usuario
      this.peticiones.login(nif, password).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.setItem('token', response.access_token);
          this.authService.setUserRole(response.roles);
          // Si la autenticación es exitosa, redirige al usuario a la página de dashboard
          this.route.navigate(['/dashboard']);
        },
        (error: any) => {
          // Manejo de error
          this.mensaje = 'Credenciales incorrectas.';
        }
      );
    } else {
      // Si no son "admin", realizar la validación normal de la contraseña
      // Llamada al servicio para autenticar al usuario
      this.peticiones.login(nif, password).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.setItem('token', response.access_token);
          this.authService.setUserRole(response.roles);
          // Si la autenticación es exitosa, redirige al usuario a la página de dashboard
          this.route.navigate(['/dashboard']);
        },
        (error: any) => {
          // Manejo de error
          this.mensaje = 'Credenciales incorrectas.';
        }
      );
    }
  }

}
