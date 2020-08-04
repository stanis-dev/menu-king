import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService, APIAuthResponse } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authMode = 'registro';
  authForm =
    this.authMode === 'acceso'
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
    if (this.authMode === 'acceso') {
      this.authService
        .login(this.authForm.value)
        .subscribe((authResponse: APIAuthResponse) => {
          console.log('authed');
        });
    } else {
      this.authService.signup(this.authForm.value).subscribe((authResponse) => {
        console.log('signed up');
      });
    }
  }

  onCookie() {
    this.authService.isAuthenticated();
  }

  onSwitchMode() {
    this.authMode = this.authMode === 'registro' ? 'acceso' : 'registro';
    console.log(this.authMode);
  }
}
