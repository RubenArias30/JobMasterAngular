export class Address {
  id: number;
  street: string;
  city: string;
  postal_code: number;

  constructor(id: number, street: string, city: string, postal_code: number) {
    this.id = id;
    this.street = street;
    this.city = city;
    this.postal_code = postal_code;
  }
}
