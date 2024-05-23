import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {}

   /**
   * Intercepts HTTP requests to add a JWT token (if available) to the Authorization header.
   * @param req - The outgoing HTTP request
   * @param next - The next handler in the chain
   * @returns An observable that emits HTTP events
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = this.authService.getToken(); // Retrieve the token from AuthService
    let request = req;

     // If a token is available, clone the request and add the Authorization header
    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Handle the request and catch errors
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // If a 401 error occurs, log out the user and redirect to the login page
          this.authService.logout();
          this.router.navigateByUrl('/login');
        }
        return throwError(err); // Propagate the error
      })
    );
  }
}
