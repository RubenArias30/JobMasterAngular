import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  form: FormGroup;
  showError: boolean = false;

  customEventContent = (arg: any) => {
    const startTime = arg.event.start ? arg.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const endTime = arg.event.end ? arg.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    const html = `
      <div class="bg-green-100 border border-green-300 rounded p-4 flex items-center">
        <i class='bx bxs-calendar text-green-500 mr-2'></i>
        <p class="text-sm font-semibold text-green-800">${startTime}-${endTime}</p>
      </div>
    `;

    return { html };
  };



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
    events: [],
    eventColor: '#92E3A9',
    eventContent: this.customEventContent
  };

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private formBuilder: FormBuilder) {
    // Inicializar el formulario reactivo
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      horaInicio: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      fechaFin: ['', Validators.required],
      horaFin: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]]
    }, { validator: this.dateRangeValidator });
  }

  ngOnInit(): void {
    // Obtener el ID del empleado desde la ruta y cargar sus detalles y eventos
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.getEmployeeDetails(this.employeeId);
      this.loadEvents(this.employeeId); // Cargar eventos del servidor
    });
  }

  loadEvents(employeeId: number): void {
    this.apiService.getEvents(employeeId).subscribe(
      (events: any[]) => {
        console.log('Eventos recibidos de la API:', events);
        const eventInputs: EventInput[] = [];

        events.forEach(event => {
          const startDate = new Date(event.start_datetime);
          const endDate = new Date(event.end_datetime);

          // Iterar sobre cada día dentro del rango y crear un evento para ese día
          for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            const newEvent: EventInput = {
              title: event.title,
              start: `${formattedDate}T${this.getFormattedTime(startDate)}:00`,
              end: `${formattedDate}T${this.getFormattedTime(endDate)}:00`
            };
            eventInputs.push(newEvent);
          }
        });

        this.calendarOptions.events = eventInputs;
        console.log('Eventos en formato EventInput:', eventInputs);
      },
      (error) => {
        console.error('Error al obtener los eventos del servidor:', error);
      }
    );
  }

  getFormattedTime(date: Date): string {
    // Formatear la hora en formato HH:MM
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }


  // Agregar un nuevo horario
  agregarHorario() {

    if (this.form.invalid) {
      this.showError = true;
      return;
    }

    const scheduleData = {
      title: this.form.get('title')?.value,
      start_datetime: `${this.form.get('fechaInicio')?.value} ${this.form.get('horaInicio')?.value}`,
      end_datetime: `${this.form.get('fechaFin')?.value} ${this.form.get('horaFin')?.value}`
    };


    // Enviar el horario al servidor
    this.onSubmit(scheduleData);

    // Limpiar el formulario después de agregar el horario
    this.clearForm();


    // Crear un nuevo evento para cada día dentro del rango especificado y agregarlo al calendario
    const start = new Date(this.fechaInicio);
    const end = new Date(this.fechaFin);
    const oneDay = 24 * 60 * 60 * 1000; // Duración de un día en milisegundos

    for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      const nuevoEvento: EventInput = {
        title: scheduleData.title,
        start: `${formattedDate}T${scheduleData.start_datetime.split(' ')[1]}:00`,
        end: `${formattedDate}T${scheduleData.end_datetime.split(' ')[1]}:00`
      };

      const calendarApi = this.fullcalendar.getApi();
      calendarApi.addEvent(nuevoEvento); // Agregar evento al calendario
    }


    // Recargar la página para reflejar los cambios
    this.loadEvents(this.employeeId);

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
    this.form.reset();
  }

  // Regresar a la página de horarios
  goBack(): void {
    this.router.navigate(['/schedule']);
  }



  // Validador personalizado para verificar que la fecha de inicio sea anterior a la fecha de fin
  dateRangeValidator(formGroup: FormGroup) {
    const fechaInicio = formGroup.get('fechaInicio')?.value;
    const horaInicio = formGroup.get('horaInicio')?.value;
    const fechaFin = formGroup.get('fechaFin')?.value;
    const horaFin = formGroup.get('horaFin')?.value;

    if (fechaInicio !== fechaFin) {
      if (fechaInicio > fechaFin) {
        return { dateRange: true }; // Devuelve un error si la fecha de inicio es posterior a la fecha de fin
      } else {
        return null; // Retorna nulo si la validación es exitosa
      }
    } else if (fechaInicio === fechaFin) {
      return { dataRange: false }
    } else {
      if (horaInicio >= horaFin) {
        return { dateRange: true }; // Devuelve un error si la hora de inicio es mayor o igual a la hora de fin en el mismo día
      } else {
        return null; // Retorna nulo si la validación es exitosa
      }
    }
  }

}
