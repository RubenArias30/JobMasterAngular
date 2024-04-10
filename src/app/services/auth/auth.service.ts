import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isAuthenticatedKey = 'isAuthenticated'; // Clave para almacenar el estado de autenticación en el almacenamiento local

  constructor(private apiService: ApiService) {
    // Recuperar el estado de autenticación almacenado al iniciar el servicio
    this.isAuthenticatedSubject.next(localStorage.getItem(this.isAuthenticatedKey) === 'true');
  }

  // Método para obtener el estado de autenticación
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  

  // Método para iniciar sesión
  login(nif: string, password: string): Observable<any> {
    return this.apiService.login(nif, password).pipe(
      catchError(error => {
        let errorMessage = 'Error durante el inicio de sesión';
        if (error.status === 401) {
          errorMessage = 'Credenciales inválidas';
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor';
        }
        return throwError(errorMessage);
      })
    );
  }

  // Método para cerrar sesión
  logout(): Observable<any> {
    return this.apiService.logout().pipe(
      catchError(error => {
        let errorMessage = 'Error durante el cierre de sesión';
        if (error.status === 401) {
          errorMessage = 'No autorizado';
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor';
        }
        return throwError(errorMessage);
      })
    );
  }

  // Método para establecer el estado de autenticación
  setAuthenticationStatus(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
    localStorage.setItem(this.isAuthenticatedKey, status.toString()); // Guardar el estado de autenticación en el almacenamiento local
  }
}
