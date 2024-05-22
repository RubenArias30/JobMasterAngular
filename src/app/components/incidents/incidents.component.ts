import { Component, OnInit } from '@angular/core';
import { Incident } from 'src/app/models/incident.model';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit {
  incidences: Incident[] = [];
  p: number = 1;
  showSuccessAlert: boolean = false;
  successMessage: string = '';
  originalIncidences: any[] = [];
  selectedStatus: string = '';
  pending: number = 0;
  completed: number = 0;
  searchQuery: string = '';
  showDropdown: boolean = false;
   isLoading = true;
   isError = false; // Flag to track if there's an error fetching data
   //filter
   filterStatus: any = {
    pending: false,
    completed: false
  };
  filterTypes: any = {};
  incidentTypes: string[] = ['Delay', 'Absence', 'password_change', 'Request', 'Complaint', 'Others'];

  // For delete confirmation modal
  showConfirmationModal: boolean = false;
  incidentIdToDelete: number | null = null;

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

  getIncidents(): void {
    this.apiService.getAllIncidents()
      .subscribe(
        (response: Incident[]) => {
          this.incidences = response;
          this.originalIncidences = response.slice();
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

  searchIncidences(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery.toLowerCase().trim();

    if (query === '') {
      // If the search query is empty, show all incidents.
      this.incidences = this.originalIncidences;
    } else {
      this.incidences = this.originalIncidences.filter(incident => {
        const firstName = incident.employee?.name?.toLowerCase() || '';
        const lastName = incident.employee?.surname?.toLowerCase() || '';
        return firstName === query || lastName === query || (firstName + ' ' + lastName) === query;
      });
    }
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
  // filterByStatus(selectedStatus: string): void {
  //   this.selectedStatus = selectedStatus; // Actualizar el estado seleccionado

  //   // Filtrar las incidencias basadas en el estado seleccionado
  //   if (this.selectedStatus) {
  //     this.incidences = this.originalIncidences.filter(incident => incident.status === this.selectedStatus);
  //   } else {
  //     this.incidences = this.originalIncidences.slice(); // Restaurar la lista original
  //   }
  // }

  applyFilters(): void {

    this.showDropdown = false;
    const filteredByStatus = this.filterByStatus(this.originalIncidences);
    const filteredByType = this.filterByType(filteredByStatus);
    this.incidences = filteredByType;
  }

  filterByStatus(incidences: any[]): any[] {
    const statuses = Object.keys(this.filterStatus).filter(key => this.filterStatus[key]);
    if (statuses.length === 0) return incidences;

    return incidences.filter(incident => statuses.includes(incident.status));
  }

  filterByType(incidences: any[]): any[] {
    const types = Object.keys(this.filterTypes).filter(key => this.filterTypes[key]);
    if (types.length === 0) return incidences;

    return incidences.filter(incident => types.includes(incident.incident_type));
  }
  clearFilters(): void {
    this.filterStatus = { pending: false, completed: false };
    this.filterTypes = {};
    this.applyFilters();
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
  //  confirmDelete(incidentId: number): void {
  //   if (confirm('¿Estás seguro de que quieres eliminar esta incidencia?')) {
  //     this.apiService.deleteIncident(incidentId)
  //       .subscribe(
  //         () => {
  //           this.getIncidents(); // Recargar los datos después de eliminar la incidencia
  //         },
  //         (error) => {
  //           console.error('Error al eliminar la incidencia:', error);
  //         }
  //       );
  //   }
  // }

  openDeleteModal(incidentId: number): void {
    this.incidentIdToDelete = incidentId;
    this.showConfirmationModal = true;
  }

  closeDeleteModal(): void {
    this.showConfirmationModal = false;
    this.incidentIdToDelete = null;
  }

  // confirmDeletion(): void {
  //   if (this.incidentIdToDelete !== null) {
  //     this.apiService.deleteIncident(this.incidentIdToDelete)
  //       .subscribe(
  //         () => {
  //           this.getIncidents(); // Reload the data after deletion
  //           this.closeDeleteModal();
  //         },
  //         (error) => console.error('Error deleting incident:', error)
  //       );
  //   }
  // }
  confirmDeletion(): void {
    if (this.incidentIdToDelete !== null) {
      this.apiService.deleteIncident(this.incidentIdToDelete)
        .subscribe(
          () => {
            this.getIncidents(); // Reload the data after deletion
            this.showSuccessMessage('Incidencia eliminado correctamente.');
            this.closeDeleteModal();
          },
          (error) => console.error('Error deleting incident:', error)
        );
    }
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000); // Hide the alert after 3 seconds
  }

  splitDescription(description: string, maxLength: number): string[] {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return description.match(regex) || [];
  }
}
