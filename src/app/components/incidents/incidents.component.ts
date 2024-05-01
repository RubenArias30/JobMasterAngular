import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit {
  incidences: any[] = [];


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getIncidents();
  }

  getIncidents(): void {
    this.apiService.getAllIncidents()
      .subscribe((data: any[]) => {
        this.incidences = data;
      });
  }
}
