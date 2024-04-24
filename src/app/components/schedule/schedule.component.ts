import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  employees: any[] = [];

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.getEmployees();
  }
  getEmployees(): void {
  this.apiService.getEmployees().subscribe(
    (response: any[]) => {
      this.employees = response;
    },
    (error) => {
      console.error('Error al obtener la lista de empleados:', error);
    }
  );
}

}
