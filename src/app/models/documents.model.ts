import { Employee } from "./employee.model";

export class Document {
  id: number;
  type_documents: string;
  name: string;
  description: string;
  date: Date;
  route: string;
  employee?: Employee;

  constructor(id: number,type_documents: string,name: string,description: string,date: Date,route: string,employee?: Employee
  ) {
    this.id = id;
    this.type_documents = type_documents;
    this.name = name;
    this.description = description;
    this.date = date;
    this.route = route;
    this.employee = employee;
  }
}
