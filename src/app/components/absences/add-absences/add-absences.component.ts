import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-absences',
  templateUrl: './add-absences.component.html',
  styleUrls: ['./add-absences.component.css']
})
export class AddAbsencesComponent {
// Event emitter to notify parent component about absence addition
@Output() absenceAdded: EventEmitter<any> = new EventEmitter();
showModal: boolean = false;
ausenciaForm: FormGroup = this.formBuilder.group({});
absences: any[] = [];
 employees: any[] = [];
 submitted = false;


 constructor(private apiService: ApiService, private formBuilder: FormBuilder,private router : Router)  {

  this.ausenciaForm = this.formBuilder.group({
    // name: ['', Validators.required],
    employee_id: ['', Validators.required], 
    type_absence: ['', Validators.required],
    start_date: ['', [Validators.required, this.validateStartDate.bind(this)]],
    end_date: ['', [Validators.required, this.validateEndDate.bind(this)]],
    motive: ['', Validators.required]

  });

    // Re-validate end date when start date changes
    this.ausenciaForm.get('start_date')?.valueChanges.subscribe(() => {
      this.ausenciaForm.get('end_date')?.updateValueAndValidity();
    });

    // Re-validate start date when end date changes
    this.ausenciaForm.get('end_date')?.valueChanges.subscribe(() => {
      this.ausenciaForm.get('start_date')?.updateValueAndValidity();
    });

}

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

  /**
   * Validates the start date.
   * @param control The form control for the start date.
   * @returns An error object if the start date is invalid, otherwise null.
   */
validateStartDate(control: FormControl): { [key: string]: any } | null {
  const selectedDate = new Date(control.value);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
  const minStartDate = new Date(currentDate);
  minStartDate.setFullYear(currentDate.getFullYear() - 1); // Set minimum start date to 1 year before today

  if (selectedDate < minStartDate || selectedDate > currentDate) {
    return { invalidStartDate: true };
  }
  return null;
}

  /**
   * Validates the end date.
   * @param control The form control for the end date.
   * @returns An error object if the end date is invalid, otherwise null.
   */
validateEndDate(control: FormControl): { [key: string]: any } | null {
  const selectedDate = new Date(control.value);
  const startDateControl = this.ausenciaForm.get('start_date');
  if (!startDateControl) {
    return null;
  }
  const startDate = new Date(startDateControl.value);
  startDate.setHours(0, 0, 0, 0); // Ensure start date is at midnight
  const maxFutureDate = new Date(startDate);
  maxFutureDate.setFullYear(startDate.getFullYear() + 1); // Set max end date to 1 year after the start date

  if (selectedDate < startDate || selectedDate > maxFutureDate) {
    return { invalidEndDate: true };
  }
  return null;
}

  /**
   * Opens the modal to add a new absence.
   */
  openModal() {
    this.showModal = true;
    this.ausenciaForm.reset();
  }

    /**
   * Closes the modal.
   */
  closeModal() {
    this.showModal = false;
  }

    /**
   * Handles form submission.
   */
  onSubmit(): void {
    this.absenceAdded.emit(this.ausenciaForm.value);

    this.apiService.addAbsence(this.ausenciaForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/absences']);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });

    // Clear form data and close modal
    this.ausenciaForm.reset();
    this.closeModal();

  }


}

