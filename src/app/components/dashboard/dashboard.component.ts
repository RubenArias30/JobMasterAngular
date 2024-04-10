import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  fechaHoraActual: string = ''; // Asignando un valor inicial vacío

  constructor() { }

  ngOnInit(): void {
    this.actualizarFechaHora();
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
}
