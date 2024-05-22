import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Event } from '../../models/event.model';
import { Employee } from 'src/app/models/employee.model';
import { Absence } from 'src/app/models/absence.model';
import { Invoice } from 'src/app/models/invoices.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  //Login
  login(nif: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { nif, password })
  }
  getLoggedInUserName(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  //Reset Password
  sendPasswordLink(data: any) {
    return this.http.post(`${this.apiUrl}/sendPasswordResetLink`, data);
  }
  changedPassword(data: any) {
    console.log(data)
    return this.http.post(`${this.apiUrl}/resetPassword`, data);
  }

  //Employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
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
  updateEmployee(id: number, employeeData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/employees/${id}`, employeeData);
  }
  getEmployeeDetails(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/${employeeId}`);
  }
  updateEmployeePhoto(employeeId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/photo`, formData);
  }
  //Verificar si ya existe el nif
  checkNifExists(nif: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/employees/checkNifExists/${nif}`);
  }

  //Invoices
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/budget`);
  }
  getInvoiceById(invoiceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/budget/${invoiceId}`);
  }
  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/budget`, invoiceData);
  }
  updateBudget(id: number, budgetData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/budget/${id}`, budgetData);
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
  getMyDocuments(): Observable<Document[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-documents`);
  }
  // Método para subir un documento al servidor
uploadDocument(employeeId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/employees/${employeeId}/documents`, formData);
}
downloadDocument(documentId: number): Observable<Blob> {
  const url = `${this.apiUrl}/documents/download/${documentId}`;
  return this.http.get(url, { responseType: 'blob' });
}

  //Schedule
  addSchedule(employeeId: number, scheduleData: any) {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/schedule`, scheduleData);
  }
  getEvents(employeeId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/employees/${employeeId}/events`);
  }

  updateSchedule(id: number, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${id}`, formData);
  }

  getScheduleForEmployee(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schedule`);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/schedule/${eventId}`);
  }

  //edit event (schedule)
  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`);
  }

  //Schedule Employees
  getEmployeeSchedule(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/events`);
  }
  getEmployeeStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employee-status`);
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

  deleteIncident(incidentId: number): Observable<any> {
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
  getAttendanceStatus(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/attendances/status/${userId}`);
  }
  getLastExitDate() {
    return this.http.get<any>(`${this.apiUrl}/lastExitDate`);
  }


  //Ausencias
  getAusencias(): Observable<Absence[]> {
    return this.http.get<any[]>(`${this.apiUrl}/absences`);
  }

  addAbsence(formData: any): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/absences`, formData);
  }
  deleteAbsence(absenceId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/absences/${absenceId}`);
  }
  getAbsenceDetails(absenceId: any): Observable<any> {
    // Make an HTTP GET request to fetch absence details based on absenceId
    return this.http.get<any>(`${this.apiUrl}/absences/${absenceId}`);
  }
  updateAbsence(absenceId: string, updatedFormData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/absences/${absenceId}`, updatedFormData);



  }
  getAbsencesByType(type?: string): Observable<any[]> {
    const url = type ? `${this.apiUrl}/absences?type=${type}` : `${this.apiUrl}/absences`;
    return this.http.get<any[]>(url);
  }

 

  //MiPerfil (EMPLOYEE)
  getProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/profile`);
  }


}

