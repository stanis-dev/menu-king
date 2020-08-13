import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  isLoggedIn: boolean;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.authService.user.subscribe((user) => {
      console.log('user is: ' + user);
      if (user && state.url === '/auth') {
        this.router.navigate(['recetas']);
        this.isLoggedIn = false;
      } else if (user && state.url !== '/auth') {
        this.isLoggedIn = true;
      } else if (!user && state.url === '/auth') {
        this.isLoggedIn = true;
      } else {
        this.router.navigate(['auth']);
        this.isLoggedIn = false;
      }
    });

    // TODO: display error if user attempt to acces forbidden route

    return this.isLoggedIn;
  }
}
