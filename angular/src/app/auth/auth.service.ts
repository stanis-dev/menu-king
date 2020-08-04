import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface APIAuthResponse {
  status: string;
  token: string;
  /* TODO eliminate password from the response */
  user: { _id: string; username: string; email: string; password: string };
}

// TODO export interface User {}

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user = new Subject<User>();

  // TODO --> cambiar a Observable??
  isLoading = new Subject<boolean>();
  isLoggedIn = false;

  // TODO --> Add user interface for TP.
  constructor(private http: HttpClient, private router: Router) {}

  /*
  Crear y emitir usuario nuevo,
  redirigir a 'recetas'

  TODO: redirigir a dashboard una vez esté implimentado
  */
  handleAuth(resData): void {
    const newUser = new User(
      resData.user._id,
      resData.user.username,
      resData.user.email,
      new Date(Date.now() + 1000)
    );

    this.isLoading.next(false);
    this.user.next(newUser);
    this.router.navigate(['recetas']);
    this.isLoggedIn = true;
  }

  async handleError(error) {
    this.isLoading.next(false);
    this.isLoggedIn = false;
    console.log(error);
  }

  login(loginForm: { email: string; password: string }) {
    this.isLoading.next(true);
    return this.http
      .post<APIAuthResponse>('/api/v1/users/login', loginForm)
      .pipe(
        catchError((error) => this.handleError(error)),
        tap((resData) => this.handleAuth(resData))
      );
  }

  signup(signupForm: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    this.isLoading.next(true);
    return this.http
      .post('/api/v1/users/registro', signupForm)
      .pipe(tap((resData) => this.handleAuth(resData)));
  }

  isAuthenticated(): boolean {
    document.cookie = 'username=John Doe';
    const token = document.cookie
      .split('; ')
      .filter((cookie) => {
        return cookie.startsWith('jwt');
      })
      .toString();
    console.log(token);

    return true;
  }
}
