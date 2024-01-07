import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ContentService } from '../content.service';
import { RouteGuardService } from '../route-guard.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.sass']
})
export class LogInComponent implements OnInit  {

  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');
  email_valid: boolean = true
  user_email!: string
  user_password: string = ''


  constructor(
    private router: Router,
    public auth: AuthenticationService,
    public content: ContentService,
    public guard: RouteGuardService,
  ) { }


/**
 * Initializes the component and performs some setup tasks.
 *
 * @return {Promise<void>} Promise that resolves when the function completes.
 */
  async ngOnInit(): Promise<void> {
   let token = localStorage.getItem('token');
   let id = localStorage.getItem('id');
   let user_name = localStorage.getItem('user_name');
   let email = localStorage.getItem('email');
   if (token)  {
    this.auth.current_user.user_name = user_name
    this.auth.current_user.id = id
    this.auth.current_user.email = email
    this.auth.token = token;
    this.guard.authenticated = true;
    this.router.navigateByUrl('home')
   }
    this.auth.request_fail = false
    this.auth.request_successfull = false
    console.log(this.auth.token);
  }



  /**
   * Updates the value of 'email_valid' based on the validity of 'user_email'.
   */
  dataChanged() {
    this.email_valid = this.regexEmail.test(this.user_email)
  }


  /**
   * Navigates to the sign-up page.
   */
  goToSignUp() {
    this.router.navigateByUrl('register')
  }


  /**
   * Navigates to the reset password page.
   */
  goToResetPassword() {
    this.router.navigateByUrl('reset_pw')
  }


  /**
   * Sets the focus on the input element.
   */
  inputFocus() {
    this.auth.request_fail = false
  }


  /**
   * Sign in to the application.
   */
  async signIn() {
    if (!this.email_valid) return
    this.auth.loading = true
    let body = {
      'password': this.user_password,
      'email': this.user_email
    }
    await this.auth.signIn(body)
    this.auth.loading = false
    if (this.auth.request_successfull) {
      this.guard.authenticated = true;
      this.router.navigateByUrl('home')
      this.auth.request_successfull = false
    } 
  }
}
