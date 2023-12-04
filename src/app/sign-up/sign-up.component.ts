import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {

  constructor(
    public auth: AuthenticationService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.auth.request_fail = false
    this.auth.request_successfull = false
  }


  user_name: string = ''
  email_valid: boolean = true
  user_email: string = ''
  password_1: string = ''
  password_2: string = ''
  error: boolean = false
  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');
  pw_not_match: boolean = false
  user_name_error: boolean = false


  async signUp() {
    this.email_valid = this.regexEmail.test(this.user_email)
    if (this.password_1 === this.password_2 && this.password_1.length > 0) this.pw_not_match = false
    else this.pw_not_match = true
    if (this.user_name.length === 0) this.user_name_error = true
    else this.user_name_error = false
    if (this.pw_not_match || this.user_name_error || this.password_1.length < 8) return
    this.auth.loading = true
    let body = {
      password: this.password_1,
      user_name: this.user_name,
      email: this.user_email
    }
    await this.auth.signUp(body)
    this.auth.loading = false
  }

  inputFocus(inputfield: string) {
    if (inputfield == 'name') this.user_name_error = false
    if (inputfield == 'password') this.pw_not_match = false
    if (inputfield == 'email') this.email_valid = true
  }


  goToLogin() {
    this.router.navigateByUrl('log_in')
  }

}
