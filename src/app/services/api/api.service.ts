import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Event } from '../../models/events/event.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ///Login
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

  //Employees
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees`);
  }
  addEmployees(employeeDatos: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/employees`, employeeDatos);
  }
  deleteEmployee(employeeId: string): Observable<any> {
    const url = `${this.apiUrl}/employees/${employeeId}`;
    return this.http.delete(url);
  }
  getEmployeeById(employeeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/${employeeId}`);// Método para obtener los datos de un empleado por su ID
  }
  updateEmployee(id: string, employeeData: any): Observable<any> {
    const url = `${this.apiUrl}/employees/${id}`;
    return this.http.put(url, employeeData).pipe(
      catchError(error => {
        return throwError(error); // Maneja el error en el componente que llama a este método
      })
    );
  }
  getEmployeeDetails(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/${employeeId}`);
  }

  //Invoices
  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/budget`);
  }
  getInvoiceById(invoiceId: string): Observable<any> {  // Método para obtener los datos de un empleado por su ID
    return this.http.get<any>(`${this.apiUrl}/budget/${invoiceId}`);
  }
  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/budget`, invoiceData);
  }
  updateInvoice(invoiceId: number, invoiceData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/budget/${invoiceId}`, invoiceData);
  }
  deleteInvoice(invoiceId: string): Observable<any> {
    const url = `${this.apiUrl}/budget/${invoiceId}`;
    return this.http.delete(url);
  }

  //Documents
  getDocuments(): Observable<any[]> { // Método para obtener todos los documentos
    return this.http.get<any[]>(`${this.apiUrl}/documents`);
  }
  addDocumentToEmployee(employeeId: number, documentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/documents/details/${employeeId}`, documentData);
  }



  deleteDocument(documentId: number): Observable<any> {   // Método para eliminar documento
    return this.http.delete<any>(`${this.apiUrl}/documents/${documentId}`);
  }
  getDocumentsByEmployeeId(employeeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/documents/${employeeId}`);
  }

  //Schedule
  addSchedule(employeeId: number, scheduleData: any) {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/schedule`, scheduleData);
  }
  getEvents(employeeId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/employees/${employeeId}/events`);
  }
}
