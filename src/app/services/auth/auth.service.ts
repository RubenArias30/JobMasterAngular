import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private roleKey = 'role';


  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
  removeRole(): void {
    localStorage.removeItem(this.roleKey);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  setUserRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return !!role && role === 'admin';
  }


  logout(){
    this.removeRole();
    this.removeToken();
  }
}
