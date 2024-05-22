import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.css']
})
export class EditScheduleComponent implements OnInit {
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
    eventClick: this.handleEventClick.bind(this)

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
    if (info.event) {
      console.log('ID del evento:', info.event.id);

      // Almacena la información del evento seleccionado en una variable
      this.selectedEvent = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
      };

      // Abre el modal si es necesario
      this.showModal = true;
    }
  }


  openEditForm() {
    // Verificar si hay un evento seleccionado
    if (!this.selectedEvent) {
      console.error('No se ha seleccionado ningún evento para editar.');
      return;
    }

    // Obtener el título del evento
    const title = this.selectedEvent.title;

    // Obtener las fechas de inicio y fin del evento seleccionado
    const startDate = this.selectedEvent.start;
    const endDate = this.selectedEvent.end;

    // Convertir las fechas de inicio y fin a objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calcular la duración en milisegundos del evento
    const durationMs = end.getTime() - start.getTime();

    // Calcular las fechas y horas de inicio y fin en formato de cadena ISO
    const formattedStartDate = this.formatDate(start);
    const formattedStartTime = this.formatTime(start);
    const formattedEndDate = this.formatDate(end);
    const formattedEndTime = this.formatTime(end);

    // Inicializar el formulario de edición con el rango completo de fechas y horas del evento seleccionado
    this.form.patchValue({
      title: title,
      fechaInicio: formattedStartDate,
      horaInicio: formattedStartTime,
      fechaFin: formattedEndDate,
      horaFin: formattedEndTime
    });

    // Cerrar el modal
    this.closeModal();
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

  loadEvents(employeeId: number): void {
    this.apiService.getEvents(employeeId).subscribe(
      (events: any[]) => {
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
      (error) => {
        console.error('Error al obtener los eventos del servidor:', error);
      }
    );
  }

  getFormattedTime(date: Date): string {
    // Formatear la hora en formato HH:MM
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  // Editar un nuevo horario
  editarHorario() {

    // Verificar si hay un evento seleccionado
    if (!this.selectedEvent) {
      console.error('No se ha seleccionado ningún evento para editar.');
      return;
    }
    // Obtener los datos del formulario
    const formData = {
      title: this.form.get('title')?.value,
      start_datetime: `${this.form.get('fechaInicio')?.value} ${this.form.get('horaInicio')?.value}`,
      end_datetime: `${this.form.get('fechaFin')?.value} ${this.form.get('horaFin')?.value}`
    };

    // Obtener el ID del evento seleccionado
    const eventId = this.selectedEvent.id;

    // Llamar al método updateSchedule del ApiService para actualizar el evento
    this.apiService.updateSchedule(eventId, formData).subscribe(
      (response) => {
        // Actualización exitosa, puedes mostrar un mensaje de éxito o redirigir a otra página si es necesario
        // Aquí puedes agregar una lógica adicional, como mostrar un mensaje de éxito o redirigir a otra página
      },
      (error) => {
        // Manejar errores, puedes mostrar un mensaje de error al usuario o registrar el error en la consola
        console.error('Error al actualizar el evento:', error);
      }
    );
  }



  // Enviar el horario al servidor
  onSubmit(scheduleData: any) {

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
}