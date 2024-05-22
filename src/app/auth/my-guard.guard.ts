import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MyGuardGuard implements CanActivate {

  /**
    * MyGuardGuard class constructor.
    *
    * @param authService - Authentication service to check the user's authentication status.
    * @param router - Routing service to navigate to different routes.
    */
  constructor(private authService: AuthService, private router: Router) { }

  /**
     * canActivate method that determines whether a route can be activated or not.
     *
     * @param route - Snapshot of the active route containing information about the current route.
     * @returns boolean - Returns true if the user can activate the route, false otherwise.
     */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Check if the user is authenticated
    if (this.authService.isAuthenticated()) {
      // Get the role of the authenticated user
      const userRole = this.authService.getUserRole();
    // Check if the route has allowed roles and if the user's role is within those roles
      if (route.data['roles'] && route.data['roles'].includes(userRole)) {
        // If the user's role is allowed for this route, allow access
        return true;
      } else {
        // If the user's role is not allowed for this route, display an alert and deny access
        alert('No tienes permisos para esta ruta');
        return false;
      }
    } else {
     // If the user is not authenticated, redirect to the login pages
      this.router.navigate(['/login']);
      return false;
    }
  }
}
