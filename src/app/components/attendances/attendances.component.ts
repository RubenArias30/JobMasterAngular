import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.css']
})
export class AttendancesComponent implements OnInit, OnDestroy {
  showTimer: boolean = false;
  timer: string = '00:00:00';
  startTime: number | null = null;
  timerInterval: any;
  currentUser!: string;
  entryActive: boolean = false;
  lastEntryDate: Date | null = null;
  lastExitDate: Date | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCurrentUserId();
    this.fetchLastExitDate(); // Recuperar la última fecha de salida al inicializar el componente
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  getCurrentUserId(): void {
    this.apiService.getLoggedInUserName().subscribe(
      response => {
        this.currentUser = response.name;
        this.fetchStartTime();
      },
      error => {
        console.error('Error al obtener los datos del usuario:', error);
      }
    );
  }

  fetchStartTime(): void {
    const storedStartTime = localStorage.getItem(`startTime_${this.currentUser}`);
    if (storedStartTime) {
      this.startTime = parseInt(storedStartTime, 10);
      this.lastEntryDate = new Date(parseInt(storedStartTime, 10));
      this.entryActive = true;
      this.showTimer = true;
      this.updateTimer();
    }
  }

  fetchLastExitDate(): void {
    this.apiService.getLastExitDate().subscribe(
      (response: any) => {
        if (response.lastExitDate) {
          this.lastExitDate = new Date(response.lastExitDate);
        } else {
          this.lastExitDate = null;
        }
      },
      error => {
        console.error('Error al obtener la última fecha de salida:', error);
      }
    );
  }

  updateTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.startTime !== null) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTime!;
        this.timer = this.formatTime(elapsedTime);
      }
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

  registerEntry(): void {
    const storedStartTime = localStorage.getItem(`startTime_${this.currentUser}`);
    if (storedStartTime) {
      console.error('Ya hay un registro de entrada activo para este usuario');
      return;
    }

    this.showTimer = true;
    this.startTime = Date.now();
    localStorage.setItem(`startTime_${this.currentUser}`, this.startTime.toString());
    this.entryActive = true;
    this.lastEntryDate = new Date(); // Formatear la fecha actual
    this.updateTimer();
    this.apiService.registerEntry().subscribe(
      response => {
        console.log('Entrada registrada correctamente');
      },
      error => {
        console.error('Error al registrar la entrada:', error);
      }
    );
  }

  registerExit(): void {
    this.showTimer = false;
    clearInterval(this.timerInterval);

    // Llamar al servicio para registrar la salida en la base de datos
    this.apiService.registerExit().subscribe(
      (response: any) => {
        console.log('Salida registrada correctamente');
        if (response && response.exitDate) {
          // Si la respuesta contiene la fecha de salida, actualiza lastExitDate
          this.lastExitDate = new Date(response.exitDate);
        } else {
          // Si la respuesta no contiene la fecha de salida, establece lastExitDate como la fecha actual
          this.lastExitDate = new Date();
        }

        // Actualizar el temporizador con el tiempo total recibido del servidor
        this.timer = response.total_time; // Suponiendo que el servidor devuelve el tiempo total
        this.entryActive = false; // Cambiar el estado de entrada a falso después de finalizar la jornada
        localStorage.removeItem(`startTime_${this.currentUser}`);
      },
      error => {
        console.error('Error al registrar la salida:', error);
      }
    );
  }

  formatDateTime(dateTime: Date): string {
    // Formatear la fecha y hora en el formato deseado
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return dateTime.toLocaleString(undefined, options);
  }
}
