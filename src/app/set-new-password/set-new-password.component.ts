import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.sass']
})
export class SetNewPasswordComponent implements OnInit {


  password_1: string = ''
  password_2: string = ''
  pw_not_match: boolean = false
  user_id!: number


  constructor(
    private router: Router,
    public auth: AuthenticationService,
    private route: ActivatedRoute
  ) { }


  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.auth.request_fail = false
    this.auth.request_successfull = false
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
    });
    this.auth.request_successfull = false
  }


  /**
   * Navigates to the login page.
   */
  goToLogin() {
    this.router.navigateByUrl('log_in');
  }


  /**
   * Sets a new password for the user.
   */
  async setNewPassword() {
    if (this.password_1 != this.password_2 && this.password_1.length > 0) this.pw_not_match = true
    else this.pw_not_match = false
    if (this.pw_not_match || this.password_1.length < 8) return
    this.auth.loading = true
    let body = {
      'user_id': this.user_id,
      'password': this.password_1
    }
    await this.auth.setNewPassword(body)
    this.auth.loading = false
  }


  /**
   * Sets the focus on the input element.
   */
  inputFocus() {
    this.pw_not_match = false
  }
}
