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
  employees: any[] = []; 
  dropdownStates: { [key: string]: boolean } = {};
  currentOpenDropdown: number | null = null;
  showDetailsModal: boolean = false; 
  showDeleteConfirmationModal = false;
  p: number = 1; //pagination
  searchQuery: string = '';
  originalAbsences: any[] = [];
  @ViewChild('deleteConfirmation') deleteConfirmation!: DeleteConfirmationModalComponent;
  // showDeleteConfirmationModal = false;
  absenceIdToDelete: string | null = null;
  deleteSuccess: boolean = false;
  isLoading = true;
  isError = false;

  //filter for all absences
  filterOptions = ['Mostrar Todo', 'Vacaciones', 'Enfermedad', 'Maternidad/Paternidad', 'Compensatorias', 'Baja', 'Otros'];
  selectedFilter: string | null = null;
  showFilterDropdown = false;

  selectedEmployeeId!: number;
  showEmployeeDropdown = false;

  // Object to map absence types in English to their equivalents in Spanish
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

   /**
   * Handles document click event to close dropdowns when clicking outside.
   * @param event The mouse event.
   */
  onDocumentClick = (event: MouseEvent) => {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.currentOpenDropdown = null;
    }
  };

  /**
   * Toggles the visibility of a dropdown.
   * @param id The ID of the dropdown.
   */
  toggleDropdown(id: number) {
    if (this.currentOpenDropdown === id) {
      this.currentOpenDropdown = null; 
    } else {
      this.currentOpenDropdown = id;
    }
  }

   /**
   * Resets the pagination to the first page.
   */
  resetPagination() {
    this.p = 1; 
  }

  /**
   * Checks if a dropdown is open.
   * @param id The ID of the dropdown.
   * @returns A boolean indicating if the dropdown is open.
   */
    isDropdownOpen(id: number): boolean {
    return this.currentOpenDropdown === id;
  }

  /**
   * Opens the delete confirmation modal.
   * @param absenceId The ID of the absence to delete.
   */

  deleteAbsence(absenceId: string): void {
    this.showDetailsModal = false;

    this.showDeleteConfirmationModal = true;

    this.absenceIdToDelete = absenceId;

  }

    /**
   * Confirms the deletion of the selected absence.
   */
  performDelete(): void {
    if (this.absenceIdToDelete) {
      this.apiService.deleteAbsence(this.absenceIdToDelete).subscribe(() => {
        this.absences = this.absences.filter((absence) => absence.id !== this.absenceIdToDelete);

        this.absenceIdToDelete = null;
        this.showDeleteConfirmationModal = false;
        this.deleteSuccess = true;
        setTimeout(() => {
          this.deleteSuccess = false;
        }, 3000); // Reset after 2 seconds


      });
    }
  }

  /**
   * Reloads the current route when a new absence is added.
   */
  onAbsenceAdded(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  /**
   * Opens the modal to add a new absence.
   */
  openAddAbsenceModal() {
    this.addAbsenceModal.openModal(); 
  }


  /**
   * Toggles the visibility of the filter dropdown.
   */  
  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  /**
   * Selects a filter option and fetches absences accordingly.
   * @param option The selected filter option.
   */
  selectFilter(option: string): void {
    if (option === 'Mostrar Todo') {
      this.fetchAbsences(); 
    } else {
      this.selectedFilter = option;
      this.fetchAbsences(option); 
    }
    this.showFilterDropdown = false;
  }

 /**
   * Fetches absences from the API, optionally filtering by type.
   * @param type The type of absences to fetch.
   */
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

   /**
   * Closes the absence details modal.
   */
closeAbsenceModal() {
  this.selectedAbsence = null;


}

 /**
   * Closes the absence details modal.
   */
openAbsenceModal(absence: any) {
  this.selectedAbsence = absence;

}

  /**
   * Gets the translated absence type.
   * @param tipo The absence type.
   * @returns The translated absence type.
   */getTipoAusenciaTraducido(tipo: string): string {
  return this.tipoAusenciaTraducido[tipo] || tipo; 
}

  /**
   * Fetches the list of employees from the API.
   */
  loadEmployees() {
  this.apiService.getEmployees().subscribe(employees => {
    this.employees = employees;
  });
}


  /**
   * Toggles the visibility of the employee dropdown.
   */
  toggleEmployeeDropdown() {
  this.showEmployeeDropdown = !this.showEmployeeDropdown;
}

  /**
   * Filters absences based on the search query.
   * @param event The event triggered by the search form submission.
   */
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

