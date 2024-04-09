import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  employees: any[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getEmployees().subscribe((data: any) => {
      this.employees = data;
    });
  }
}