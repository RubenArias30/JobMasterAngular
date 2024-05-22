import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  employees: Employee[] = []; // Utiliza el tipo Employee[]
  selectedEmployee: Employee[] = []; // Utiliza el tipo Employee
  modalVisible: boolean = false;
  isLoading = true;
  isError = false;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.apiService.getEmployees().subscribe(
      (response: Employee[]) => { // Utiliza el tipo Employee[]
        this.employees = response;
        console.log(this.employees)
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener la lista de empleados:', error);
        this.isError = true;
        this.isLoading = false;
      }
    );
  }

  openEmployeeModal(employee: Employee): void { // Utiliza el tipo Employee
    this.selectedEmployee = [employee];
    this.modalVisible = true;
  }

  closeEmployeeModal(): void {
    this.selectedEmployee = [];
    this.modalVisible = false;
  }

  confirmDeleteEmployee(employeeId: number): void { // Utiliza el tipo number para el id
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este empleado?');
    if (confirmDelete) {
      this.modalVisible = false;
      this.deleteEmployee(employeeId);
    }
  }

  deleteEmployee(employeeId: number): void { // Utiliza el tipo number para el id
    this.apiService.deleteEmployee(employeeId.toString()).subscribe( // Ajusta el tipo del id y convierte a string
      () => {
        this.employees = this.employees.filter(employee => employee.id !== employeeId);
      },
      (error) => {
        console.error('Error al eliminar el empleado:', error);
      }
    );
  }

  navigateToDocuments(employee: Employee): void { // Utiliza el tipo Employee
    this.router.navigate(['/documents', { employeeName: `${employee.name} ${employee.surname}` }]);
  }
}
