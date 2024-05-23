import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-incidents',
  templateUrl: './add-incidents.component.html',
  styleUrls: ['./add-incidents.component.css']
})
export class AddIncidentsComponent implements OnInit {
  incidentForm!: FormGroup;
  currentDateFormatted!: string;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,private router: Router) {}

  ngOnInit(): void {
    this.currentDateFormatted = this.getCurrentDateFormatted(); // Get current date formatted
    this.incidentForm = this.formBuilder.group({
      incident_type: ['', Validators.required],
      description: ['', Validators.required],
      date: [this.currentDateFormatted]
    });
  }

    /**
   * Function to format the current date as "YYYY-MM-DD".
   * @returns The formatted current date.
   */
  getCurrentDateFormatted(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  }

    /**
   * Function to validate the date.
   * @returns A validator function for date validation.
   */
  dateValidator(): any {
    return (control: { value: string; }): { [key: string]: boolean } | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();

      // Validation for past dates
      if (selectedDate < currentDate) {
        return { 'invalidFutureDate': true };
      }
      return null;
    };
  }

    /**
   * Adds a new incident.
   */
  addIncident() {
    if (this.incidentForm.invalid) {
      return;
    }
    this.apiService.addIncident(this.incidentForm.value).subscribe(
      response => {
        this.router.navigate(['/history_incidents']);
      },
      error => {
        console.error('Error al crear incidencia:', error);

      }
    );
  }

    /**
   * Checks if all required fields are filled.
   * @returns True if all required fields are filled, otherwise false.
   */
  areAllFieldsFilled(): boolean {
    const incidentType = this.incidentForm.get('incident_type')?.value;
    const description = this.incidentForm.get('description')?.value;
    // return incidentType && description && date;
    return incidentType && description;
  }

    /**
   * Cancels the edit and navigates back to the incident history page.
   */
 

  openModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  confirmCancelEdit(): void {
    this.closeModal();
    this.router.navigate(['/history_incidents']);
  }

}
