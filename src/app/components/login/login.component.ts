import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nif: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.nif, this.password).subscribe(
      (response) => {
        // Manejar la respuesta del backend si el inicio de sesión es exitoso
        console.log('Inicio de sesión exitoso:', response);
        this.authService.setAuthenticationStatus(true); // Establecer el estado de autenticación como verdadero
        this.router.navigate(['/dashboard']); // Redirigir al usuario a la página de inicio
      },
      (error) => {
        // Manejar los errores de inicio de sesión
        console.error('Error al iniciar sesión:', error);
        this.error = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
      }
    );
  }

}
