import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElementRef } from '@angular/core'; // Import ElementRef
import { ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { SuccessAlertComponent } from 'src/app/components/alert-messages/success-alert/success-alert.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from 'src/app/components/alert-messages/delete-confirmation-modal/delete-confirmation-modal.component';
import { AddAbsencesComponent } from 'src/app/components/absences/add-absences/add-absences.component';

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent implements OnInit, OnDestroy {
  @ViewChild(AddAbsencesComponent) addAbsenceModal!: AddAbsencesComponent;
  absences: any[] = [];
  employees: any[] = []; // Add this line
  dropdownStates: { [key: string]: boolean } = {};
  currentOpenDropdown: number | null = null;
  showDetailsModal: boolean = false; // Agrega esta propiedad
  showDeleteConfirmationModal = false;
  p: number = 1;
  searchQuery: string = '';
  originalAbsences: any[] = [];
  @ViewChild('deleteConfirmation') deleteConfirmation!: DeleteConfirmationModalComponent;
  // showDeleteConfirmationModal = false;
  absenceIdToDelete: string | null = null;
  deleteSuccess: boolean = false;
  isLoading = true;
  isError = false;
// Add an additional option to filter all absences
 filterOptions = ['Mostrar Todo', 'Vacaciones', 'Enfermedad', 'Maternidad/Paternidad', 'Compensatorias', 'Baja', 'Otros'];
  selectedFilter: string | null = null;
  showFilterDropdown = false;

  selectedEmployeeId!: number;
  showEmployeeDropdown = false;

  // Define un objeto que mapee los tipos de ausencias en inglés a sus equivalentes en español
  tipoAusenciaTraducido: { [key: string]: string } = {
    'vacation': 'Vacaciones',
    'sick_leave': 'Enfermedad',
    'maternity/paternity': 'Maternidad/Paternidad',
    'compensatory': 'Compensatorias',
    'leave': 'Baja',
    'others': 'Otros'
  };



  constructor
    (
      private apiService: ApiService,
      private formBuilder: FormBuilder,
      private router: Router,
      private elementRef: ElementRef) {
  }


  ngOnInit(): void {
    // Fetch absences
    this.apiService.getAusencias().subscribe(
      (absences) => {
        this.absences = absences;
        this.originalAbsences = absences;
        this.isLoading = false; // Set isLoading to false when data is fetched
      },
      (error) => {
        this.isError = true;
        this.isLoading = false; // Set isLoading to false even if there's an error
      }
    );
    // Fetch employees
    this.apiService.getEmployees().subscribe((employees) => {
      this.employees = employees;
    });
    // Add document click event listener
    document.addEventListener('click', this.onDocumentClick);
  }
  ngOnDestroy(): void {
    // Remove document click event listener when component is destroyed
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (event: MouseEvent) => {
    // Check if the clicked element is outside the dropdown
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // Close the dropdown if it's open
      this.currentOpenDropdown = null;
    }
  };

  toggleDropdown(id: number) {
    if (this.currentOpenDropdown === id) {
      this.currentOpenDropdown = null; // Close the dropdown if it's already open
    } else {
      this.currentOpenDropdown = id; // Open the clicked dropdown
    }
  }
  resetPagination() {
    this.p = 1; // Reset the current page to 1
  }

  // Method to check if a dropdown is open
  isDropdownOpen(id: number): boolean {
    return this.currentOpenDropdown === id;
  }



  deleteAbsence(absenceId: string): void {


   // Ocultar los detalles de la ausencia
   this.showDetailsModal = false;

   // Mostrar la confirmación de eliminación
   this.showDeleteConfirmationModal = true;

 // Guardar el ID de la ausencia a eliminar
 this.absenceIdToDelete = absenceId;

  }

  performDelete(): void {
    if (this.absenceIdToDelete) {
      this.apiService.deleteAbsence(this.absenceIdToDelete).subscribe(() => {
        // Update the absences array after deletion
        this.absences = this.absences.filter((absence) => absence.id !== this.absenceIdToDelete);

        // Reset the absenceIdToDelete and close the confirmation modal
        this.absenceIdToDelete = null;
        this.showDeleteConfirmationModal = false;

        // Set the flag for successful deletion
        this.deleteSuccess = true;
        setTimeout(() => {
          this.deleteSuccess = false;
        }, 3000); // Reset after 2 seconds


      });
    }
  }
  // Subscribe to the event emitted by AddAbsencesComponent
  onAbsenceAdded(): void {
    // Reload the current route
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  // INTERACTION WIHT ADD COMPONENT
  openAddAbsenceModal() {
    this.addAbsenceModal.openModal(); // Call the openModal method of AddAbsenceComponent
  }


  // filter logic
  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }
  selectFilter(option: string): void {
    if (option === 'Mostrar Todo') {
      this.fetchAbsences(); // Fetch all absences
    } else {
      this.selectedFilter = option;
      this.fetchAbsences(option); // Fetch absences based on selected filter
    }
    this.showFilterDropdown = false;
  }


  fetchAbsences(type?: string): void {
    this.isLoading = true;
    if (!type || type === 'Mostrar Todo') {
      this.apiService.getAusencias().subscribe(
        (absences) => {
          this.absences = absences;
          this.originalAbsences = absences;
          this.isLoading = false;
          this.isError = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.isError = true;
        }
      );
    } else {
      const translatedType = Object.keys(this.tipoAusenciaTraducido).find(key => this.tipoAusenciaTraducido[key] === type);
      this.apiService.getAbsencesByType(translatedType).subscribe(
        (absences) => {
          this.absences = absences;
          this.originalAbsences = absences;
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
          this.isError = true;
        }
      );
    }
  }


  selectedAbsence: any;

closeAbsenceModal() {
  this.selectedAbsence = null;


}

openAbsenceModal(absence: any) {
  this.selectedAbsence = absence;

}

// Método para obtener el tipo de ausencia traducido
getTipoAusenciaTraducido(tipo: string): string {
  return this.tipoAusenciaTraducido[tipo] || tipo; // Retorna la traducción si está definida, de lo contrario, retorna el tipo original
}

loadEmployees() {
  this.apiService.getEmployees().subscribe(employees => {
    this.employees = employees;
  });
}


 // Método para alternar la visibilidad del dropdown de empleado
 toggleEmployeeDropdown() {
  this.showEmployeeDropdown = !this.showEmployeeDropdown;
}

searchAbsences(event: Event): void {
  event.preventDefault();
  const query = this.searchQuery.toLowerCase().trim();

  if (query === '') {
    this.absences = this.originalAbsences;
  } else {
    this.absences = this.originalAbsences.filter(absence => {
      const firstName = absence.employee?.name?.toLowerCase() || '';
      const lastName = absence.employee?.surname?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`;
      return firstName.startsWith(query) || lastName.startsWith(query) || fullName.startsWith(query);
    });
  }
}



}

