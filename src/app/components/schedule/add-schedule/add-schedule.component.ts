import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.css']
})
export class AddScheduleComponent implements OnInit {
  @ViewChild('fullcalendar') fullcalendar!: ElementRef;

  employeeId: number = 0;
  title: string = '';
  fechaInicio: string = '';
  horaInicio: string = '';
  fechaFin: string = '';
  horaFin: string = '';
  employeeName: string = '';
  events: EventInput[] = [];

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.getEmployeeDetails(this.employeeId);
    });
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
    // Eventos
    events: this.events
  };

  agregarHorario() {
    const scheduleData = {
      title: this.title,
      start_datetime: `${this.fechaInicio} ${this.horaInicio}`,
      end_datetime: `${this.fechaFin} ${this.horaFin}`
    };

    // Llama a la función onSubmit para agregar el horario a la base de datos
    this.onSubmit(scheduleData);

    // Agrega el nuevo evento al arreglo de eventos en el cliente
    const newEvent = {
      title: this.title,
      start: `${this.fechaInicio}T${this.horaInicio}`,
      end: `${this.fechaFin}T${this.horaFin}`
    };
    this.events.push(newEvent);

    // Limpia los campos del formulario después de agregar el evento
    this.title = '';
    this.fechaInicio = '';
    this.horaInicio = '';
    this.fechaFin = '';
    this.horaFin = '';

    // Actualiza la vista del calendario
    this.calendarOptions.events = this.events;
  }

  onSubmit(scheduleData: any) {
    this.apiService.addSchedule(this.employeeId, scheduleData).subscribe(
      response => {
        console.log('Horario agregado correctamente:', response);
      },
      error => {
        console.error('Error al agregar el horario:', error);
      }
    );
  }

  getEmployeeDetails(employeeId: number): void {
    this.apiService.getEmployeeDetails(employeeId).subscribe(
      (response: any) => {
        this.employeeName = response.name;
        // Actualiza los eventos si los datos del empleado contienen eventos
        if (response.events) {
          this.updateEvents(response.events);
        }
      },
      (error) => {
        console.error('Error al obtener los detalles del empleado:', error);
      }
    );
  }

  // Actualiza los eventos con los nuevos eventos obtenidos
  updateEvents(events: any[]): void {
    this.events = events.map(event => ({
      title: event.title,
      start: event.start_datetime,
      end: event.end_datetime
    }));
    // Actualiza la vista del calendario
    this.calendarOptions.events = this.events;
  }

  goBack(): void {
    this.router.navigate(['/schedule']);
  }
}
