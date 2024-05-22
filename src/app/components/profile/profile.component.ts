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

  constructor(private apiService: ApiService) { } // Inyecta el servicio ApiService

  ngOnInit(): void {
    // Llama al método en el servicio para obtener los datos del perfil del empleado
    this.apiService.getProfile().subscribe(
      (response: Employee) => {

        this.profileData = response; // Asigna los datos del perfil obtenidos del servidor al objeto profileData
        console.log(this.profileData);
      },
      (error: any) => {
        console.error('Error al cargar el perfil del empleado:', error); // Maneja cualquier error
      }
    );
  }
   getGenderTranslation(gender: string | undefined): string {
    return gender ? this.genderTranslations[gender] : '';
  }
}
