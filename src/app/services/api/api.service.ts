import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(nif: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { nif, password });
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {});
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employees`);
  }

  addEmployees(employeeDatos: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/employees`, employeeDatos);
  }

<<<<<<< Updated upstream
=======
  deleteEmployee(employeeId: string): Observable<any> {
    const url = `${this.apiUrl}/employees/${employeeId}`; // URL para eliminar el empleado
    return this.http.delete(url);

  }

  // Método para obtener los datos de un empleado por su ID
  getEmployeeById(employeeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/${employeeId}`);
  }

  updateEmployee(id: string, employeeData: any): Observable<any> {
    const url = `${this.apiUrl}/employees/${id}`; // URL para actualizar el empleado
    return this.http.put(url, employeeData).pipe(
      catchError(error => {
        return throwError(error); // Maneja el error en el componente que llama a este método
      })
    );
  }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/budget`);
  }

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/budget`, invoiceData);
  }
  deleteInvoice(invoiceId: string): Observable<any> {
    const url = `${this.apiUrl}/budget/${invoiceId}`;
    return this.http.delete(url);
  }

  checkNifExists(nif: string): Observable<boolean> {
    const url = `${this.apiUrl}/checkNif/${nif}`;
    return this.http.get<boolean>(url);
  }
>>>>>>> Stashed changes
}
