import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElementRef } from '@angular/core'; // Import ElementRef
import { ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { SuccessAlertComponent } from 'src/app/success-alert/success-alert.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from 'src/app/delete-confirmation-modal/delete-confirmation-modal.component';
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
  @ViewChild('deleteConfirmation') deleteConfirmation!: DeleteConfirmationModalComponent;
  // showDeleteConfirmationModal = false;
  showDeleteConfirmationModal = false;
  absenceIdToDelete: string | null = null;
  deleteSuccess: boolean = false;
  isLoading = true;
// Add an additional option to filter all absences
filterOptions = ['Mostrar Todo', 'Vacaciones', 'Enfermedad', 'Maternidad/Paternidad', 'Compensatorias', 'Baja', 'Otros'];
  selectedFilter: string | null = null;
  showFilterDropdown = false;




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
        this.isLoading = false; // Set isLoading to false when data is fetched
      },
      (error) => {
        console.error(error);
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

  // Method to check if a dropdown is open
  isDropdownOpen(id: number): boolean {
    return this.currentOpenDropdown === id;
  }



  deleteAbsence(absenceId: string): void {
    // Set the flag to show the delete confirmation modal
    this.showDeleteConfirmationModal = true; // Change here

    // Pass the absence ID to a variable to be used for deletion upon confirmation
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
    if (!type) {
      this.apiService.getAusencias().subscribe(
        (absences) => {
          this.absences = absences;
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
    } else {
      this.apiService.getAbsencesByType(type).subscribe(
        (absences) => {
          if (type === 'Mostrar Todo') {
            this.absences = absences; // Assign all absences directly
          } else {
            // Filter absences based on the selected type
            this.absences = absences.filter(absence => absence.type_absence === this.selectedFilter);
          }
          this.isLoading = false;
        },
        (error) => {
          console.error(error);
          this.isLoading = false;
        }
      );
    }
  }

}
