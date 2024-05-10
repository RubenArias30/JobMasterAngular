import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  profileData: any = {}; // Objeto para almacenar los datos del perfil del empleado

  constructor(private apiService: ApiService) { } // Inyecta el servicio ApiService

  ngOnInit(): void {
    // Llama al método en el servicio para obtener los datos del perfil del empleado
    this.apiService.getProfile().subscribe(
      (data: any) => {

        this.profileData = data; // Asigna los datos del perfil obtenidos del servidor al objeto profileData
      },
      (error: any) => {
        console.error('Error al cargar el perfil del empleado:', error); // Maneja cualquier error
      }
    );
  }
}
