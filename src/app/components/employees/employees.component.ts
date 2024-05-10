import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  employees: any[] = [];
  selectedEmployee: any = null;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getEmployees();

  }
  getEmployees(): void {
    this.apiService.getEmployees().subscribe(
      (response: any[]) => {
        this.employees = response;
      },
      (error) => {
        console.error('Error al obtener la lista de empleados:', error);
      }
    );
  }

  openEmployeeModal(employee: any): void {
    this.selectedEmployee = employee;

  }


  closeEmployeeModal(): void {
    this.selectedEmployee = null;
  }

  confirmDeleteEmployee(employeeId: string): void {
    // Mostrar un cuadro de diálogo de confirmación
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este empleado?');

    // Procesar la eliminación si el usuario confirma la acción
    if (confirmDelete) {
      this.deleteEmployee(employeeId);
    }
  }

  deleteEmployee(employeeId: string): void {
    this.apiService.deleteEmployee(employeeId).subscribe(
      () => {
        // Eliminar el empleado de la lista localmente después de eliminarlo del servidor
        this.employees = this.employees.filter(employee => employee.id !== employeeId);
      },
      (error) => {
        console.error('Error al eliminar el empleado:', error);
      }
    );
  }
  navigateToDocuments(employee: any): void {
    this.router.navigate(['/documents', { employeeName: `${employee.name} ${employee.surname}` }]);
  }
}
