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
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(state.url);
    return this.checkLogin(state.url);
  }

  checkLogin(path): boolean {
    if (this.authService.isLoggedIn && path === '/auth') {
      this.router.navigate(['recetas']);
      return false;
    } else if (this.authService.isLoggedIn && path !== '/auth') {
      return true;
    } else if (!this.authService.isLoggedIn && path === '/auth') {
      return true;
    } else {
      return false;
    }

    // TODO: display error if user attempt to acces forbidden route
  }
}
