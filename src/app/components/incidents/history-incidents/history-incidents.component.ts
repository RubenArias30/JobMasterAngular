import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-history-incidents',
  templateUrl: './history-incidents.component.html',
  styleUrls: ['./history-incidents.component.css']
})
export class HistoryIncidentsComponent implements OnInit {
  userIncidents: any[] = [];
  typeTranslations: any = {
    'Delay': 'Retraso',
    'Absence': 'Ausencia',
    'password_change': 'Cambio de contraseña',
    'Request': 'Solicitud',
    'Complaint': 'Reclamación',
    'Others': 'Otros'
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Get the user's incidents when the component initializes
    this.getUserIncidents();
  }

  /**
   * Method to get the user's incidents.
   */
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

  /**
   * Translates the status into the corresponding string.
   * @param status The status to translate.
   * @returns The translated status string.
   */
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

  /**
* Translates the incident type into the corresponding string.
* @param type The incident type to translate.
* @returns The translated incident type string.
*/

  translateType(type: string): string {
    return this.typeTranslations[type] || type;
  }
}
