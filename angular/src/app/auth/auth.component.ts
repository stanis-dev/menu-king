import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, APIAuthResponse } from './auth.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authMode = 'registro';
  authForm =
    this.authMode === 'registro'
      ? this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(20),
            ],
          ],
        })
      : this.fb.group({
          username: [''],
          email: [''],
          password: [''],
          confirmPassword: [''],
        });

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.authService
      .login(this.authForm.value)
      .subscribe((authResponse: APIAuthResponse) => {
        console.log('authed');
      });
  }

  onCookie() {
    this.authService.isAuthenticated();
  }
}
