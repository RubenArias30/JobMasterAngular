import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {

   // List of events
  events: EventInput[] = [];

    /**
   * Custom event content renderer.
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
     // Format hour and minute with leading zeros if necessary
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

    return `${formattedHour}:${formattedMinute}`;
  }

    /**
   * Formats a date to a string with the format YYYY-MM-DD.
   * @param date - The Date object or string to format.
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
    eventColor: '#92E3A9',
    eventContent: this.customEventContent,
    events: []
  };

  constructor(private apiService: ApiService,  private authService: AuthService) {}

  ngOnInit(): void {
    this.viewScheduleEmployees();
  }

    /**
   * Retrieves and displays the schedule for employees.
   */
  viewScheduleEmployees(): void {
    this.apiService.getScheduleForEmployee()
      .subscribe(
        (events: any[]) => {
          this.events = [];
          events.forEach(event => {
            const startDate = new Date(event.start_datetime);
            const endDate = new Date(event.end_datetime);

            let currentDate = new Date(startDate); // Start at the start date

            while (currentDate <= endDate) {
              const formattedDate = currentDate.toISOString().split('T')[0];
              const newEvent: EventInput = {
                id: event.id,
                title: event.title,
                start: `${formattedDate}T${this.getFormattedTime(currentDate)}:00`,
                end: `${formattedDate}T${this.getFormattedTime(endDate)}:00`
              };
              this.events.push(newEvent);

               // Move to the next day
              currentDate.setDate(currentDate.getDate() + 1);

              // Check if there is a month change
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
                  currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
                }
              }
            }
          });

          this.calendarOptions.events = this.events; // Update the events in the calendar
        },
        error => {
          console.error('Error al obtener los horarios:', error);
        }
      );
  }

    /**
   * Formats a Date object to a string with the format HH:mm.
   * @param date - The Date object to format.
   * @returns The formatted time string.
   */
  getFormattedTime(date: Date): string {
   // Format the time as HH:MM
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
}
