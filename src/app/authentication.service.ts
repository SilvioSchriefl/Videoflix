import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { ContentService } from './content.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  token: string = ''
  error_text: string = ''
  request_fail: boolean = false
  request_successfull: boolean = false
  loading: boolean = false
  current_user: any = {
    id: '',
    user_name: '',
    watchlist: [],
    email: ''
  }

  constructor(
    private http: HttpClient,
    public content: ContentService,
    private router: Router
  ) { }


  /**
   * Asynchronously signs up a user.
   *
   * @param {Object} body - The user's sign up details.
   * @param {string} body.password - The user's password.
   * @param {string} body.user_name - The user's username.
   * @param {string} body.email - The user's email address.
   * @return {Promise<void>} - A promise that resolves when the sign up is successful.
   */
  async signUp(body: { password: string; user_name: string; email: string; }): Promise<void> {
    const url = environment.baseUrl + '/register/';
    try {
      let response = await lastValueFrom(this.http.post(url, body));
      this.request_successfull = true
    } catch (error: any) {
      console.log(error);
    }
  }


  /**
   * Sign in using the provided credentials.
   *
   * @param {Object} body - The credentials for signing in.
   *   @param {string} body.password - The password for the user.
   *   @param {string} body.email - The email for the user.
   * @return {Promise<void>} A promise that resolves when the sign in is successful.
   */
  async signIn(body: { password: string; email: string }): Promise<void> {
    const url = environment.baseUrl + '/log_in/';
    try {
      let response: any = await lastValueFrom(this.http.post(url, body));
      this.setLocalStorage(response)
      this.token = response.token;
      this.current_user.id = response.id
      this.current_user.user_name = response.user_name
      this.current_user.email = response.email
      this.request_successfull = true
      await this.content.getThumbnails();
    } catch (error: any) {
      console.log(error);
      if (error.error.detail) this.error_text = error.error.detail
      else this.error_text = 'Error in the request'
      this.request_fail = true
    }
  }


  /**
   * Sets the specified values in the local storage.
   *
   * @param {any} response - The response object containing the values to be set in the local storage.
   */
  setLocalStorage(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_name', response.user_name);
    localStorage.setItem('id', response.id);
    localStorage.setItem('email', response.email);
  }


  /**
   * Requests a password reset.
   *
   * @param {any} body - The request body.
   */
  async requestResetPassword(body: any) {
    const url = environment.baseUrl + '/request_reset_password/';
    try {
      let response: any = await lastValueFrom(this.http.post(url, body));
      console.log(response);
      this.request_successfull = true
    } catch (error: any) {
      this.request_fail = true
      if (error.error.detail) this.error_text = 'No user found with this email address'
      else this.error_text = 'Error in the request'
    }
  }


  /**
   * Logs out the user.
   *
   * @return {Promise<void>} - Returns a promise that resolves when the user has been logged out.
   */
  async userLogOut(): Promise<void> {
    let url = environment.baseUrl + '/logout/';
    let body = {
      email: this.current_user.email
    }
    try {
      await lastValueFrom(this.http.post(url, body));
      this.router.navigateByUrl('');
      localStorage.clear()
    } catch (error) {
      console.log(error);
    }
  }


  /**
   * Sets a new password.
   *
   * @param {any} body - The body of the request.
   */
  async setNewPassword(body: any) {
    const url = environment.baseUrl + '/set_password/';
    try {
      await lastValueFrom(this.http.post(url, body));
      this.request_successfull = true;
    } catch (error: any) {
      this.request_fail = true;
      this.error_text = 'Error in the request';
    }
  }


  /**
   * Deletes the user account.
   *
   * @return {Promise<void>} - Resolves when the user account is successfully deleted.
   */
  async deleteUserAccount(): Promise<void> {
    let url = environment.baseUrl + '/delete_account/';
    try {
      await lastValueFrom(this.http.delete(url));
      localStorage.clear();
      this.request_successfull = true
    } catch (error) {
      console.log(error);
    }
  }
}


