import { Component, OnInit, ViewChild } from '@angular/core';
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

  // Propiedades para el formulario y la gestión de eventos
  employeeId: number = 0;
  title: string = '';
  fechaInicio: string = '';
  horaInicio: string = '';
  fechaFin: string = '';
  horaFin: string = '';
  employeeName: string = '';

  // Opciones del calendario
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
    events: [], // Eventos mostrados en el calendario
    eventColor: '#92E3A9', // Color de los eventos
  };

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    // Obtener el ID del empleado desde la ruta y cargar sus detalles y eventos
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.getEmployeeDetails(this.employeeId);
      this.loadEvents(this.employeeId); // Cargar eventos del servidor
    });
  }

  // Cargar eventos desde el API
  loadEvents(employeeId: number): void {
    this.apiService.getEvents(employeeId).subscribe(
      (events: any[]) => {
        console.log('Eventos recibidos de la API:', events);
        // Aquí conviertes los datos a EventInput[]
        const eventInputs: EventInput[] = events.map(event => {
          return {
            title: event.title,
            start: event.start_datetime,
            end: event.end_datetime
            // Agrega más propiedades según sea necesario
          };
        });
        this.calendarOptions.events = eventInputs;
        console.log('Eventos en formato EventInput:', eventInputs); // Agregar este console.log
      },
      (error) => {
        console.error('Error al obtener los eventos del servidor:', error);
      }
    );
  }

  // Agregar un nuevo horario
  agregarHorario() {
    const scheduleData = {
      title: this.title,
      start_datetime: `${this.fechaInicio} ${this.horaInicio}`,
      end_datetime: `${this.fechaFin} ${this.horaFin}`
    };

    // Enviar el horario al servidor
    this.onSubmit(scheduleData);

    // Crear un nuevo evento para cada día dentro del rango especificado y agregarlo al calendario
    const start = new Date(this.fechaInicio);
    const end = new Date(this.fechaFin);
    const oneDay = 24 * 60 * 60 * 1000; // Duración de un día en milisegundos

    for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      const nuevoEvento: EventInput = {
        title: this.title,
        start: `${formattedDate}T${this.horaInicio}:00`,
        end: `${formattedDate}T${this.horaFin}:00`
      };

      const calendarApi = this.fullcalendar.getApi();
      calendarApi.addEvent(nuevoEvento); // Agregar evento al calendario
    }

    // Limpiar el formulario después de agregar el horario
    this.clearForm();
  }

  // Enviar el horario al servidor
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

  // Obtener los detalles del empleado desde el servidor
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

  // Limpiar el formulario
  clearForm(): void {
    this.title = '';
    this.fechaInicio = '';
    this.horaInicio = '';
    this.fechaFin = '';
    this.horaFin = '';
  }

  // Regresar a la página de horarios
  goBack(): void {
    this.router.navigate(['/schedule']);
  }
}
