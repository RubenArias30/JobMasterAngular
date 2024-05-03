import { Component,OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
  fechaHoraActual: string = '';
  nombreUsuario: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.actualizarFechaHora();
    setInterval(() => {
      this.actualizarFechaHora();
    }, 1000); // Actualizar cada segundo

    this.apiService.getLoggedInUserName().subscribe(
      (response) => {
        this.nombreUsuario = response.name;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private actualizarFechaHora(): void {
    const fechaHora = new Date();
    const hora = fechaHora.toLocaleString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Europe/Madrid' });
    const fecha = fechaHora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Formatear la fecha y hora
    this.fechaHoraActual = `Hora: ${hora} | Fecha: ${fecha}`;
  }
}
