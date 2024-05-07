import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.css']
})
export class ViewScheduleComponent implements OnInit {
  employeeId!: number;
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
    eventColor: '#92E3A9'
  };

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    console.log('Employee ID obtenida:', this.employeeId); // Console.log para verificar la employeeId

    // Obtener el employeeId de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.employeeId = +params['employeeId']; // Convertir a número
      // Llamar a loadSchedule solo si employeeId está definido
      if (this.employeeId) {
        console.log('Employee ID obtenida:', this.employeeId); // Console.log para verificar la employeeId

        this.loadSchedule();

      }
    });
  }

  loadSchedule(): void {

    this.apiService.getEmployeeSchedule().subscribe(events => {
      // Asignar los eventos al calendario
      this.calendarOptions.events = events;
      console.log('Eventos cargados:', );
    });
  }
}
