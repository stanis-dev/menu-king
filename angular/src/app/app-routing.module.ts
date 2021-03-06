import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthComponent } from './auth/auth.component';
import { RecetasComponent } from './recetas/recetas.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NoMenuSelectedComponent } from './dashboard/recetas-lista/no-menu-selected/no-menu-selected.component';
import { RecetasListaComponent } from './dashboard/recetas-lista/recetas-lista.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/menus',
    canActivate: [AuthGuard],
  },
  {
    path: 'recetas',
    component: RecetasComponent,
    canActivate: [AuthGuard],
    children: [{ path: ':recetaId', component: RecetasComponent }],
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
    ],
  },
  {
    path: 'menus',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [{ path: ':menuId', component: DashboardComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
