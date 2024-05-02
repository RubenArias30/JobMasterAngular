import { Component, OnInit, ViewChild, Input} from '@angular/core';
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
  @Input() eventDetails: any;

  showModal: boolean = false; // Variable para controlar la visibilidad del modal
  selectedEvent: any; // Variable para almacenar el evento seleccionado
  // Lista de eventos
  events: EventInput[] = [];

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
  showErrorField: boolean = false;



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
    events: this.events, // Usar la lista de eventos
    eventColor: '#92E3A9',
    eventContent: this.customEventContent,
    eventClick: this.openModal.bind(this)

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
  
  handleEventClick(info: any) {

    // Almacena la información del evento seleccionado en una variable
    this.selectedEvent = {
      title: info.event.title,
      start_datetime: info.event.start_datetime,
      end_datetime : info.event.end_datetime, 
      employees_id : info.event.employees_id
    };

    // Abre el modal
    this.showModal = true;
  }


 // Función para mostrar el modal y pasar el evento seleccionado
 openModal(event: any) {
  this.selectedEvent = event;
  this.showModal = true;
}

// Función para cerrar el modal
closeModal() {
  this.showModal = false;
}
confirmDeleteEvent(): void {
  // Verifica si se ha seleccionado un evento y tiene un ID válido
  if (!this.selectedEvent || !this.selectedEvent.id) {
    console.error('No se pudo obtener el ID del evento seleccionado');
    return;
  }

  const scheduleId = this.selectedEvent.id; // Obtiene el ID del evento seleccionado

  // Llama al método deleteEvent del servicio para eliminar el evento del servidor
  this.apiService.deleteEvent(this.employeeId, scheduleId).subscribe(
    () => {
      console.log('Evento eliminado correctamente');
      // Realiza cualquier otra acción después de eliminar el evento, como actualizar la lista de eventos
      // También puedes cerrar el modal después de eliminar el evento si es necesario
      this.closeModal();
    },
    (error) => {
      console.error('Error al eliminar el evento:', error);
      // Maneja el error si es necesario
    }
  );
}



// Función para editar el evento (puedes implementarla según tus necesidades)
editEvent() {
  console.log('Editar evento:', this.selectedEvent);
  this.closeModal();
}
  loadEvents(employeeId: number): void {
    this.apiService.getEvents(employeeId).subscribe(
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
    // Resetear los mensajes de error
    this.showErrorField = false;
    this.showError = false;

    if (this.form.invalid) {
      this.showErrorField = true;
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

    // Crear un nuevo evento para cada día dentro del rango especificado y agregarlo a la lista de eventos
    const start = new Date(scheduleData.start_datetime);
    const end = new Date(scheduleData.end_datetime);
    if (start >= end) {
      const temp = scheduleData.start_datetime;
      scheduleData.start_datetime = scheduleData.end_datetime;
      scheduleData.end_datetime = temp;
    }

    for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      const nuevoEvento: EventInput = {
        title: scheduleData.title,
        start: `${formattedDate}T${scheduleData.start_datetime.split(' ')[1]}:00`,
        end: `${formattedDate}T${scheduleData.end_datetime.split(' ')[1]}:00`
      };

      this.events.push(nuevoEvento); // Agregar evento a la lista
    }

    // Actualizar los eventos en el calendario después de agregar todos los eventos
    this.calendarOptions.events = this.events;

    // Limpiar el calendario y volver a cargar los eventos
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.removeAllEvents();
    calendarApi.addEventSource(this.events);

    // Recargar la página para reflejar los cambios (puedes no necesitar esto, dependiendo de cómo manejes la actualización)
    // this.loadEvents(this.employeeId);
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
    } else {
      if (horaInicio >= horaFin) {
        return { dateRange: true }; // Devuelve un error si la hora de inicio es mayor o igual a la hora de fin en el mismo día
      } else {
        return null; // Retorna nulo si la validación es exitosa
      }
    }
}
deleteEventFromCalendar(eventToDelete: any) {
  // Filtrar la lista de eventos para eliminar el evento específico
  this.events = this.events.filter(event => event !== eventToDelete);

  // Actualizar los eventos en el calendario después de eliminar el evento
  const calendarApi = this.fullcalendar.getApi();
  calendarApi.removeAllEvents();
  calendarApi.addEventSource(this.events);
}




}
