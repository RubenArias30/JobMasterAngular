import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-dasboard-employee',
  templateUrl: './dasboard-employee.component.html',
  styleUrls: ['./dasboard-employee.component.css']
})
export class DasboardEmployeeComponent implements OnInit{
  profileData: any = {}; // Objeto para almacenar los datos del perfil del empleado

  constructor(private apiService: ApiService,private router: Router) { } // Inyecta el servicio ApiService

  ngOnInit(): void {
    // Llama al método en el servicio para obtener los datos del perfil del empleado
    this.apiService.getProfile().subscribe(
      (data: any) => {
        console.log('Datos del perfil recibidos:', data); // Verifica los datos recibidos

        this.profileData = data; // Asigna los datos del perfil obtenidos del servidor al objeto profileData
      },
      (error: any) => {
        console.error('Error al cargar el perfil del empleado:', error); // Maneja cualquier error
      }
    );
}

redirectToSchedule() {
  this.router.navigate(['/view-schedule']);
}

redirectToDocuments() {
  this.router.navigate(['/view-documents']);
}

}
