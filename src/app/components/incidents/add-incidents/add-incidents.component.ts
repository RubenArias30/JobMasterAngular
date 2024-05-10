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

  constructor(private formBuilder: FormBuilder, private apiService: ApiService,private router: Router) {}

  ngOnInit(): void {
    this.incidentForm = this.formBuilder.group({
      incident_type: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', [Validators.required,this.dateValidator()]]
    });


  }


// Función para validar que la fecha no sea del pasado ni del futuro
dateValidator(): any {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    // Validación de fecha pasada
    if (selectedDate > currentDate) {
      return { 'invalidFutureDate': true };
    }

    // Validación de fecha futura
    if (selectedDate < oneYearAgo) {
      return { 'invalidPastDate': true };
    }

    return null;
  };
}

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

  areAllFieldsFilled(): boolean {
    const incidentType = this.incidentForm.get('incident_type')?.value;
    const description = this.incidentForm.get('description')?.value;
    const date = this.incidentForm.get('date')?.value;

    return incidentType && description && date;
  }
}
