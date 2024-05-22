import { Employee } from "./employee.model";

export class Incident {
  id: number;
  incident_type: string;
  description: string;
  date: Date;
  status: 'completed' | 'pending';
  employee?: Employee;

  constructor(id:number,incident_type:string,description:string,date:Date, status: 'completed' | 'pending' ,employee?: Employee){
    this.id = id;
    this.incident_type = incident_type;
    this.description = description;
    this.date = date;
    this.status = status;
    this.employee = employee;
  }
}

