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
  employees: Employee[] = [];
  selectedEmployee: Employee[] = [];
  modalVisible: boolean = false;
  isLoading = true;
  isError = false;

  // Delete modal
  showDeleteModal: boolean = false;
  employeeToDeleteId: number | null = null;

  // success messages
  showSuccessAlert: boolean = false;
  successMessage: string = '';

  constructor(private apiService: ApiService, private router: Router,) { }

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

  openDeleteModal(employeeId: number): void {
    this.employeeToDeleteId = employeeId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.employeeToDeleteId = null;
  }

  confirmDeletion(): void {
    if (this.employeeToDeleteId !== null) {
      this.deleteEmployee(this.employeeToDeleteId);
      this.closeDeleteModal();
    }
  }

  deleteEmployee(employeeId: number): void { // Utiliza el tipo number para el id
    this.apiService.deleteEmployee(employeeId.toString()).subscribe( // Ajusta el tipo del id y convierte a string
      () => {
        this.employees = this.employees.filter(employee => employee.id !== employeeId);
        this.showSuccessAlertMessage('Empleado eliminado con éxito');
      },
      (error) => {
        console.error('Error al eliminar el empleado:', error);
      }
    );
  }

  navigateToDocuments(employee: Employee): void { // Utiliza el tipo Employee
    this.router.navigate(['/documents', { employeeName: `${employee.name} ${employee.surname}` }]);
  }

  // message is shown after the delete is done
  showSuccessAlertMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);  // Hide the alert after 3 seconds
  }
}
