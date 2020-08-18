import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<string>(null);
  // TODO --> cambiar a Observable??
  isLoading = new Subject<boolean>();
  refreshTokenExpiration: Date;
  // TODO --> quitar loading de aquí y limitarlo al componente

  // TODO --> Add user interface for TP.
  constructor(private http: HttpClient, private router: Router) {}

  /*
  Crear y emitir usuario nuevo,
  redirigir a 'dashboard'
  */
  handleAuth(resData): void {
    const newUser = new User(
      resData.user._id,
      resData.user.username,
      resData.user.email,
      new Date(Date.now() + 1000)
    );

    this.isLoading.next(false);
    this.user.next(newUser.username);
    this.router.navigate(['']);
  }

  async handleError(error): Promise<void> {
    this.isLoading.next(false);
    console.log(error);
  }

  login(loginForm: { email: string; password: string }): Observable<boolean> {
    this.isLoading.next(true);
    return this.http.post<any>('/api/v1/users/login', loginForm).pipe(
      catchError((error) => this.handleError(error)),
      tap((resData) => this.handleAuth(resData))
    );
  }

  autoLogin() {
    const authCookie = this.getCookie();
    console.log(authCookie);
    if (!authCookie) {
      this.user.next(null);
    }

    this.user.next(authCookie);
  }

  refreshToken(): Observable<any> {
    console.log('refreshing');
    return this.http.get<any>('/api/v1/users/refresh');
  }

  logout() {
    this.http.get<any>('/api/v1/users/logout').subscribe();
    this.user.next(null);
    this.router.navigate(['auth']);
  }

  autoLogout() {
    const authCookie = this.getCookie();

    if (!authCookie) {
      this.user.next(null);
    }
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

  getCookie(): string {
    return document.cookie
      .split('; ')
      .filter((cookie) => cookie.startsWith('session='))[0];
  }

  /* isAuthenticated(): boolean {
    const token = document.cookie
      .split('; ')
      .filter((cookie) => {
        return cookie.startsWith('jwt');
      })
      .toString();
    console.log(token);

    return true;
  } */
}
