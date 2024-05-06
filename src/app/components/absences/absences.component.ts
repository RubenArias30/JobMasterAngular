import { Component,OnInit  } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { SuccessAlertComponent } from 'src/app/success-alert/success-alert.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from 'src/app/delete-confirmation-modal/delete-confirmation-modal.component';


@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent {
  absences: any[] = [];
  employees: any[] = []; // Add this line
  ausenciaForm: FormGroup = this.formBuilder.group({});
  dropdownStates: { [key: string]: boolean } = {};
  currentOpenDropdown: number | null = null;
  @ViewChild('deleteConfirmation') deleteConfirmation!: DeleteConfirmationModalComponent;
  // showDeleteConfirmationModal = false;
  showDeleteConfirmationModal = false;
  absenceIdToDelete: string | null = null;
  deleteSuccess: boolean = false;


  constructor(private apiService: ApiService, private formBuilder: FormBuilder,private router : Router)  {

    this.ausenciaForm = this.formBuilder.group({
      // name: ['', Validators.required],
      employee_id: ['', Validators.required], // Updated form control name
      type_absence: ['', Validators.required],
      start_date: ['', [Validators.required, this.validateStartDate]],
      end_date: ['', [Validators.required, this.validateEndDate]],
      motive: ['', Validators.required]

      // Add other form controls here
    });

  }

  // ngOnInit(): void {
  //   this.apiService.getEmployees().subscribe((employees) => {
  //     this.employees = employees;

  //     });



  // }

  ngOnInit(): void {
    // Fetch absences
    this.apiService.getAusencias().subscribe((absences) => {
      this.absences = absences;
    });

    // Fetch employees
    this.apiService.getEmployees().subscribe((employees) => {
      this.employees = employees;
    });
  }
  validateStartDate(control: FormControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
    const maxStartDate = new Date();
    maxStartDate.setFullYear(currentDate.getFullYear() + 1); // Set max start date to one year from current date

    if (selectedDate < currentDate || selectedDate > maxStartDate) {
      return { invalidStartDate: true };
    }
    return null;
  }

  validateEndDate(control: FormControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setDate(currentDate.getDate() + 365); // Set max future date to 1 year from now
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
    if (selectedDate < currentDate || selectedDate > maxFutureDate) {
      return { invalidEndDate: true };
    }
    return null;
  }

  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
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


  editAbsence(absenceId: string): void {
    // Handle edit action here
    console.log('Editing absence with ID:', absenceId);
  }

  viewAbsence(absenceId: string): void {
    // Handle view action here
    console.log('Viewing absence with ID:', absenceId);
  }

//  deleteAbsence(absenceId: string): void {
//     this.apiService.deleteAbsence(absenceId).subscribe(() => {
//       // Update the absences array after deletion
//       this.absences = this.absences.filter((absence) => absence.id !== absenceId);
//     });
//   }
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
    });
  }
}

  onSubmit(): void {
    // Log the form data before submitting
    console.log('Form Data:', this.ausenciaForm.value);

    // Call the addAbsence method of ApiService with form data
    this.apiService.addAbsence(this.ausenciaForm.value).subscribe({
      next: (response) => {
        console.log('Response from server:', response);
        this.router.navigate(['/absences']);

        // Optionally handle the response here
      },
      error: (error) => {
        console.error('Error:', error);
        // Optionally handle the error here
      }
    });
  }





}
