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
    return this.http.post<any>(`${this.apiUrl}/login`, { nif, password })

    // .pipe(
    //   tap(response => {
    //     console.log(response)
    //     // Si la autenticación es exitosa, guarda el token JWT en el servicio de autenticación
    //     this.authService.setToken(response.access_token);
    //     this.authService.setUserRole(response.roles);

    //   }),
    //   catchError(error => {
    //     return throwError(error); // Maneja el error en el componente que llama a este método
    //   })
    // );
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
        return throwError(error);
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
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/documents`, documentData);
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

  // deleteEvent(employeeId: number, scheduleId: number): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/employees/${employeeId}/schedules/${scheduleId}`);
  // }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/events/${eventId}`);
  }

  //edit event (schedule)
  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`);
  }

  updateEvent(eventId: number, eventData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/events/${eventId}`, eventData);

  }

  //Incidents

  getAllIncidents() {
    return this.http.get<any[]>(`${this.apiUrl}/all_incidents`);
  }

  getIncidents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidents`);
  }
  getIncidentsByEmployeeId(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidents/${employeeId}`);
  }

   addIncident(incidentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/incidents`, incidentData);
  }

  deleteIncident(incidentId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/incidents/${incidentId}`);
  }

  updateIncidentStatus(incidentId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/incidents/${incidentId}/status`, { status });
  }

//Attendances
registerEntry(): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/attendances/entry`, {});
}

registerExit(): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/attendances/exit`, {});
}
getStartTime() {
  return this.http.get(`${this.apiUrl}/attendance/start-time`);
}
checkActiveEntry(userId: string) {
  return this.http.get<boolean>(`${this.apiUrl}/attendances/check-active-entry/${userId}`);
}



//Ausencias
getAusencias(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/absences`);
}


addAbsence(formData: any): Observable<any> {

  return this.http.post<any>(`${this.apiUrl}/absences`, formData);
}


//MiPerfil (EMPLOYEE)
getProfile(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/profile`);
}


}

