import { Address } from "./adress.model";
import { User } from "./user.model";

export class Employee {
  id: number;
  name: string;
  surname: string;
  email: string;
  telephone: string;
  country: string;
  gender: string;
  date_of_birth: string;
  photo: string;
  users?: User;
  addresses?: Address;
  constructor(id: number, name: string, surname: string, email: string, telephone: string, country: string,gender: string, date_of_birth:string, photo: string,users?: User,adresses?: Address) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.telephone = telephone;
    this.country = country;
    this.gender = gender;
    this.date_of_birth = date_of_birth;
    this.photo = photo;
    this.users = users;
    this.addresses = adresses;
  }
}
