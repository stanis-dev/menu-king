import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, ObservableInput } from 'rxjs';

import { AuthService } from './auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  // TODO: Revisar
  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response) => {
          console.log('response ' + JSON.stringify(response));
          this.isRefreshing = false;
          this.refreshTokenSubject.next(this.authService.getCookie());

          return next.handle(req);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((cookie) => cookie != null),
        take(1),
        switchMap((response) => {
          return next.handle(response);
        })
      );
    }
  }

  constructor(public authService: AuthService) {}
}
