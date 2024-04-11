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
      // Si el usuario está autenticado, verifica si tiene acceso a la ruta
      if (route.data['roles'] && route.data['roles'].includes(this.authService.getUserRole())) {
        // Si el rol del usuario está permitido para esta ruta, permite el acceso
        return true;
      } else {
        // Si el rol del usuario no está permitido para esta ruta, redirige a una página de acceso denegado
        // this.router.navigate(['/access-denied']);
        alert('No tienes permisos para esta ruta')
       // window.location.reload()
        return false;
      }
    } else {
      // Si el usuario no está autenticado, redirige a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}
