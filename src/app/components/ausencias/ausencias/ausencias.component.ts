import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';


@Component({
  selector: 'app-ausencias',
  templateUrl: './ausencias.component.html',
  styleUrls: ['./ausencias.component.css']
})
export class AusenciasComponent {
  employees: any[] = []; // Add this line
  substitutes: any[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getEmployees().subscribe((employees) => {
      this.employees = employees;
    });
  }
  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  isSwitchLeft = true; // Assuming this is your initial state for the switch
  selectedOption: string = 'Medio día'; // Set the initial selected option here

  toggleSwitch(option: string) {
    this.selectedOption = option;
    this.isSwitchLeft = !this.isSwitchLeft;
  }

}
