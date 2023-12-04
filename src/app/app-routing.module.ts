import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { EmailConfirmedComponent } from './email-confirmed/email-confirmed.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '', component: StartComponent, children: [
      {path: 'register', component: SignUpComponent},
      {path: 'log_in', component: LogInComponent},
      {path: 'reset_pw', component: ResetPasswordComponent},
    ]
  },
    {path: 'email_confirmed', component: EmailConfirmedComponent},
    {path: 'set_new_password', component: SetNewPasswordComponent},
    {path: 'home', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
