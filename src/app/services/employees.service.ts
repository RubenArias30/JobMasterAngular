import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8000/api'; // Reemplaza con la URL de tu API Laravel

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de empleados
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Método para agregar un nuevo empleado
  addEmployee(employeeData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, employeeData);
  }

  // Método para editar un empleado existente
  editEmployee(employeeId: string, updatedData: any): Observable<any> {
    const url = `${this.baseUrl}/${employeeId}`;
    return this.http.put<any>(url, updatedData);
  }

  // Método para eliminar un empleado
  deleteEmployee(employeeId: string): Observable<any> {
    const url = `${this.baseUrl}/${employeeId}`;
    return this.http.delete<any>(url);
  }
}
