import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.sass']
})
export class LogInComponent {

  constructor(
    private router: Router,
  ) {}

  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');
  email_valid: boolean = true
  user_email!: string

  dataChanged() {
    console.log('test');
    
    this.email_valid = this.regexEmail.test(this.user_email)
  }


  goToSignUp() {
    this.router.navigateByUrl('/register')
  }
}
