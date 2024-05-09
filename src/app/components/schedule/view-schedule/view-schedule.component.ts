import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {

  // Lista de eventos
  events: EventInput[] = [];

  customEventContent = (arg: any) => {
    const startTime = arg.event.start ? this.formatTime(arg.event.start) : '';
    const endTime = arg.event.end ? this.formatTime(arg.event.end) : '';

    const timeRange = `${startTime} - ${endTime}`;

    const html = `
      <div class="bg-green-100 border border-green-300 rounded p-3 flex items-center">
        <i class='bx bxs-calendar text-green-500 mr-2'></i>
        <p class="text-sm font-semibold text-green-800">${timeRange}</p>
      </div>
    `;

    return { html };
  };

  formatTime(date: Date): string {
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Formatear hora y minuto con ceros a la izquierda si es necesario
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

    return `${formattedHour}:${formattedMinute}`;
  }

  formatDate(date: string | Date): string {
    let formattedDate = '';
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;
    } else {
      formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
    return formattedDate;
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    themeSystem: 'standard',
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    eventColor: '#92E3A9',
    eventContent: this.customEventContent,
    events: [] // Aquí es donde se asignarán los eventos del calendario
  };

  constructor(private apiService: ApiService,  private authService: AuthService) {}

  ngOnInit(): void {
    this.viewScheduleEmployees();
  }

  viewScheduleEmployees(): void {
    const empleadoId = 6; // Reemplaza con la ID del empleado actual
    this.apiService.getScheduleEmployees(empleadoId)
      .subscribe(
        (events: any[]) => {
          console.log('Eventos recibidos de la API:', events);
          this.events = []; // Limpiar la lista de eventos
          events.forEach(event => {
            const startDate = new Date(event.start_datetime);
            const endDate = new Date(event.end_datetime);

            let currentDate = new Date(startDate); // Iniciar en la fecha de inicio

            while (currentDate <= endDate) {
              const formattedDate = currentDate.toISOString().split('T')[0];
              const newEvent: EventInput = {
                id: event.id, // Asegúrate de incluir la propiedad id
                title: event.title,
                start: `${formattedDate}T${this.getFormattedTime(currentDate)}:00`,
                end: `${formattedDate}T${this.getFormattedTime(endDate)}:00`
              };
              this.events.push(newEvent); // Agregar evento a la lista

              // Avanzar al siguiente día
              currentDate.setDate(currentDate.getDate() + 1);

              // Verificar si hay un cambio de mes
              if (currentDate.getMonth() !== startDate.getMonth() && currentDate <= endDate) {
                // Generar eventos para el resto del mes
                while (currentDate.getMonth() === endDate.getMonth() && currentDate <= endDate) {
                  const formattedDateNextMonth = currentDate.toISOString().split('T')[0];
                  const newEventNextMonth: EventInput = {
                    title: event.title,
                    start: `${formattedDateNextMonth}T${this.getFormattedTime(currentDate)}:00`,
                    end: `${formattedDateNextMonth}T${this.getFormattedTime(endDate)}:00`
                  };
                  this.events.push(newEventNextMonth); // Agregar evento a la lista
                  currentDate.setDate(currentDate.getDate() + 1); // Avanzar al siguiente día
                }
              }
            }
          });

          this.calendarOptions.events = this.events; // Actualizar los eventos en el calendario
          console.log('Eventos en formato EventInput:', this.events);
        },
        error => {
          console.error('Error al obtener los horarios:', error);
        }
      );
  }

  getFormattedTime(date: Date): string {
    // Formatear la hora en formato HH:MM
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
