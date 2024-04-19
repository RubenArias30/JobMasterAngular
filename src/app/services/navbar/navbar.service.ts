// navbar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private _showNavbar = new BehaviorSubject<boolean>(true);
  showNavbar$ = this._showNavbar.asObservable();

  toggleNavbar() {
    this._showNavbar.next(!this._showNavbar.value);
  }
}
