import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {

  email_valid: boolean = true;
  user_email: string = ''
  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');

  constructor(
    public auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.auth.request_successfull = false
     this.auth.request_fail = false
  }

  async sendMail() {
    this.email_valid = this.regexEmail.test(this.user_email)
    if (!this.email_valid  || this.user_email.length == 0) return
    this.auth.loading = true
    let body = {
      'email': this.user_email
    }
    await this.auth.requestResetPassword(body)
    this.auth.loading = false
  }


  dataChanged() {
    this.email_valid = this.regexEmail.test(this.user_email)
  }


  inputFocus() {
    this.auth.request_fail = false
  }


  goToLogin() {
    this.router.navigateByUrl('log_in')
  }

}
