import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isAuthenticatedKey = 'isAuthenticated'; // Clave para almacenar el estado de autenticación en el almacenamiento local

  private url = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {
    // Recuperar el estado de autenticación almacenado al iniciar el servicio
    this.isAuthenticatedSubject.next(localStorage.getItem(this.isAuthenticatedKey) === 'true');
  }

  // Método para obtener el estado de autenticación
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Método para iniciar sesión
  login(nif: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, { nif, password }).pipe(
      catchError(error => {
        // Manejar el error aquí
        console.error('Error during login:', error);
        return throwError(error);
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    // Realizar la lógica de cierre de sesión aquí
    this.isAuthenticatedSubject.next(false); // Actualizar el estado de autenticación
    localStorage.removeItem(this.isAuthenticatedKey); // Eliminar el estado de autenticación del almacenamiento local
  }

  // Método para establecer el estado de autenticación
  setAuthenticationStatus(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
    localStorage.setItem(this.isAuthenticatedKey, status.toString()); // Guardar el estado de autenticación en el almacenamiento local
  }
}
