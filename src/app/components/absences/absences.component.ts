import { Component,OnInit  } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.css']
})
export class AbsencesComponent {
  employees: any[] = []; // Add this line
  ausenciaForm: FormGroup = this.formBuilder.group({});

  constructor(private apiService: ApiService, private formBuilder: FormBuilder)  {

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

  onSubmit(): void {
    // Log the form data before submitting
    console.log('Form Data:', this.ausenciaForm.value);

    // Call the addAbsence method of ApiService with form data
    this.apiService.addAbsence(this.ausenciaForm.value).subscribe({
      next: (response) => {
        console.log('Response from server:', response);
        // Optionally handle the response here
      },
      error: (error) => {
        console.error('Error:', error);
        // Optionally handle the error here
      }
    });
  }





}
