import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private snackBar = inject(MatSnackBar);

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(
        error => this.handleError(error)
      )
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      if (error?.message) {
        this.snackBar.open(
          error.message,
          " x ",
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ["color:white;"]
          }
        )
      }
    }

    return throwError(() => error);
  }
}
