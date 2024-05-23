import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fechaHoraActual: string = '';
  totalTrabajadores: number = 0;
  incidences: any[] = [];
  recentAbsences: any[] = [];
  presentEmployeeCount: number = 0;
  inactiveEmployeeCount: number = 0;
  isLoading = true;

  // Translations for incident types
  typeTranslations: any = {
    'Delay': 'Retraso',
    'Absence': 'Ausencia',
    'password_change': 'Cambio de contraseña',
    'Request': 'Solicitud',
    'Complaint': 'Reclamación',
    'Others': 'Otros'
  };

   // Define an object mapping English absence types to their Spanish equivalents
   tipoAusenciaTraducido: { [key: string]: string } = {
    'vacation': 'Vacaciones',
    'sick_leave': 'Enfermedad',
    'maternity/paternity': 'Maternidad/Paternidad',
    'compensatory': 'Compensatorias',
    'leave': 'Baja',
    'others': 'Otros'
  };

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.actualizarFechaHora();
    this.getTotalEmployees();
    this.getRecentIncidents();
    this.loadRecentAbsences();
    this.getEmployeeStatus();

    setInterval(() => {
      this.actualizarFechaHora();
    }, 1000); // Update every second
  }

  // Method to update the current date and time
  private actualizarFechaHora(): void {
    const fechaHora = new Date();
    const hora = fechaHora.toLocaleString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Europe/Madrid' });
    const fecha = fechaHora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Format the date and time
    this.fechaHoraActual = `Hora: ${hora} | Fecha: ${fecha}`;
  }
  // Method to fetch the total number of employees
  private getTotalEmployees(): void {
    this.apiService.getEmployees().subscribe(
      (empleados: any[]) => {
        this.totalTrabajadores = empleados.length;
      },
      (error: any) => {
        console.error('Error al obtener la lista de trabajadores:', error);
      }
    );
  }

  // Method to fetch the status of employees
  getEmployeeStatus(): void {
    this.apiService.getEmployeeStatus().subscribe(
      (data: any) => {
        this.presentEmployeeCount = data.present_employee_count;
        this.inactiveEmployeeCount = data.inactive_employee_count;
        this.isLoading = false;
      },
      error => {
        console.error('Error al obtener el estado de los empleados:', error);
        this.isLoading = false;
     }
    );
  }

  // Method to fetch recent incidents
  getRecentIncidents(): void {
    this.apiService.getAllIncidents()
      .subscribe((data: any[]) => {
        // Sort incidents by date in descending order
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        // Take the first five incidents
        this.incidences = data.slice(0, 5);
      });
  }

  // Method to load recent absences
  loadRecentAbsences(): void {
    // Call the service to fetch all absences and then take only the last 5
    this.apiService.getAusencias().subscribe(
      (absences) => {
        // Sort absences by start date in descending order
        absences.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
         // Take only the first 5 absences
        this.recentAbsences = absences.slice(0, 5);
      },
      (error) => {
        console.error('Error fetching recent absences:', error);
      }
    );
  }

  // Method to translate incident type
  translateType(type: string): string {
    return this.typeTranslations[type] || type;
  }

  // Método para obtener el tipo de ausencia traducido
  getTipoAusenciaTraducido(tipo: string): string {
    return this.tipoAusenciaTraducido[tipo] || tipo; // Retorna la traducción si está definida, de lo contrario, retorna el tipo original
  }

// Method to navigate to Absences route
navigateToAbsences() {
  this.router.navigate(['/absences']);
}

  // Method to navigate to Incidents route
navigateToIncidents() {
  this.router.navigate(['/incidents']);
}
}
