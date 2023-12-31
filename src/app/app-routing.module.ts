import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { EmailConfirmedComponent } from './email-confirmed/email-confirmed.component';


const routes: Routes = [
  {
    path: '', component: StartComponent, children: [
      {path: 'register', component: SignUpComponent},
      {path: 'log_in', component: LogInComponent},
    ]
  },
    {path: 'email_confirmed', component: EmailConfirmedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
