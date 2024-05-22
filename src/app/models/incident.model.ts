export interface Incident {
  id: number;
  incident_type: string;
  description: string;
  date: string;
  employee: Employee;
}

// employee.model.ts
export interface Employee {
  id: number;
  name: string;
  surname: string;
  email: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  telephone: string;
  country: string;
  photo?: string;
}
