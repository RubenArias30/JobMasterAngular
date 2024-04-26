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
  @ViewChild('fullcalendar') fullcalendar: any;

  employeeId: number = 0;
  title: string = '';
  fechaInicio: string = '';
  horaInicio: string = '';
  fechaFin: string = '';
  horaFin: string = '';
  employeeName: string = '';

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
    events: [
      { title: 'event 1', date: '2019-04-01' },
      { title: 'event 2', date: '2019-04-02' }
    ]
  };

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.getEmployeeDetails(this.employeeId);
    });
  }

  agregarHorario() {
    const scheduleData = {
      title: this.title,
      start_datetime: `${this.fechaInicio} ${this.horaInicio}`,
      end_datetime: `${this.fechaFin} ${this.horaFin}`
    };

    // Llama a la función onSubmit para agregar el horario a la base de datos
    this.onSubmit(scheduleData);

    const evento: EventInput = {
      title: this.title,
      start: `${this.fechaInicio}T${this.horaInicio}`,
      end: `${this.fechaFin}T${this.horaFin}`
    };

    // Asegurémonos de que this.calendarOptions.events sea siempre un arreglo
    if (!Array.isArray(this.calendarOptions.events)) {
      this.calendarOptions.events = [];
    }

    // Agrega el nuevo evento al arreglo de eventos del calendario
    this.calendarOptions.events.push(evento);

    // Verifica si fullcalendar está definido antes de acceder a getApi()
    if (this.fullcalendar && this.fullcalendar.getApi) {
      // Actualiza el calendario para renderizar los nuevos eventos
      this.fullcalendar.getApi().addEvent(evento);
    } else {
      console.error('FullCalendar no está definido o no tiene el método getApi');
    }

    console.log('Evento agregado:', evento);

    // Limpia los campos del formulario después de agregar el horario
    this.title = '';
    this.fechaInicio = '';
    this.horaInicio = '';
    this.fechaFin = '';
    this.horaFin = '';
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
      },
      (error) => {
        console.error('Error al obtener los detalles del empleado:', error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/schedule']);
  }
}
