import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Event } from '../../models/event.model';
import { Employee } from 'src/app/models/employee.model';
import { Absence } from 'src/app/models/absence.model';
import { Invoice } from 'src/app/models/invoices.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //route api
  // private apiUrl = 'http://localhost:8000/api';
  private apiUrl = 'https://jobmaster.es/api';

  constructor(private http: HttpClient, private authService: AuthService) { }


  //*******************Login **********************
  /**
   * Sends a login request to the server with the provided NIF and password.
   * @param nif - User's NIF
   * @param password - User's password
   * @returns An observable containing the server's response
   */
  login(nif: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { nif, password })
  }

  /**
  * Retrieves the logged-in user's name from the server.
  * @returns An observable containing the user's name
  */
  getLoggedInUserName(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  /**
   * Sends a request to the server to send a password reset link.
   * @param data - Data containing the user's email
   * @returns An observable containing the server's response
   */
  sendPasswordLink(data: any) {
    return this.http.post(`${this.apiUrl}/sendPasswordResetLink`, data);
  }

  /**
 * Sends a request to the server to change the user's password.
 * @param data - Data containing the new password and reset token
 * @returns An observable containing the server's response
 */
  changedPassword(data: any) {
    console.log(data)
    return this.http.post(`${this.apiUrl}/resetPassword`, data);
  }

  //*******************Employees**********************
  /**
   * Retrieves a list of employees from the server.
   * @returns An observable containing an array of employees
   */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  /**
  * Adds a new employee to the server.
  * @param employeeDatos - Data of the employee to add
  * @returns An observable containing the server's response
  */
  addEmployees(employeeDatos: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/employees`, employeeDatos);
  }

  /**
  * Deletes an employee from the server.
  * @param employeeId - ID of the employee to delete
  * @returns An observable containing the server's response
  */
  deleteEmployee(employeeId: string): Observable<any> {
    const url = `${this.apiUrl}/employees/${employeeId}`;
    return this.http.delete(url);
  }

  /**
  * Retrieves employee data by ID.
  * @param employeeId - ID of the employee
  * @returns An observable containing the employee data
  */
  getEmployeeById(employeeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/${employeeId}`);// Método para obtener los datos de un empleado por su ID
  }

  /**
   * Updates an employee's data on the server.
   * @param id - ID of the employee to update
   * @param employeeData - Updated data of the employee
   * @returns An observable containing the server's response
   */
  updateEmployee(id: number, employeeData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/employees/${id}`, employeeData);
  }

  /**
   * Retrieves detailed information about an employee.
   * @param employeeId - ID of the employee
   * @returns An observable containing the employee's details
   */
  getEmployeeDetails(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/${employeeId}`);
  }

  /**
  * Updates an employee's photo on the server.
  * @param employeeId - ID of the employee
  * @param formData - Form data containing the photo
  * @returns An observable containing the server's response
  */
  updateEmployeePhoto(employeeId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/photo`, formData);
  }

  /**
 * Checks if a NIF already exists in the system.
 * @param nif - NIF to check
 * @returns An observable containing a boolean indicating whether the NIF exists
 */
  checkNifExists(nif: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/employees/checkNifExists/${nif}`);
  }


  //*******************Invoices**********************

  /**
 * Retrieves a list of invoices from the server.
 * @returns An observable containing an array of invoices
 */
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/budget`);
  }

  /**
 * Retrieves an invoice by ID.
 * @param invoiceId - ID of the invoice
 * @returns An observable containing the invoice data
 */
  getInvoiceById(invoiceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/budget/${invoiceId}`);
  }

  /**
 * Creates a new invoice on the server.
 * @param invoiceData - Data of the invoice to create
 * @returns An observable containing the server's response
 */
  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/budget`, invoiceData);
  }

  /**
   * Updates a budget on the server.
   * @param id - ID of the budget to update
   * @param budgetData - Updated data of the budget
   * @returns An observable containing the server's response
   */
  updateBudget(id: number, budgetData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/budget/${id}`, budgetData);
  }

  /**
  * Deletes an invoice from the server.
  * @param invoiceId - ID of the invoice to delete
  * @returns An observable containing the server's response
  */
  deleteInvoice(invoiceId: string): Observable<any> {
    const url = `${this.apiUrl}/budget/${invoiceId}`;
    return this.http.delete(url);
  }


  //*******************Documents**********************
  /**
 * Retrieves all documents from the server.
 * @returns An observable containing an array of documents
 */
  getDocuments(): Observable<any[]> { // Método para obtener todos los documentos
    return this.http.get<any[]>(`${this.apiUrl}/documents`);
  }

  /**
 * Adds a document to an employee on the server.
 * @param employeeId - ID of the employee
 * @param documentData - Data of the document to add
 * @returns An observable containing the server's response
 */
  addDocumentToEmployee(employeeId: number, documentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/documents`, documentData);
  }

  /**
 * Deletes a document from the server.
 * @param documentId - ID of the document to delete
 * @returns An observable containing the server's response
 */
  deleteDocument(documentId: number): Observable<any> {   // Método para eliminar documento
    return this.http.delete<any>(`${this.apiUrl}/documents/${documentId}`);
  }


  /**
   * Retrieves documents for a specific employee by ID.
   * @param employeeId - ID of the employee
   * @returns An observable containing an array of documents
   */
  getDocumentsByEmployeeId(employeeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/documents/${employeeId}`);
  }

  /**
   * Retrieves the logged-in user's documents.
   * @returns An observable containing an array of documents
   */
  getMyDocuments(): Observable<Document[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-documents`);
  }

  /**
 * Uploads a document to the server.
 * @param employeeId - ID of the employee
 * @param formData - Form data containing the document
 * @returns An observable containing the server's response
 */
  uploadDocument(employeeId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/documents`, formData);
  }

  /**
  * Downloads a document from the server.
  * @param documentId - ID of the document to download
  * @returns An observable containing the document as a Blob
  */
  downloadDocument(documentId: number): Observable<Blob> {
    const url = `${this.apiUrl}/documents/download/${documentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  //*******************Schedule**********************

  /**
   * Adds a schedule to an employee on the server.
   * @param employeeId - ID of the employee
   * @param scheduleData - Data of the schedule to add
   * @returns An observable containing the server's response
   */
  addSchedule(employeeId: number, scheduleData: any) {
    return this.http.post(`${this.apiUrl}/employees/${employeeId}/schedule`, scheduleData);
  }
  /**
 * Retrieves events for a specific employee by ID.
 * @param employeeId - ID of the employee
 * @returns An observable containing an array of events
 */
  getEvents(employeeId: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/employees/${employeeId}/events`);
  }

  /**
 * Updates a schedule on the server.
 * @param id - ID of the schedule to update
 * @param formData - Updated data of the schedule
 * @returns An observable containing the server's response
 */
  updateSchedule(id: number, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${id}`, formData);
  }

  /**
  * Retrieves the schedule for the logged-in employee.
  * @returns An observable containing the schedule
  */
  getScheduleForEmployee(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schedule`);
  }

  /**
  * Deletes an event from the server.
  * @param eventId - ID of the event to delete
  * @returns An observable containing the server's response
  */
  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/schedule/${eventId}`);
  }

  /**
   * Retrieves a specific event by ID.
   * @param id - ID of the event
   * @returns An observable containing the event data
   */
  getEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/events/${id}`);
  }


  /**
   * Retrieves the schedule for all employees.
   * @returns An observable containing an array of schedules
   */
  getEmployeeSchedule(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employees/events`);
  }

  /**
  * Retrieves the status of all employees.
  * @returns An observable containing an array of employee statuses
  */
  getEmployeeStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employee-status`);
  }


  //*******************Incidents**********************
  /**
  * Retrieves all incidents from the server.
  * @returns An observable containing an array of incidents
  */
  getAllIncidents() {
    return this.http.get<any[]>(`${this.apiUrl}/all_incidents`);
  }

  /**
 * Retrieves incidents from the server.
 * @returns An observable containing an array of incidents
 */
  getIncidents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidents`);
  }

  /**
   * Retrieves incidents for a specific employee by ID.
   * @param employeeId - ID of the employee
   * @returns An observable containing an array of incidents
   */
  getIncidentsByEmployeeId(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incidents/${employeeId}`);
  }

  /**
   * Adds a new incident to the server.
   * @param incidentData - Data of the incident to add
   * @returns An observable containing the server's response
   */
  addIncident(incidentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/incidents`, incidentData);
  }

  /**
 * Deletes an incident from the server.
 * @param incidentId - ID of the incident to delete
 * @returns An observable containing the server's response
 */
  deleteIncident(incidentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/incidents/${incidentId}`);
  }

  /**
 * Updates the status of an incident on the server.
 * @param incidentId - ID of the incident
 * @param status - New status of the incident
 * @returns An observable containing the server's response
 */
  updateIncidentStatus(incidentId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/incidents/${incidentId}/status`, { status });
  }

  //*******************Attendances**********************
  /**
    * Registers an entry (check-in) for the logged-in user.
    * @returns An observable containing the server's response
    */
  registerEntry(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/attendances/entry`, {});
  }


  /**
   * Registers an exit (check-out) for the logged-in user.
   * @returns An observable containing the server's response
   */
  registerExit(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/attendances/exit`, {});
  }

  /**
 * Retrieves the attendance status for a specific user by ID.
 * @param userId - ID of the user
 * @returns An observable containing the attendance status
 */
  getAttendanceStatus(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/attendances/status/${userId}`);
  }

  /**
  * Retrieves the last exit date for the logged-in user.
  * @returns An observable containing the last exit date
  */
  getLastExitDate() {
    return this.http.get<any>(`${this.apiUrl}/lastExitDate`);
  }


  //*******************Absences**********************
  /**
 * Retrieves all absences from the server.
 * @returns An observable containing an array of absences
 */
  getAusencias(): Observable<Absence[]> {
    return this.http.get<any[]>(`${this.apiUrl}/absences`);
  }

  /**
 * Adds a new absence to the server.
 * @param formData - Data of the absence to add
 * @returns An observable containing the server's response
 */
  addAbsence(formData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/absences`, formData);
  }


  /**
   * Deletes an absence from the server.
   * @param absenceId - ID of the absence to delete
   * @returns An observable containing the server's response
   */
  deleteAbsence(absenceId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/absences/${absenceId}`);
  }


  /**
   * Retrieves details of a specific absence by ID.
   * @param absenceId - ID of the absence
   * @returns An observable containing the absence details
   */
  getAbsenceDetails(absenceId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/absences/${absenceId}`);
  }

  /**
  * Updates an absence on the server.
  * @param absenceId - ID of the absence to update
  * @param updatedFormData - Updated data of the absence
  * @returns An observable containing the server's response
  */
  updateAbsence(absenceId: string, updatedFormData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/absences/${absenceId}`, updatedFormData);

    /**
 * Retrieves absences by type from the server.
 * @param type - Type of absences to retrieve
 * @returns An observable containing an array of absences
 */
  }
  getAbsencesByType(type?: string): Observable<any[]> {
    const url = type ? `${this.apiUrl}/absences?type=${type}` : `${this.apiUrl}/absences`;
    return this.http.get<any[]>(url);
  }

  //*******************My Profile(EMPLOYEE)**********************
  /**
   * Retrieves the profile of the logged-in employee.
   * @returns An observable containing the employee's profile
   */
  getProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/profile`);
  }
}

