import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit {
  incidences: any[] = [];
  p: number = 1;
  originalIncidences: any[] = [];
  selectedStatus: string = '';
  pending: number = 0;
  completed: number = 0;
  showDropdown: boolean = false;
   isLoading = true;
   isError = false; // Flag to track if there's an error fetching data

  statusTranslations: any = {
    '': 'Todos',
    'pending': 'Pendientes',
    'completed': 'Completadas'
  };

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
    this.getIncidents();
  }

  // getIncidents(): void {
  //   this.apiService.getAllIncidents()
  //   .subscribe((data: any[]) => {
  //       this.incidences = data;
  //       this.originalIncidences = data.slice();
  //       this.countIncidentStatus();
  //     });
  // }
  getIncidents(): void {
    this.apiService.getAllIncidents()
      .subscribe(
        (data: any[]) => {
          this.incidences = data;
          this.originalIncidences = data.slice();
          this.countIncidentStatus();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching incidents:', error);
          this.isError = true; // Set error flag to true
          this.isLoading = false;
        }
      );
  }

  translateStatus(status: string): string {
    return this.statusTranslations[status] || 'Todos';
  }

  translateType(type: string): string {
    return this.typeTranslations[type] || type;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  resetPagination() {
    this.p = 1; // Reset the current page to 1
  }
  // Función para filtrar incidencias por estado
  filterByStatus(selectedStatus: string): void {
    this.selectedStatus = selectedStatus; // Actualizar el estado seleccionado

    // Filtrar las incidencias basadas en el estado seleccionado
    if (this.selectedStatus) {
      this.incidences = this.originalIncidences.filter(incident => incident.status === this.selectedStatus);
    } else {
      this.incidences = this.originalIncidences.slice(); // Restaurar la lista original
    }
  }

  getDocumentStatusClass(status: string): string {
    return status === 'completed' ? 'bg-green-200' : 'bg-red-200';
  }

  countIncidentStatus(): void {
    this.pending = this.incidences.filter(incident => incident.status === 'pending').length;
    this.completed = this.incidences.filter(incident => incident.status === 'completed').length;
  }

  toggleCompletion(incident: any): void {
    // Cambiar el estado   de la incidencia entre completada y pendiente
    if (incident.status === 'completed') {
      incident.status = 'pending';
    } else {
      incident.status = 'completed';
    }


    // Llamar al servicio API para actualizar el estado de la incidencia
    this.apiService.updateIncidentStatus(incident.id, incident.status)
      .subscribe(
        (updatedIncident: any) => {
          this.getIncidents(); // Recargar los datos después de cambiar el estado
        },
        (error) => {
          console.error('Error al actualizar el estado de la incidencia:', error);
        }
      );
  }


   // Función para confirmar y eliminar una incidencia
   confirmDelete(incidentId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta incidencia?')) {
      this.apiService.deleteIncident(incidentId)
        .subscribe(
          () => {
            this.getIncidents(); // Recargar los datos después de eliminar la incidencia
          },
          (error) => {
            console.error('Error al eliminar la incidencia:', error);
          }
        );
    }
  }
}
