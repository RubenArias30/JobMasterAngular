import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-attendances',
  templateUrl: './attendances.component.html',
  styleUrls: ['./attendances.component.css']
})
export class AttendancesComponent implements OnInit, OnDestroy {
  // Properties to control the visibility of the timer and store its value
  showTimer: boolean = false;
  timer: string = '00:00:00';

  // Properties related to start time and timer
  startTime: number | null = null;
  timerInterval: any;

  // Current user name and entry status
  currentUser!: string;
  entryActive: boolean = false;

  // Dates of the last recorded entry and exit
  lastEntryDate: Date | null = null;
  lastExitDate: Date | null = null;

  constructor(private apiService: ApiService) { }

  /**
   * Method executed when the component is initialized.
   * Retrieves the current user's ID and last exit date.
   */

  ngOnInit(): void {
    this.getCurrentUserId();
    this.fetchLastExitDate(); // Recuperar la última fecha de salida al inicializar el componente
  }

  /**
   * Method executed when the component is destroyed.
   * Stops the timer interval.
   */
  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  /**
   * Method to get the ID of the current user.
   * Retrieves the user name and start time, if any.
   */

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

  /**
   * Method to retrieve the start time of the current day, if it exists.
   * Update timer related properties.
   */

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

  /**
   * Method to retrieve the last recorded departure date.
   * Updates the lastExitDate property.
   */
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

  /**
   * Method to update the timer of the active day.
   * Updates the timer property every second.
   */
  updateTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.startTime !== null) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTime!;
        this.timer = this.formatTime(elapsedTime);
      }
    }, 1000);
  }

  /**
   * Method to format a given time in HH:MM:SS format.
   * @param milliseconds Time in milliseconds to format.
   * @returns Time formatted in HH:MM:SS format.
   */
  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  /**
   * Method to add a zero in front of a number if it is less than 10.
   * @param num Number to format.
   * @returns String formatted with leading zero if necessary.
   */
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  /**
   * Method to record an employee entry.
   * Save the start time to localStorage and call the API service to log the input.
   */
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

  /**
   * Method to record an employee departure.
   * Stop timer, log output to API service
   * and updates the last recorded departure date.
   */
  registerExit(): void {
    this.showTimer = false;
    clearInterval(this.timerInterval);
    this.apiService.registerExit().subscribe(
      (response: any) => {
        console.log('Salida registrada correctamente');
        if (response && response.exitDate) {
         // If the response contains the exit date, update lastExitDate
          this.lastExitDate = new Date(response.exitDate);
        } else {
          // If the response does not contain the exit date, set lastExitDate to the current date
          this.lastExitDate = new Date();
        }

        // Update the timer with the total time received from the server
        this.timer = response.total_time;
        this.entryActive = false; // Change the input status to false after the end of the day
        localStorage.removeItem(`startTime_${this.currentUser}`);
      },
      error => {
        console.error('Error al registrar la salida:', error);
      }
    );
  }

    /**
   * Método para formatear una fecha y hora en un formato deseado.
   * @param dateTime Fecha y hora a formatear.
   * @returns Fecha y hora formateadas en el formato deseado.
   */
  formatDateTime(dateTime: Date): string {
    // Formatear la fecha y hora en el formato deseado
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return dateTime.toLocaleString(undefined, options);
  }
}
