import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fechaHoraActual: string = ''; // Asignando un valor inicial vacío
  totalTrabajadores: number = 0; // Inicializa el total de trabajadores
  incidences: any[] = [];
  recentAbsences: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.actualizarFechaHora();
    this.obtenerTotalTrabajadores(); // Obtener el total de trabajadores
    this.getRecentIncidents();
    this.loadRecentAbsences();

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
  private obtenerTotalTrabajadores(): void {
    // Llamada al servicio API para obtener la lista de trabajadores
    this.apiService.getEmployees().subscribe(
      (empleados: any[]) => {
        // Asigna el número total de trabajadores obtenido del servicio
        this.totalTrabajadores = empleados.length;
      },
      (error: any) => {
        console.error('Error al obtener la lista de trabajadores:', error);
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
  
}
