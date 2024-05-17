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
    employee_id: ['', Validators.required], // Updated form control name
    type_absence: ['', Validators.required],
    start_date: ['', [Validators.required, this.validateStartDate]],
    end_date: ['', [Validators.required, this.validateEndDate]],
    motive: ['', Validators.required]

    // Add other form controls here
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

validateStartDate(control: FormControl): { [key: string]: any } | null {
  const selectedDate = new Date(control.value);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Establecer la fecha actual a la medianoche
  const minStartDate = new Date(currentDate);
  minStartDate.setFullYear(currentDate.getFullYear() - 2); // Establecer la fecha mínima a dos años antes de la fecha actual

  if (selectedDate < minStartDate || selectedDate > currentDate) {
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

  openModal() {
    this.showModal = true;
    this.ausenciaForm.reset();
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit(): void {
    // Log the form data before submitting

    // Emit the form data
    this.absenceAdded.emit(this.ausenciaForm.value);

    // Call the addAbsence method of ApiService with form data
    this.apiService.addAbsence(this.ausenciaForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/absences']);
        // Optionally handle the response here
      },
      error: (error) => {
        console.error('Error:', error);
        // Optionally handle the error here
      }
    });

    // Clear form data and close modal
    this.ausenciaForm.reset();
    this.closeModal();

  }


}

