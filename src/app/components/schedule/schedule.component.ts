import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
  };

  title: string = '';
  startDate: string = '';
  endDate: string = '';
  startTime: string = '';
  endTime: string = '';

  onSubmit() {
    // Aquí puedes manejar la lógica para agregar el evento
    console.log('Título:', this.title);
    console.log('Fecha de inicio:', this.startDate, this.startTime);
    console.log('Fecha de fin:', this.endDate, this.endTime);
    // Puedes enviar estos datos al backend para procesarlos
  }
}
