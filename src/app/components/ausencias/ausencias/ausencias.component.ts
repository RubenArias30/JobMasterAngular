import { Component,OnInit  } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';



@Component({
  selector: 'app-ausencias',
  templateUrl: './ausencias.component.html',
  styleUrls: ['./ausencias.component.css']
})
export class AusenciasComponent {
  employees: any[] = []; // Add this line
  ausenciaForm: FormGroup = this.formBuilder.group({});

  constructor(private apiService: ApiService, private formBuilder: FormBuilder)  {}

  ngOnInit(): void {
    this.apiService.getEmployees().subscribe((employees) => {
      this.employees = employees;


      this.ausenciaForm = this.formBuilder.group({
        name: ['', Validators.required],
        absenceType: ['', Validators.required],
        startDate: ['', [Validators.required, this.validateStartDate]],
        endDate: ['', [Validators.required, this.validateEndDate]],
        description: ['', Validators.required]


        // Add other form controls here
      });
      });
  }
  validateStartDate(control: FormControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
    const maxStartDate = new Date();
    maxStartDate.setFullYear(currentDate.getFullYear() + 1); // Set max start date to one year from current date

    if (selectedDate < currentDate || selectedDate > maxStartDate) {
      return { invalidStartDate: true };
    }
    return null;
  }


  validateEndDate(control: FormControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setDate(currentDate.getDate() + 365); // Set max future date to 1 year from now
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight
    if (selectedDate < currentDate || selectedDate > maxFutureDate) {
      return { invalidEndDate: true };
    }
    return null;
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

  onSubmit(): void {
    // Add your form submission logic here
  }


}
