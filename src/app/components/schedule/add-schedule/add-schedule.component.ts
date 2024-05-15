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
  formEdit: FormGroup;
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


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  formatTime(date: Date): string {
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
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
    // Inicializar el formulario reactivo
    this.formEdit = this.formBuilder.group({
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
        this.selectedEvent = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
        };

        if (!this.selectedEvent) {
            console.error('No se ha seleccionado ningún evento para editar.');
            return;
        }

        const title = this.selectedEvent.title;
        const startDate = new Date(this.selectedEvent.start);
        const endDate = new Date(this.selectedEvent.end);
        const formattedStartTime = this.formatTime(startDate);
        const formattedEndTime = this.formatTime(endDate);

        // Obtener todos los eventos del calendario
        const allEvents = info.view.calendar.getEvents();

        // Filtrar los eventos que tienen las mismas horas de inicio y fin
        const matchingEvents = allEvents.filter((event: { start: Date, end: Date }) => {
            const eventStartTime = this.formatTime(new Date(event.start));
            const eventEndTime = this.formatTime(new Date(event.end));
            return eventStartTime === formattedStartTime && eventEndTime === formattedEndTime;
        });

        // Determinar las fechas mínima y máxima de los eventos coincidentes
        let minStartDate = startDate;
        let maxEndDate = endDate;

        matchingEvents.forEach((event: { start: Date, end: Date }) => {
            const eventStartDate = new Date(event.start);
            const eventEndDate = new Date(event.end);
            if (eventStartDate < minStartDate) {
                minStartDate = eventStartDate;
            }
            if (eventEndDate > maxEndDate) {
                maxEndDate = eventEndDate;
            }
        });

        const formattedMinStartDate = this.formatDate(minStartDate);
        const formattedMaxEndDate = this.formatDate(maxEndDate);

        // Actualizar el formulario con las fechas mínima y máxima
        this.formEdit.patchValue({
            title: title,
            fechaInicio: formattedMinStartDate,
            horaInicio: formattedStartTime,
            fechaFin: formattedMaxEndDate,
            horaFin: formattedEndTime
        });

        this.showModal = true;
    }
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

  agregarHorario() {
    // Restablecer los mensajes de error
    this.showErrorField = false;
    this.showError = false;

    if (this.form.invalid) {
      this.showErrorField = true;
      return;
    }

    const formData = this.form.value;
    const startDateTime = new Date(`${formData.fechaInicio}T${formData.horaInicio}`);
    const endDateTime = new Date(`${formData.fechaFin}T${formData.horaFin}`);

    // Crear eventos separados para cada día si el evento se extiende a múltiples días
    const currentDate = new Date(startDateTime);
    while (currentDate <= endDateTime) {
      const newStartDateTime = new Date(currentDate);
      const newEndDateTime = new Date(currentDate);

      // Establecer la hora de inicio para cada día
      newStartDateTime.setHours(startDateTime.getHours(), startDateTime.getMinutes(), 0, 0);

      // Establecer la hora de fin para cada día
      if (currentDate.toDateString() === endDateTime.toDateString()) {
        // Si es el último día, usar la hora de fin especificada por el usuario
        newEndDateTime.setHours(endDateTime.getHours(), endDateTime.getMinutes(), 0, 0);
      } else {
        // Si no es el último día, usar la medianoche como hora de fin
        newEndDateTime.setHours(0, 0, 0, 0);
      }

      const nuevoEvento: EventInput = {
        title: formData.title,
        start: newStartDateTime.toISOString(),
        end: newEndDateTime.toISOString()
      };

      // Agregar el evento a la lista de eventos
      this.events.push(nuevoEvento);

      // Actualizar el calendario
      const calendarApi = this.fullcalendar.getApi();
      calendarApi.addEvent(nuevoEvento);

      // Ir al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Enviar el horario al servidor (opcional, dependiendo de tu implementación)
    this.onSubmit(formData);

    // Limpiar el formulario después de agregar el horario
    this.clearForm();
}



  // Enviar el horario al servidor
  onSubmit(scheduleData: any) {
    this.apiService.addSchedule(this.employeeId, scheduleData).subscribe(
      response => {
      },
      error => {
        console.error('Error al agregar el horario:', error);
      }
    );
  }

  editarHorario() {
    // Verificar si hay un evento seleccionado
    if (!this.selectedEvent) {
      console.error('No se ha seleccionado ningún evento para editar.');
      return;
    }
    if (this.formEdit.invalid) {
      return;
    }

    // Obtener los datos del formulario
    const formData = {
      title: this.formEdit.get('title')?.value,
      start_datetime: `${this.formEdit.get('fechaInicio')?.value} ${this.formEdit.get('horaInicio')?.value}`,
      end_datetime: `${this.formEdit.get('fechaFin')?.value} ${this.formEdit.get('horaFin')?.value}`
    };

    // Obtener el ID del evento seleccionado
    const eventId = this.selectedEvent.id;

    // Llamar al método updateSchedule del ApiService para actualizar el evento
    this.apiService.updateSchedule(eventId, formData).subscribe(
      (response) => {
        // Actualización exitosa, actualizar el evento en el frontend
        this.selectedEvent.title = formData.title;
        this.selectedEvent.start_datetime = formData.start_datetime;
        this.selectedEvent.end_datetime = formData.end_datetime;

        window.location.reload();
        // this.closeEditModal(); // Si estás utilizando un modal para la edición

        // Mostrar un mensaje de éxito si es necesario
        console.log('Evento actualizado exitosamente.');
      },
      (error) => {
        // Manejar errores, puedes mostrar un mensaje de error al usuario o registrar el error en la consola
        console.error('Error al actualizar el evento:', error);
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

    const startDate = new Date(`${fechaInicio}T${horaInicio}`);
    const endDate = new Date(`${fechaFin}T${horaFin}`);

    if (startDate > endDate) {
      return { dateRange: true }; // Devuelve un error si la fecha de inicio es posterior a la fecha de fin
    } else if (startDate.getTime() === endDate.getTime() && horaInicio >= horaFin) {
      return { dateRange: true }; // Devuelve un error si la hora de inicio es mayor o igual a la hora de fin en el mismo día
    } else {
      return null; // Retorna nulo si la validación es exitosa
    }
  }

}
