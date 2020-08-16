import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { UtilsService } from './shared/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  isAuthenticated: boolean;

  constructor(
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.authService.autoLogout();

    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    this.utilsService.documentClickedTarget.next(event.target);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
