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

   /**
   * Fetches the list of employees from the API.
   */
  getEmployees(): void {
    this.apiService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener la lista de empleados:', error);
        this.isError = true;
        this.isLoading = false;
      }
    );
  }

    /**
   * Opens the employee modal.
   * @param employee The selected employee.
   */
  openEmployeeModal(employee: Employee): void {
    this.selectedEmployee = [employee];
    this.modalVisible = true;
  }

    /**
   * Closes the employee modal.
   */
  closeEmployeeModal(): void {
    this.selectedEmployee = [];
    this.modalVisible = false;
  }

    /**
   * Opens the delete modal for confirming employee deletion.
   * @param employeeId The ID of the employee to delete.
   */
  openDeleteModal(employeeId: number): void {
    this.employeeToDeleteId = employeeId;
    this.showDeleteModal = true;
  }


  /**
   * Closes the delete modal.
   */
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.employeeToDeleteId = null;
  }

   /**
   * Confirms the deletion of the selected employee.
   */
  confirmDeletion(): void {
    if (this.employeeToDeleteId !== null) {
      this.deleteEmployee(this.employeeToDeleteId);
      this.closeDeleteModal();
    }
  }

    /**
   * Deletes the selected employee.
   * @param employeeId The ID of the employee to delete.
   */
  deleteEmployee(employeeId: number): void {
    this.apiService.deleteEmployee(employeeId.toString()).subscribe(
      () => {
        this.employees = this.employees.filter(employee => employee.id !== employeeId);
        this.showSuccessAlertMessage('Empleado eliminado con éxito');
      },
      (error) => {
        console.error('Error al eliminar el empleado:', error);
      }
    );
  }

    /**
   * Navigates to the documents page for the selected employee.
   * @param employee The selected employee.
   */
  navigateToDocuments(employee: Employee): void {
    this.router.navigate(['/documents', { employeeName: `${employee.name} ${employee.surname}` }]);
  }

   /**
   * Shows a success alert message.
   * @param message The success message to display.
   */
  showSuccessAlertMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);  // Hide the alert after 3 seconds
  }
}
