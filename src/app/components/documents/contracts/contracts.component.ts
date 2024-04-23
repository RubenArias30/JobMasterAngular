import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent {
  contracts: any[] = [];
  employeeId: string;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
      this.getContractsByEmployee(this.employeeId);
    });
  }

  getContractsByEmployee(employeeId: string): void {
    this.apiService.getDocumentsByEmployeeAndType(employeeId, 'contracts').subscribe(
      (documents: any[]) => {
        this.contracts = documents;
      },
      (error) => {
        console.error('Error fetching contracts:', error);
      }
    );
  }
}
