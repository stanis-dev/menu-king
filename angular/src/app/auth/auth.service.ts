import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authResponse: Observable<any>;
  constructor(private http: HttpClient) {}

  login(loginForm: { email: string; password: string }) {
    return this.http.post('/api/v1/users/login', loginForm);
  }
}
