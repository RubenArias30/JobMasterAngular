import { Component } from '@angular/core';
import { CalendarOption } from '@fullcalendar/angular/private-types';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { ApiService } from 'src/app/services/api/api.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-history-schedule',
  templateUrl: './history-schedule.component.html',
  styleUrls: ['./history-schedule.component.css']
})
export class HistoryScheduleComponent {
  // employeeId: number=0; // ID del empleado actual
  // schedule: any[] = []; // Horario del empleado actual


  // constructor(private apiService: ApiService) { }
  // events: EventInput[] = []; // Lista de eventos

  // calendarOptions: CalendarOptions = {
  //   initialView: 'dayGridMonth',
  //   plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  //   headerToolbar: {
  //     left: 'prev,next today',
  //     center: 'title',
  //     right: 'dayGridMonth,timeGridWeek,timeGridDay'
  //   },
  //   themeSystem: 'standard',
  //   buttonText: {
  //     today: 'Hoy',
  //     month: 'Mes',
  //     week: 'Semana',
  //     day: 'Día'
  //   },
  //   events: this.events, // Usar la lista de eventos
  //   eventColor: '#92E3A9'
  // };

  // ngOnInit(): void {
  //   // Aquí asumimos que ya has obtenido el ID del empleado actual (puede variar dependiendo de cómo manejes la autenticación)
  //   // Luego utilizamos ese ID para cargar el horario del empleado desde el servicio API
  //   this.loadEmployeeSchedule();
  // }
  // loadEmployeeSchedule(): void {
  //   this.apiService.getEmployeeSchedule(this.employeeId).subscribe(
  //     (schedule: any[]) => {
  //       // Procesar y mostrar los horarios del empleado
  //       this.processEmployeeSchedule(schedule);
  //     },
  //     (error) => {
  //       console.error('Error al cargar el horario del empleado:', error);
  //     }
  //   );
  // }
  // processEmployeeSchedule(schedule: any[]): void {
  //   this.events = []; // Limpiar la lista de eventos
  //   schedule.forEach(event => {
  //     // Procesar cada evento y agregarlo a la lista de eventos del calendario
  //     const newEvent: EventInput = {
  //       title: event.title,
  //       start: event.start_datetime,
  //       end: event.end_datetime
  //     };
  //     this.events.push(newEvent);
  //   });
  //   // Actualizar los eventos en el calendario
  //   this.calendarOptions.events = this.events;
  // }


}
