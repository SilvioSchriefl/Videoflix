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
export class LogInComponent implements OnInit {

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


  async ngOnInit(): Promise<void> {
   let token = localStorage.getItem('token');
   let id = localStorage.getItem('id');
   let user_name = localStorage.getItem('user_name');
   if (token)  {
    this.auth.current_user.user_name = user_name
    this.auth.current_user.id = id
    this.auth.token = token;
    this.guard.authenticated = true;
    this.router.navigateByUrl('home')
   }
    this.auth.request_fail = false
    this.auth.request_successfull = false
    this.loadWatchlist()
  }



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
    if (this.auth.request_successfull) {
      this.guard.authenticated = true;
      this.router.navigateByUrl('home')
      this.loadWatchlist()
    } 
  }


  async loadWatchlist() {
    let user_id = this.auth.current_user.id
      await this.content.getWatchList(user_id)
      console.log(this.content.watchlist);
  }
}
