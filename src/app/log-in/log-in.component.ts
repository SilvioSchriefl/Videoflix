import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.sass']
})
export class LogInComponent implements OnInit {

  token: string = ''

  constructor(
    private router: Router,
    public auth: AuthenticationService,
    public content: ContentService
  ) { }


  async ngOnInit(): Promise<void> {
   let token = localStorage.getItem('token');
   if (token) {
    this.auth.token = token;
    this.router.navigateByUrl('home')
   }
    
    this.auth.request_fail = false
    this.auth.request_successfull = false
  }

  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');
  email_valid: boolean = true
  user_email!: string
  user_password: string = ''

  dataChanged() {
    this.email_valid = this.regexEmail.test(this.user_email)
  }


  goToSignUp() {
    this.router.navigateByUrl('register')
  }


  goToResetPassword() {
    this.router.navigateByUrl('reset_pw')
  }


  inputFocus() {
    this.auth.request_fail = false
  }


  async signIn() {
    if (!this.email_valid) return
    this.auth.loading = true
    let body = {
      'password': this.user_password,
      'email': this.user_email
    }
    await this.auth.signIn(body)
    this.auth.loading = false
    if (this.auth.request_successfull) this.router.navigateByUrl('home')
  }
}
