import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  authForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
    confirmPassword: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
    ],
  });

  onSubmit() {
    this.authService.signup(this.authForm.value).subscribe((authResponse) => {
      console.log('signed up');
      this.authForm.reset();
    });
  }

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {}
}
