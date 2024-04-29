import { Component } from '@angular/core';

@Component({
  selector: 'app-ausencias',
  templateUrl: './ausencias.component.html',
  styleUrls: ['./ausencias.component.css']
})
export class AusenciasComponent {
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
