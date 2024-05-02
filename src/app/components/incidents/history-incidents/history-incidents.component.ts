import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-history-incidents',
  templateUrl: './history-incidents.component.html',
  styleUrls: ['./history-incidents.component.css']
})
export class HistoryIncidentsComponent implements OnInit {
  userIncidents: any[] = []; // Arreglo para almacenar las incidencias del usuario

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Obtener las incidencias del usuario actual al inicializar el componente
    this.getUserIncidents();
  }

  // Método para obtener las incidencias del usuario actual
  getUserIncidents() {
    this.apiService.getIncidents().subscribe(
      (response: any[]) => {
        this.userIncidents = response;
      },
      error => {
        console.error('Error al obtener incidencias del usuario:', error);
      }
    );
  }
}
