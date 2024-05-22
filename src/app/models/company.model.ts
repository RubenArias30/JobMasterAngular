export class Company {
  id: number;
  company_name: string;
  company_telephone: string;
  company_nif: string;
  company_email: string;
  company_street: string;
  company_city: string;
  company_postal_code: number;

  constructor(id: number,company_name: string,company_telephone: string,company_nif: string,company_email: string,company_street: string,company_city: string,company_postal_code: number
  ) {
    this.id = id;
    this.company_name = company_name;
    this.company_telephone = company_telephone;
    this.company_nif = company_nif;
    this.company_email = company_email;
    this.company_street = company_street;
    this.company_city = company_city;
    this.company_postal_code = company_postal_code;
  }
}
