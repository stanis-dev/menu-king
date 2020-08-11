import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.autoLogout();

    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
