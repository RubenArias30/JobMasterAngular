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

  typeTranslations: any = {
    'Delay': 'Retraso',
    'Absence': 'Ausencia',
    'password_change': 'Cambio de contraseña',
    'Request': 'Solicitud',
    'Complaint': 'Reclamación',
    'Others': 'Otros'
  };

   // Define un objeto que mapee los tipos de ausencias en inglés a sus equivalentes en español
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
    }, 1000); // Actualizar cada segundo
  }

  private actualizarFechaHora(): void {
    const fechaHora = new Date();
    const hora = fechaHora.toLocaleString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Europe/Madrid' });
    const fecha = fechaHora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Formatear la fecha y hora
    this.fechaHoraActual = `Hora: ${hora} | Fecha: ${fecha}`;
  }
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

  getRecentIncidents(): void {
    this.apiService.getAllIncidents()
      .subscribe((data: any[]) => {
        // Ordenar las incidencias por fecha en orden descendente
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        // Tomar las primeras cinco incidencias
        this.incidences = data.slice(0, 5);
      });
  }

  loadRecentAbsences(): void {
    // Llamar al servicio para obtener todas las ausencias y luego tomar solo las últimas 5
    this.apiService.getAusencias().subscribe(
      (absences) => {
        // Ordenar las ausencias por fecha de inicio de forma descendente
        absences.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
        // Tomar solo las primeras 5 ausencias
        this.recentAbsences = absences.slice(0, 5);
      },
      (error) => {
        console.error('Error fetching recent absences:', error);
      }
    );
  }

  translateType(type: string): string {
    return this.typeTranslations[type] || type;
  }

  // Método para obtener el tipo de ausencia traducido
  getTipoAusenciaTraducido(tipo: string): string {
    return this.tipoAusenciaTraducido[tipo] || tipo; // Retorna la traducción si está definida, de lo contrario, retorna el tipo original
  }

// Método para navegar a la ruta de Ausencias
navigateToAbsences() {
  this.router.navigate(['/absences']);
}

// Método para navegar a la ruta de Incidencias
navigateToIncidents() {
  this.router.navigate(['/incidents']);
}

}
