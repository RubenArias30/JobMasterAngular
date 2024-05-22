import { Employee } from "./employee.model";

export class Absence {
  id: number;
  start_date: Date;
  end_date: Date;
  type_absence: 'vacation' | 'sick_leave' | 'maternity/paternity' | 'compensatory' | 'leave' | 'others';
  motive: string;
  employee?: Employee;

  constructor(id: number, start_date: Date, end_date: Date, type_absence: 'vacation' | 'sick_leave' | 'maternity/paternity' | 'compensatory' | 'leave' | 'others', motive: string, employee?: Employee) {
    this.id = id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.type_absence = type_absence;
    this.motive = motive;
    this.employee = employee;
  }
}
