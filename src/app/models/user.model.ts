export class User {
  id: number;
  nif: string;
  password: string;
  roles: 'admin' | 'empleado';

  constructor(
    id: number,
    nif: string,
    password: string,
    roles: 'admin' | 'empleado',
  ) {
    this.id = id;
    this.nif = nif;
    this.password = password;
    this.roles = roles;
  }
}
