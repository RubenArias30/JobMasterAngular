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

  constructor(private http: HttpClient, private authService: AuthService) { }

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
  // Método para obtener los datos de un empleado por su ID
  getInvoiceById(invoiceId: string): Observable<any> {
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

  //Documents:

    // Método para obtener documentos por tipo
    // getDocumentsByType(documentType: string): Observable<any[]> {
    //   return this.http.get<any[]>(`${this.apiUrl}/documents?type_documents=${documentType}`);
    // }
    // getDocumentsByEmployeeAndType(employeeId: string, documentType: string): Observable<any[]> {
    //   return this.http.get<any[]>(`${this.apiUrl}/documents?employeeId=${employeeId}&type_documents=${documentType}`);
    // }

  // Método para obtener todos los documentos
  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents`);
  }
    // Método para agregar documento
    addDocument(documentData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/documents`, documentData);
    }

    // Método para eliminar documento
    deleteDocument(documentId: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/documents/${documentId}`);
    }

    getDocumentsByEmployee(employeeId: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/documents?employeeId=${employeeId}`);
    }


}
