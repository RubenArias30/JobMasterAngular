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
  entryActive: boolean = false; // Variable para controlar si hay una entrada activa

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCurrentUserId();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval); // Limpiar el intervalo cuando el componente se destruye
  }

  getCurrentUserId(): void {
    this.apiService.getLoggedInUserName().subscribe(
      response => {
        this.currentUser = response.name;
        console.log('Datos del usuario:', this.currentUser);
        this.fetchStartTime(); // Llama a fetchStartTime después de obtener el nombre de usuario
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
      this.entryActive = true; // Hay una entrada activa para este usuario
      this.showTimer = true;
      this.updateTimer();
    }
  }

  updateTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.startTime !== null) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTime!;
        this.timer = this.formatTime(elapsedTime);
      }
    }, 1000);

    console.log(this.timer);
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
    // Verificar si hay un registro de tiempo de inicio en localStorage para el usuario actual
    const storedStartTime = localStorage.getItem(`startTime_${this.currentUser}`);
    if (storedStartTime) {
      // Si hay un registro activo para este usuario, solo mostrar un mensaje de error
      console.error('Ya hay un registro de entrada activo para este usuario');
      return;
    }

    // Si no hay un registro activo para este usuario, continuar con el registro de la entrada
    this.showTimer = true;
    this.startTime = Date.now();
    localStorage.setItem(`startTime_${this.currentUser}`, this.startTime.toString());
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
    localStorage.removeItem(`startTime_${this.currentUser}`);
    this.entryActive = false; // Marcar la entrada como no activa
    this.apiService.registerExit().subscribe(
      response => {
        console.log('Salida registrada correctamente');
      },
      error => {
        console.error('Error al registrar la salida:', error);
      }
    );
  }
}
