import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nif: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService,private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.nif, this.password)
      .subscribe(
        response => {
          // La autenticación fue exitosa, puedes redirigir al usuario a otra página
          // o realizar otras acciones necesarias
          console.log('Inicio de sesión exitoso:', response);
          this.errorMessage = '';
           this.router.navigate(['/dashboard']);
        },
        error => {
          // Ocurrió un error durante la autenticación, manejar el error aquí
          console.error('Error durante el inicio de sesión:', error);
          this.errorMessage = error;
        }
      );
  }
}
