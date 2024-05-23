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

  showModal: boolean = false;
  selectedEvent: any;
  // List of events
  events: EventInput[] = [];

  // Properties for the form and event management
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
  showTimeRangeError: boolean = false;
  showDateRangeError: boolean = false;
  showEqualTimeError: boolean = false;
  showTimeRangeErrorEdit: boolean = false;
  showDateRangeErrorEdit: boolean = false;
  showEqualTimeErrorEdit: boolean = false;
  isFormValid: boolean = false;


  /**
 * Function to customize the content of events in the calendar.
 * @param arg Event argument
 * @returns Custom HTML for the event
 */
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

  /**
    * Method to format the date.
    * @param date Date to format
    * @returns Formatted date in 'YYYY-MM-DD' format
    */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  /**
 * Method to format the time.
 * @param date Time to format
 * @returns Formatted time in 'HH:MM' format
 */
  formatTime(date: Date): string {
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }

  /**
 * Calendar options.
 */
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
    events: this.events,
    eventColor: '#92E3A9',
    eventContent: this.customEventContent,
    eventClick: this.handleEventClick.bind(this)

  };


  /**
   * Constructor of the component.
   * @param route Active route handler
   * @param apiService API service for backend communication
   * @param router Router for navigation
   * @param formBuilder Constructor to build reactive forms
   */
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private formBuilder: FormBuilder) {
    // Initialize the reactive form
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      horaInicio: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      fechaFin: ['', Validators.required],
      horaFin: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]]
    }, { validator: this.dateRangeValidator });
    // Initialize the reactive form
    this.formEdit = this.formBuilder.group({
      title: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      horaInicio: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      fechaFin: ['', Validators.required],
      horaFin: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]]
    }, { validator: this.dateRangeValidator });
    this.isFormValid = false;
  }

  /**
 * Method executed when the component is initialized.
 */
  ngOnInit(): void {
    // Get the employee ID from the route and load its details and events
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.getEmployeeDetails(this.employeeId);
      this.loadEvents(this.employeeId); // Load events from the server
    });
  }

  /**
 * Method to handle click on a calendar event.
 * @param info Event information
 */
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

      // Get all events from the calendar
      const allEvents = info.view.calendar.getEvents();
      // Filter events that have the same start and end times
      const matchingEvents = allEvents.filter((event: { start: Date, end: Date }) => {
        const eventStartTime = this.formatTime(new Date(event.start));
        const eventEndTime = this.formatTime(new Date(event.end));
        return eventStartTime === formattedStartTime && eventEndTime === formattedEndTime;
      });

     // Determine the minimum and maximum dates of matching events
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

      // Update the form with the minimum and maximum dates
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

     /**
   * Opens the modal and sets the selected event.
   * @param event The selected event.
   */
  openModal(event: any) {
    this.selectedEvent = event;
    this.showModal = true;

  }

  /**
   * Closes the modal.
   */
  closeModal() {
    this.showModal = false;
  }

    /**
   * Loads events for the specified employee from the server.
   * @param employeeId The ID of the employee.
   */
  loadEvents(employeeId: number): void {
    this.apiService.getEvents(employeeId).subscribe(
      (events: any[]) => {
        this.events = []; // Clear the events array
        events.forEach(event => {
          const startDate = new Date(event.start_datetime);
          const endDate = new Date(event.end_datetime);

          let currentDate = new Date(startDate); // Start from the start date

          while (currentDate <= endDate) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            const newEvent: EventInput = {
              id: `${event.id}-${currentDate.getTime()}`, // Identificador único
              title: event.title,
              start: `${formattedDate}T${this.getFormattedTime(currentDate)}:00`,
              end: `${formattedDate}T${this.getFormattedTime(endDate)}:00`
            };
            this.events.push(newEvent); // Add event to the array

            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);

            // Check for month change
            if (currentDate.getMonth() !== startDate.getMonth() && currentDate <= endDate) {
               // Generate events for the rest of the month
              while (currentDate.getMonth() === endDate.getMonth() && currentDate <= endDate) {
                const formattedDateNextMonth = currentDate.toISOString().split('T')[0];
                const newEventNextMonth: EventInput = {
                  id: `${event.id}-${currentDate.getTime()}`,  // Unique identifier
                  title: event.title,
                  start: `${formattedDateNextMonth}T${this.getFormattedTime(currentDate)}:00`,
                  end: `${formattedDateNextMonth}T${this.getFormattedTime(endDate)}:00`
                };
                this.events.push(newEventNextMonth); // Add event to the array
                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
              }
            }
          }
        });

        this.calendarOptions.events = this.events; // Update the events in the calendar
      },
      (error) => {
        console.error('Error al obtener los eventos del servidor:', error);
      }
    );
  }

  /**
   * Formats the time part of a given date.
   * @param date The date to format.
   * @returns A string representing the time in "HH:MM" format.
   */
  getFormattedTime(date: Date): string {
    // Formatear la hora en formato HH:MM
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

    /**
   * Combines a date and a time into a single string representing the combined datetime.
   * @param date The date part.
   * @param time The time part.
   * @returns A string representing the combined datetime in ISO format.
   */
  combineDateAndTime(date: Date, time: Date): string {
    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );
    return combinedDateTime.toISOString();
  }

    /**
   * Adds a new schedule based on the form data.
   */
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


   // Check if the end time is on the same day as the start time
    if (
      endDateTime.getDate() === startDateTime.getDate() &&
      endDateTime.getHours() < startDateTime.getHours()
    ) {
      console.error('Error: La hora de finalización debe estar dentro del mismo día que la hora de inicio.');
      return;
    }

    // Iterate over each date between the start date and the end date
    let currentDate = new Date(startDateTime);
    while (currentDate <= endDateTime) {
      // Create the event for the current date
      const nuevoEvento: EventInput = {
        title: formData.title,
        start: this.combineDateAndTime(currentDate, startDateTime),
        end: this.combineDateAndTime(currentDate, endDateTime)
      };
      // Add the event to the event array
      this.events.push(nuevoEvento);
      // Add the event to the calendar
      const calendarApi = this.fullcalendar.getApi();
      calendarApi.addEvent(nuevoEvento);
      // Advance to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Send the schedule to the server
    this.onSubmit(formData);

    // Clear the form after adding the schedule
    this.clearForm();
    this.isFormValid = false;
  }

   /**
   * Submits the schedule data to the server.
   * @param scheduleData The schedule data to submit.
   */
  onSubmit(scheduleData: any) {
    const data = {
      title: scheduleData.title,
      start_datetime: `${scheduleData.fechaInicio}T${scheduleData.horaInicio}`,
      end_datetime: `${scheduleData.fechaFin}T${scheduleData.horaFin}`
    };

    this.apiService.addSchedule(this.employeeId, data).subscribe(
      response => {
        window.location.reload();
      },
      error => {
        console.error('Error al agregar el horario:', error);
        this.showError = true;
      }
    );
  }

   /**
   * Updates the selected schedule with the form data.
   */
  editarHorario() {
    if (!this.selectedEvent) {
      console.error('No se ha seleccionado ningún evento para editar.');
      return;
    }
    if (this.formEdit.invalid) {
      return;
    }

   // Get the form data
    const formData = {
      title: this.formEdit.get('title')?.value,
      start_datetime: `${this.formEdit.get('fechaInicio')?.value} ${this.formEdit.get('horaInicio')?.value}`,
      end_datetime: `${this.formEdit.get('fechaFin')?.value} ${this.formEdit.get('horaFin')?.value}`
    };

    // Obtener el ID del evento seleccionado
    const eventId = this.selectedEvent.id;
    this.apiService.updateSchedule(eventId, formData).subscribe(
      (response) => {
        // Actualización exitosa, actualizar el evento en el frontend
        this.selectedEvent.title = formData.title;
        this.selectedEvent.start_datetime = formData.start_datetime;
        this.selectedEvent.end_datetime = formData.end_datetime;
        window.location.reload();
      },
      (error) => {
        console.error('Error al actualizar el evento:', error);
      }
    );
  }

    /**
   * Deletes the event with the specified ID.
   * @param eventId The ID of the event to delete.
   */
  deleteEvent(eventId: number) {
   // Extract the original event ID from the server
    const originalEventId = eventId.toString().split('-')[0];
    // Filter all related events
    const relatedEvents = this.events.filter(event => event.id && event.id.startsWith(`${originalEventId}-`));

    if (relatedEvents.length > 0) {
      this.apiService.deleteEvent(Number(originalEventId)).subscribe(
        response => {
        // Successful deletion on the server, delete all related events from the array and calendar
          relatedEvents.forEach(event => {
            this.events = this.events.filter(e => e.id !== event.id);
            const calendarEvent = this.fullcalendar.getApi().getEventById(event.id!);
            if (calendarEvent) {
              calendarEvent.remove();
            }
          });
          // Load updated events after deletion
          this.loadEvents(this.employeeId);
          this.showModal = false;
        },
        (error) => {
          console.error('Error al eliminar el evento:', error);
        }
      );
    } else {
      console.error('No se encontró ningún evento con el ID proporcionado:', eventId);
    }
  }

    /**
   * Retrieves employee details based on the employee ID.
   * @param employeeId The ID of the employee.
   */
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
  /**
   * Clears the form fields.
   */
  clearForm(): void {
    this.form.reset();
  }

   /**
   * Navigates back to the schedule page.
   */
  goBack(): void {
    this.router.navigate(['/schedule']);
  }

  /**
   * Checks the date range in the form and sets an error flag if the end date is before the start date.
   * @param editMode Whether the form is in edit mode.
   */
  checkDateRange(editMode: boolean = false) {
    const fechaInicio = new Date(this.form.get('fechaInicio')?.value);
    const fechaFin = new Date(this.form.get('fechaFin')?.value);

    if (fechaFin < fechaInicio) {
      // If the end date is less than the start date, set the error flag
      this.showDateRangeError = !editMode;
    } else {
      // If there is no error, clear the error flag
      this.showDateRangeError = false;
    }

    this.isFormValid = !this.showDateRangeError && !this.showTimeRangeError && !this.showEqualTimeError;
  }

    /**
   * Checks the time range in the form and sets error flags if the end time is before the start time or if the times are equal.
   * @param editMode Whether the form is in edit mode.
   */
  checkTimeRange(editMode: boolean = false) {
    const fechaInicio = this.form.get('fechaInicio')?.value;
    const horaInicio = this.form.get('horaInicio')?.value;
    const fechaFin = this.form.get('fechaFin')?.value;
    const horaFin = this.form.get('horaFin')?.value;

    const horaInicioDate = new Date(`${fechaInicio}T${horaInicio}`);
    const horaFinDate = new Date(`${fechaFin}T${horaFin}`);

   // Check if the end date is less than the start date
    if (fechaFin < fechaInicio || (fechaFin === fechaInicio && horaFin <= horaInicio)) {
      // If the end date is less than or equal to the start date, or if the end time is less than or equal to the start time, set the error flag
      this.showTimeRangeError = !editMode;
    } else if (horaFin === horaInicio) {
      // If the start and end times are equal, set the equal times error flag
      this.showTimeRangeError = false;
      this.showEqualTimeError = !editMode;
    } else {
      // If there is no error, clear the error flag
      this.showTimeRangeError = false;
      this.showEqualTimeError = false;
    }

  // Update the valid form flag
    this.isFormValid = !this.showDateRangeError && !this.showTimeRangeError && !this.showEqualTimeError;
  }
   /**
   * Checks the date range in the edit form and sets error flags if the end time is before the start time or if the times are equal.
   */
  checkDateRangeEdit() {
    const startDate = this.formEdit.get('fechaInicio')?.value;
    const endDate = this.formEdit.get('fechaFin')?.value;
    this.showDateRangeErrorEdit = startDate && endDate && new Date(startDate) > new Date(endDate);
  }

    /**
   * Checks the time range in the edit form and sets error flags if the end time is before the start time or if the times are equal.
   */
  checkTimeRangeEdit() {
    const startTime = this.formEdit.get('horaInicio')?.value;
    const endTime = this.formEdit.get('horaFin')?.value;
    this.showTimeRangeErrorEdit = startTime && endTime && startTime >= endTime;
    this.showEqualTimeErrorEdit = startTime && endTime && startTime === endTime;
  }

    /**
   * Custom validator for checking if the end date/time is before the start date/time.
   * @param formGroup The form group to validate.
   * @returns An object containing validation errors or null if the form group is valid.
   */
  dateRangeValidator(formGroup: FormGroup) {
    const fechaInicio = formGroup.get('fechaInicio')?.value;
    const horaInicio = formGroup.get('horaInicio')?.value;
    const fechaFin = formGroup.get('fechaFin')?.value;
    const horaFin = formGroup.get('horaFin')?.value;

    const startDate = new Date(`${fechaInicio}T${horaInicio}`);
    const endDate = new Date(`${fechaFin}T${horaFin}`);

    if (startDate > endDate) {
      return { dateRange: true };// Returns an error if the check-in date is later than the check-out date
    } else if (startDate.getTime() === endDate.getTime() && horaInicio >= horaFin) {
      return { dateRange: true }; // Returns an error if the check-in time is greater than or equal to the check-out time on the same day
    } else {
      return null;
    }
  }

}
