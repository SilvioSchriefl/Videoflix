import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
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
  ) { }


  /**
   * Initializes the component and sets the initial values for the `request_successfull` and `request_fail` properties of the `auth` object.
   */
  ngOnInit(): void {
    this.auth.request_successfull = false
    this.auth.request_fail = false
  }

  
  /**
   * Sends an email.
   *
   * @return {Promise<void>} - A promise that resolves when the email has been sent.
   */
  async sendMail(): Promise<void> {
    this.email_valid = this.regexEmail.test(this.user_email)
    if (!this.email_valid || this.user_email.length == 0) return
    this.auth.loading = true
    let body = {
      'email': this.user_email
    }
    await this.auth.requestResetPassword(body)
    this.auth.loading = false
  }


  /**
   * Updates the value of the 'email_valid' property based on the result of testing the 'user_email' against the 'regexEmail' regular expression.
   */
  dataChanged() {
    this.email_valid = this.regexEmail.test(this.user_email)
  }


  /**
   * A description of the entire function.
   */
  inputFocus() {
    this.auth.request_fail = false
  }


  /**
   * Go to the login page.
   */
  goToLogin() {
    this.router.navigateByUrl('log_in')
  }
}
