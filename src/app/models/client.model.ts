export class Client {
  id: number;
  client_name: string;
  client_telephone: string;
  client_nif: string;
  client_email: string;
  client_street: string;
  client_city: string;
  client_postal_code: number;

  constructor(
    id: number,client_name: string,client_telephone: string,client_nif: string, client_email: string,client_street: string, client_city: string,client_postal_code: number
  ) {
    this.id = id;
    this.client_name = client_name;
    this.client_telephone = client_telephone;
    this.client_nif = client_nif;
    this.client_email = client_email;
    this.client_street = client_street;
    this.client_city = client_city;
    this.client_postal_code = client_postal_code;
  }
}
