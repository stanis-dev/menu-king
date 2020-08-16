import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { RecetasComponent } from './recetas/recetas.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AnalisisComponent } from './recetas/analisis/analisis.component';

import { AuthInterceptor } from './auth/auth.interceptor';
import { MenuListComponent } from './dashboard/menu-list/menu-list.component';
import { DatosNutricionalesComponent } from './dashboard/datos-nutricionales/datos-nutricionales.component';
import { RecetasListaComponent } from './dashboard/recetas-lista/recetas-lista.component';
import { CrearMenuComponent } from './dashboard/crear-menu/crear-menu.component';
import { ClosePopupDirective } from './shared/closePopup.directive';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    HeaderComponent,
    RecetasComponent,
    SpinnerComponent,
    LoginComponent,
    SignupComponent,
    AnalisisComponent,
    MenuListComponent,
    DatosNutricionalesComponent,
    RecetasListaComponent,
    CrearMenuComponent,
    ClosePopupDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
