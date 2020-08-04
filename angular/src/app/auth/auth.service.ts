import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

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
  // TODO --> Add user interface for TP.
  constructor(private http: HttpClient) {}

  // TODO: Abstract handleAuth for login and signup
  handleAuth(resData) {
    const newUser = new User(
      resData.user._id,
      resData.user.username,
      resData.user.email,
      new Date(Date.now() + 1000)
    );

    this.user.next(newUser);
  }

  login(loginForm: { email: string; password: string }) {
    return this.http
      .post<APIAuthResponse>('/api/v1/users/login', loginForm)
      .pipe(tap((resData) => this.handleAuth(resData)));
  }

  signup(signupForm: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
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
