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
  showError: boolean = false;
  showErrorField: boolean = false;

  /**
   * Custom event content renderer
   * @param arg - Event content arguments
   * @returns Custom HTML content
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
 * Formats a Date object to a string with the format HH:mm.
 * @param date - The Date object to format.
 * @returns The formatted time string.
 */
  formatTime(date: Date): string {
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Formatear hora y minuto con ceros a la izquierda si es necesario
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

    return `${formattedHour}:${formattedMinute}`;
  }

  /**
 * Formats a date string or Date object to a string with the format YYYY-MM-DD.
 * @param date - The date string or Date object to format.
 * @returns The formatted date string.
 */
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

  // Calendar options
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

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private formBuilder: FormBuilder) {
    // Initialize the reactive form
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      horaInicio: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      fechaFin: ['', Validators.required],
      horaFin: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]]
    }, { validator: this.dateRangeValidator });
  }

  ngOnInit(): void {
    // Get the employee ID from the route and load their details and events
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.getEmployeeDetails(this.employeeId);
      this.loadEvents(this.employeeId); // Load events from the server
    });
  }


  /**
   * Handles the event click action in the calendar.
   * @param info - Event click information.
   */
  handleEventClick(info: any) {
    if (info.event) {
      console.log('ID del evento:', info.event.id);

      // Store the selected event information in a variable
      this.selectedEvent = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
      };

      this.showModal = true;
    }
  }

  /**
   * Opens the edit form for the selected event.
   */
  openEditForm() {
    // Check if an event is selected
    if (!this.selectedEvent) {
      console.error('No se ha seleccionado ningún evento para editar.');
      return;
    }

    // Get the event title
    const title = this.selectedEvent.title;

    // Get the start and end dates of the selected event
    const startDate = this.selectedEvent.start;
    const endDate = this.selectedEvent.end;

    // Calculate the start and end dates and times in ISO string format
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the duration of the event in milliseconds
    const durationMs = end.getTime() - start.getTime();

    // Calculate the start and end dates and times in ISO string format
    const formattedStartDate = this.formatDate(start);
    const formattedStartTime = this.formatTime(start);
    const formattedEndDate = this.formatDate(end);
    const formattedEndTime = this.formatTime(end);

    // Initialize the edit form with the full date and time range of the selected event
    this.form.patchValue({
      title: title,
      fechaInicio: formattedStartDate,
      horaInicio: formattedStartTime,
      fechaFin: formattedEndDate,
      horaFin: formattedEndTime
    });

    // close the modal
    this.closeModal();
  }



  // Function to show the modal and pass the selected event
  openModal(event: any) {
    this.selectedEvent = event;
    this.showModal = true;
  }

  // Function to close the modal
  closeModal() {
    this.showModal = false;
  }

  /**
  * Loads events for a specific employee from the server.
  * @param employeeId - The ID of the employee.
  */
  loadEvents(employeeId: number): void {
    this.apiService.getEvents(employeeId).subscribe(
      (events: any[]) => {
        this.events = [];  // Clear the list of events
        events.forEach(event => {
          const startDate = new Date(event.start_datetime);
          const endDate = new Date(event.end_datetime);

          let currentDate = new Date(startDate); // Start at the start date

          while (currentDate <= endDate) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            const newEvent: EventInput = {
              id: event.id, // Make sure to include the id property
              title: event.title,
              start: `${formattedDate}T${this.getFormattedTime(currentDate)}:00`,
              end: `${formattedDate}T${this.getFormattedTime(endDate)}:00`
            };
            this.events.push(newEvent); // Add event to the list

            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);

            // Check for a month change
            if (currentDate.getMonth() !== startDate.getMonth() && currentDate <= endDate) {
              // Generate events for the rest of the month
              while (currentDate.getMonth() === endDate.getMonth() && currentDate <= endDate) {
                const formattedDateNextMonth = currentDate.toISOString().split('T')[0];
                const newEventNextMonth: EventInput = {
                  title: event.title,
                  start: `${formattedDateNextMonth}T${this.getFormattedTime(currentDate)}:00`,
                  end: `${formattedDateNextMonth}T${this.getFormattedTime(endDate)}:00`
                };
                this.events.push(newEventNextMonth); // Add event to the list
                currentDate.setDate(currentDate.getDate() + 1); // Add event to the list
              }
            }
          }
        });

        this.calendarOptions.events = this.events; // Update the events in the calendar
        console.log('Eventos en formato EventInput:', this.events);
      },
      (error) => {
        console.error('Error al obtener los eventos del servidor:', error);
      }
    );
  }

  /**
 * Formats a Date object to a string with the format HH:mm.
 * @param date - The Date object to format.
 * @returns The formatted time string.
 */
  getFormattedTime(date: Date): string {
    // Format the time in HH:MM format
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  /**
   * Edits a schedule event.
   */
  editarHorario() {
    // Check if an event is selected
    if (!this.selectedEvent) {
      console.error('No se ha seleccionado ningún evento para editar.');
      return;
    }
    // Get form data
    const formData = {
      title: this.form.get('title')?.value,
      start_datetime: `${this.form.get('fechaInicio')?.value} ${this.form.get('horaInicio')?.value}`,
      end_datetime: `${this.form.get('fechaFin')?.value} ${this.form.get('horaFin')?.value}`
    };

    // Get the ID of the selected event
    const eventId = this.selectedEvent.id;

    // Get the ID of the selected event
    this.apiService.updateSchedule(eventId, formData).subscribe(
      (response) => {

        //goes to the same event
      },
      (error) => {
        console.error('Error al actualizar el evento:', error);
      }
    );
  }



  /**
   * Submits the schedule to the server.
   * @param scheduleData - Schedule data to submit.
   */
  onSubmit(scheduleData: any) {

  }


  /**
   * Gets the details of the employee from the server.
   * @param employeeId - The ID of the employee.
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
 * Clears the form.
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
 * Custom validator to ensure that the start date is before the end date.
 * @param formGroup - The form group containing the start and end date fields.
 * @returns An object if the validation fails, null otherwise.
 */
  dateRangeValidator(formGroup: FormGroup) {
    const fechaInicio = formGroup.get('fechaInicio')?.value;
    const horaInicio = formGroup.get('horaInicio')?.value;
    const fechaFin = formGroup.get('fechaFin')?.value;
    const horaFin = formGroup.get('horaFin')?.value;

    if (fechaInicio !== fechaFin) {
      if (fechaInicio > fechaFin) {
        return { dateRange: true }; // Returns an error if the start date is after the end date
      } else {
        return null; // Returns null if validation succeeds
      }
    } else {
      if (horaInicio >= horaFin) {
        return { dateRange: true }; // Returns an error if the start time is greater than or equal to the end time on the same day
      } else {
        return null; // Returns null if validation succeeds
      }
    }
  }
}
