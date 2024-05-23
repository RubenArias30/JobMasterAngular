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


  /**
   * Fetches the list of incidents from the API.
   */
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

    /**
   * Searches for incidents based on the search query.
   * @param event The event triggered by the search input.
   */
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
        const fullName = `${firstName} ${lastName}`;
        return firstName.startsWith(query) || lastName.startsWith(query) || fullName.startsWith(query);
      });
    }
  }

  /**
   * Translates the status of the incident.
   * @param status The status of the incident.
   * @returns The translated status.
   */
  translateStatus(status: string): string {
    return this.statusTranslations[status] || 'Todos';
  }

    /**
   * Translates the type of the incident.
   * @param type The type of the incident.
   * @returns The translated type.
   */
  translateType(type: string): string {
    return this.typeTranslations[type] || type;
  }

    /**
   * Toggles the dropdown for filtering options.
   */
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

    /**
   * Resets the pagination to page 1.
   */
  resetPagination() {
    this.p = 1; // Reset the current page to 1
  }

  /**
   * Applies the selected filters to the incidents.
   */
  applyFilters(): void {
    this.showDropdown = false;
    const filteredByStatus = this.filterByStatus(this.originalIncidences);
    const filteredByType = this.filterByType(filteredByStatus);
    this.incidences = filteredByType;
  }

   /**
   * Filters incidents based on their status.
   * @param incidences The incidents to filter.
   * @returns The filtered incidents.
   */
  filterByStatus(incidences: any[]): any[] {
    const statuses = Object.keys(this.filterStatus).filter(key => this.filterStatus[key]);
    if (statuses.length === 0) return incidences;

    return incidences.filter(incident => statuses.includes(incident.status));
  }

    /**
   * Filters incidents based on their type.
   * @param incidences The incidents to filter.
   * @returns The filtered incidents.
   */
  filterByType(incidences: any[]): any[] {
    const types = Object.keys(this.filterTypes).filter(key => this.filterTypes[key]);
    if (types.length === 0) return incidences;

    return incidences.filter(incident => types.includes(incident.incident_type));
  }

    /**
   * Clears all applied filters.
   */
  clearFilters(): void {
    this.filterStatus = { pending: false, completed: false };
    this.filterTypes = {};
    this.applyFilters();
  }

  /**
   * Gets the CSS class for the document status.
   * @param status The status of the document.
   * @returns The CSS class.
   */
  getDocumentStatusClass(status: string): string {
    return status === 'completed' ? 'bg-green-200' : 'bg-red-200';
  }

    /**
   * Counts the number of pending and completed incidents.
   */
  countIncidentStatus(): void {
    this.pending = this.incidences.filter(incident => incident.status === 'pending').length;
    this.completed = this.incidences.filter(incident => incident.status === 'completed').length;
  }

    /**
   * Toggles the completion status of an incident.
   * @param incident The incident to toggle.
   */
  toggleCompletion(incident: any): void {
    // Toggle the incident status between completed and pending
    if (incident.status === 'completed') {
      incident.status = 'pending';
    } else {
      incident.status = 'completed';
    }

    // Call the API service to update the incident status
    this.apiService.updateIncidentStatus(incident.id, incident.status)
      .subscribe(
        (updatedIncident: any) => {
          this.getIncidents();

        },
        (error) => {
          console.error('Error al actualizar el estado de la incidencia:', error);
        }
      );
  }

  /**
   * Opens the delete confirmation modal for the selected incident.
   * @param incidentId The ID of the incident to delete.
   */
  openDeleteModal(incidentId: number): void {
    this.incidentIdToDelete = incidentId;
    this.showConfirmationModal = true;
  }

   /**
   * Closes the delete confirmation modal.
   */
  closeDeleteModal(): void {
    this.showConfirmationModal = false;
    this.incidentIdToDelete = null;
  }

  /**
   * Confirms the deletion of the selected incident.
   */
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

    /**
   * Shows a success message for a certain duration.
   * @param message The success message to display.
   */
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000); // Hide the alert after 3 seconds
  }


  /**
   * Splits the description of an incident into multiple lines.
   * @param description The description of the incident.
   * @param maxLength The maximum length of each line.
   * @returns An array of strings containing the split description.
   */
  splitDescription(description: string, maxLength: number): string[] {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return description.match(regex) || [];
  }
}
