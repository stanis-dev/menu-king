import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoading = false;
  isLoadingSub: Subscription;
  authMode = 'registro';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoadingSub = this.authService.isLoading.subscribe((loadingBool) => {
      this.isLoading = loadingBool;
    });
  }

  ngOnDestroy() {
    this.isLoadingSub.unsubscribe();
  }
}
