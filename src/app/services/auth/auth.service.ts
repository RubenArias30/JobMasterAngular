import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private roleKey = 'role';


  constructor() { }

  /**
  * Retrieves the authentication token from local storage.
  * @returns The token as a string, or null if it doesn't exist.
  */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
 * Stores the authentication token in local storage.
 * @param token - The token to be stored.
 */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
 * Removes the authentication token from local storage.
 */
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
  * Removes the user role from local storage.
  */
  removeRole(): void {
    localStorage.removeItem(this.roleKey);
  }

  /**
 * Retrieves the user role from local storage.
 * @returns The role as a string, or null if it doesn't exist.
 */
  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  /**
 * Stores the user role in local storage.
 * @param role - The role to be stored.
 */
  setUserRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  /**
  * Checks if the user is authenticated by verifying the presence of a token.
  * @returns True if a token exists, false otherwise.
  */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Checks if the user has an admin role.
   * @returns True if the user role is 'admin', false otherwise.
   */
  isAdmin(): boolean {
    const role = this.getUserRole();
    return !!role && role === 'admin';
  }

  /**
 * Checks if the user has an employee role.
 * @returns True if the user role is 'empleado', false otherwise.
 */
  isEmployee(): boolean {
    const role = this.getUserRole();
    return !!role && role === 'empleado';
  }

  /**
    * Logs out the user by removing the token and role from local storage.
    */
  logout() {
    this.removeRole();
    this.removeToken();
  }
}
