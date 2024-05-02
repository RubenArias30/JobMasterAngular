import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.css']
})
export class AttendancesComponent {
  showTimer: boolean = false;
  timer: string = '00:00:00';
  startTime!: number;

  constructor(private apiService: ApiService) { }

  registerEntry(): void {
    this.showTimer = true;
    this.startTime = Date.now();
    this.apiService.registerEntry().subscribe(
      response => {
        console.log('Entrada registrada correctamente');
        this.updateTimer();
      },
      error => {
        console.error('Error al registrar la entrada:', error);
      }
    );
  }

  registerExit(): void {
    this.showTimer = false;
    this.apiService.registerExit().subscribe(
      response => {
        console.log('Salida registrada correctamente');
      },
      error => {
        console.error('Error al registrar la salida:', error);
      }
    );
  }

  updateTimer(): void {
    setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - this.startTime;
      this.timer = this.formatTime(elapsedTime);
    }, 1000);
  }

  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
