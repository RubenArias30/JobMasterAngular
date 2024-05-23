import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-dasboard-employee',
  templateUrl: './dasboard-employee.component.html',
  styleUrls: ['./dasboard-employee.component.css']
})
export class DasboardEmployeeComponent implements OnInit{
  profileData: any = {}; // Object to store employee profile data

  constructor(private apiService: ApiService,private router: Router) {}
  ngOnInit(): void {
   // Calls the method in the service to get employee profile data
    this.apiService.getProfile().subscribe(
      (data: any) => {

        this.profileData = data; // Assigns profile data obtained from the server to profileData object
      },
      (error: any) => {
        console.error('Error al cargar el perfil del empleado:', error);
      }
    );
}

// Method to redirect to the schedule page
redirectToSchedule() {
  this.router.navigate(['/view-schedule']);
}

// Method to redirect to the documents page
redirectToDocuments() {
  this.router.navigate(['/view-documents']);
}

}
