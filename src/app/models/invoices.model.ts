import { Company } from './company.model';
import { Client } from './client.model';

export class Invoice {
  id: number;
  subtotal: number;
  invoice_discount: number | null;
  invoice_iva: number;
  invoice_irpf: number;
  total: number;
  companies?: Company;
  clients?: Client;

  constructor(id: number,subtotal: number,invoice_discount: number | null,invoice_iva: number,invoice_irpf: number,total: number,companies?: Company,clients?: Client
  ) {
    this.id = id;
    this.subtotal = subtotal;
    this.invoice_discount = invoice_discount;
    this.invoice_iva = invoice_iva;
    this.invoice_irpf = invoice_irpf;
    this.total = total;
    this.companies = companies;
    this.clients = clients;
  }
}
