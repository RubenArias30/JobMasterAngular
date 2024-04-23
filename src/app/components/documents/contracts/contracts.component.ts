import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
  contracts: any[] = [];
  employeeId: string = '';
  employeeName: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
      this.getContractsByEmployee(this.employeeId);
    });

  }

  getContractsByEmployee(employeeId: string): void {
    this.apiService.getDocumentsByEmployeeAndType('contracts', employeeId).subscribe(
      (documents: any[]) => {
        this.contracts = documents;
        this.employeeName = documents.length > 0 ? documents[0].employee_name : ''; // Asignamos el nombre del empleado
      },
      (error) => {
        console.error('Error fetching contracts:', error);
      }
    );
  }
}
