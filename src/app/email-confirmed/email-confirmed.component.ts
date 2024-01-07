import { Component } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-email-confirmed',
  templateUrl: './email-confirmed.component.html',
  styleUrls: ['./email-confirmed.component.sass']
})
export class EmailConfirmedComponent  {

  current_url!: string

  constructor(
    public router: Router,
  ) {}


  /**
   * Navigates to the login page.
   *
   */
  goToLogin() {
    this.router.navigateByUrl('log_in');
  }

}
