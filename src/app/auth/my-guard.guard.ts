import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
//https://codingpotions.com/angular-seguridad
export class MyGuardGuard implements CanActivate {
  constructor(private route:Router){

  }
  canActivate():any {
    //console.log("erererer",usuario);
    if(localStorage.getItem('token')){
      return true;
    }
      this.route.navigate(['/login']);
      return false;
  }

}
