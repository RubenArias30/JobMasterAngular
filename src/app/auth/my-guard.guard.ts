import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MyGuardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getUserRole();
      if (route.data['roles'] && route.data['roles'].includes(userRole)) {
        // Si el rol del usuario está permitido para esta ruta, permite el acceso
        return true;
      } else {
        // Si el rol del usuario no está permitido para esta ruta, redirige a una página de acceso denegado
        alert('No tienes permisos para esta ruta');
        return false;
      }
    } else {
      // Si el usuario no está autenticado, redirige a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}
