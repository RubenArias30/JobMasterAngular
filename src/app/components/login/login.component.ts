// login.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AbstractControl,FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // nif: string = '';
  // password: string = '';

  login!: FormGroup;
  mensaje: string | null = null;
  token: string | null = null;

   constructor(private authService: AuthService, private peticiones:ApiService,private route: Router) {

    this.login = new FormGroup({
      nif: new FormControl('', [
        Validators.required, // Campo obligatorio
      ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });
   }
   ngOnInit(){
    if (localStorage.getItem('token')) {
        this.route.navigate(['/dashboard']);
    }

    this.token = this.authService.getToken();
   }


   onSubmit(): void {
    const nif = this.login.value.nif;
    const password = this.login.value.password;

     // Verifica si los campos no están vacíos
     if (nif.trim() === '' || password.trim() === '') {
      this.mensaje = 'Por favor, completa todos los campos.';
      return;
    }


    // Llamada al servicio para autenticar al usuario
    this.peticiones.login(nif, password).subscribe(
      (response: any) => {
        console.log(response)
        localStorage.setItem('token', response.access_token);
        this.authService.setUserRole(response.roles);
        // Si la autenticación es exitosa, redirige al usuario a la página de dashboard
        this.route.navigate(['/dashboard']);
      },
      (error: any) =>  {
        if (error.status === 401) {
          this.mensaje = 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.';
        } else {
          this.mensaje = 'Se produjo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
        }
      }
    );
  }


}
