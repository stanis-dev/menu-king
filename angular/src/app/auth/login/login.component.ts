import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  onSubmit() {
    this.authService.login(this.authForm.value).subscribe((authResponse) => {
      this.authForm.reset();
    });
  }

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {}
}
