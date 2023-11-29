import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent {

  constructor(
    public auth: AuthenticationService
  ){}


  user_name: string = ''
  email_valid: boolean = true
  user_email: string = ''
  password_1: string = ''
  password_2: string = ''
  error: boolean = false
  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');
  pw_not_match: boolean = false
  user_name_error: boolean = false

  dataChanged() {
    this.email_valid = this.regexEmail.test(this.user_email)

  }


  async signUp() {
    if (this.password_1 === this.password_2 && this.password_1.length > 0) this.pw_not_match = false
    else this.pw_not_match = true
    if (this.user_name.length === 0) this.user_name_error = true
    else this.user_name_error = false
    if (this.pw_not_match || this.user_name_error) return
    let body = {
      password: this.password_1,
      user_name: this.user_name,
      email: this.user_email
    }
    await this.auth.signUp(body)


  }

  inputFocus(inputfield: string) {
    if(inputfield == 'name') this.user_name_error = false
    if ( inputfield == 'password') this.pw_not_match = false
  }

}
