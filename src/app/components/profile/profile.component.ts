import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  profileData: Employee | undefined;

  genderTranslations: { [key: string]: string } = {
    'male': 'Masculino',
    'female': 'Femenino'
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
     // Call the method in the service to fetch employee profile data
    this.apiService.getProfile().subscribe(
      (response: Employee) => {
        this.profileData = response;
        console.log(this.profileData);
      },
      (error: any) => {
        console.error('Error al cargar el perfil del empleado:', error);
      }
    );
  }

    /**
   * Function to translate gender.
   */
   getGenderTranslation(gender: string | undefined): string {
    return gender ? this.genderTranslations[gender] : '';
  }
}
