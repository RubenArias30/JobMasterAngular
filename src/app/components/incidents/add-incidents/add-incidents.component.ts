import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      date: ['', Validators.required]
    });

  }



  addIncident() {
    if (this.incidentForm.invalid) {
      return;
    }

    this.apiService.addIncident(this.incidentForm.value).subscribe(
      response => {
        console.log('Incidencia creada con éxito:', response);
        this.router.navigate(['/history_incidents']);
      },
      error => {
        console.error('Error al crear incidencia:', error);

      }
    );
  }
}
