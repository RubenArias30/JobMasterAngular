export class Employee {
  id: number;
  name: string;
  surname: string;
  email: string;
  telephone: string;
  country: string;
  photo: string; // Suponiendo que la foto es una URL

  constructor(id: number, name: string, surname: string, email: string, telephone: string, country: string, photo: string) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.telephone = telephone;
    this.country = country;
    this.photo = photo;
  }
}
