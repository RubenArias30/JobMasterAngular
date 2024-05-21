import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-history-incidents',
  templateUrl: './history-incidents.component.html',
  styleUrls: ['./history-incidents.component.css']
})
export class HistoryIncidentsComponent implements OnInit {
  userIncidents: any[] = []; // Arreglo para almacenar las incidencias del usuario
  typeTranslations: any = {
    'Delay': 'Retraso',
    'Absence': 'Ausencia',
    'password_change': 'Cambio de contraseña',
    'Request': 'Solicitud',
    'Complaint': 'Reclamación',
    'Others': 'Otros'
  };

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

    // Función para traducir el estado
    translateStatus(status: string): string {
      switch (status) {
        case 'completed':
          return 'Completada';
        case 'pending':
          return 'Pendiente';
        default:
          return status;
      }
    }

    translateType(type: string): string {
      return this.typeTranslations[type] || type;
    }
}
