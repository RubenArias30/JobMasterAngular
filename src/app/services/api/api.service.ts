import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  login(nif: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { nif, password }).pipe(
      tap(response => {
        // Si la autenticación es exitosa, guarda el token JWT en el servicio de autenticación
        this.authService.setToken(response.access_token);
        this.authService.setUserRole(response.roles);

      }),
      catchError(error => {
        return throwError(error); // Maneja el error en el componente que llama a este método
      })
    );
  }

  getLoggedInUserName(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees`);
  }
  addEmployees(employeeDatos: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/employees`, employeeDatos);
  }
 deleteEmployee(employeeId: string): Observable<any> {
  const url = `${this.apiUrl}/employees/${employeeId}`; // URL para eliminar el empleado
  return this.http.delete(url);

  }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/budget`);
  }
  //  // Método para obtener los conceptos relacionados con una factura específica
  //  getConcepts(invoiceId: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/budget/${invoiceId}/concepts`);
  // }

  // getInvoicesPRueba1(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/invoices?with=concepts`);
  // }
  // getInvoices(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/invoices`, { params: { with: 'concepts' } });
  // }


}
