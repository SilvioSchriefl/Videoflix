import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { FormsModule } from '@angular/forms';
import { EmailConfirmedComponent } from './email-confirmed/email-confirmed.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InerceptorService } from './inerceptor.service';
import { AuthenticationService } from './authentication.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    SignUpComponent,
    LogInComponent,
    EmailConfirmedComponent,
    ResetPasswordComponent,
    SetNewPasswordComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    ImageSliderComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InerceptorService,
      multi: true
     }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
