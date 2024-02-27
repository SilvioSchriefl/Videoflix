import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { ContentService } from './content.service';
import { Router } from '@angular/router';
import { User } from '../Interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  token: string | undefined = ''
  error_text: string = ''
  request_fail: boolean = false
  request_successfull: boolean = false
  loading: boolean = false
  current_user: User = {
    id: '',
    user_name: '',
    watchlist: [],
    email: '',
    token: ''
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
      await lastValueFrom(this.http.post(url, body));
      this.request_successfull = true
    } catch (error: any) {
      console.error;
    }
  }


  
  /**
   * Sign in with the given credentials.
   *
   * @param {Object} body - The credentials for signing in.
   *   - {string} password - The password for the user.
   *   - {string} email - The email address of the user.
   * @return {Promise<void>} A promise that resolves when the sign-in process is complete.
   */
  async signIn(body: { password: string; email: string }): Promise<void> {
    const url = environment.baseUrl + '/log_in/';
    try {
      let response = await lastValueFrom(this.http.post<User>(url, body));
      if(body.email != 'guest@guest.de') this.setLocalStorage(response)
      this.token = response.token;
      this.current_user.id = response.id
      this.current_user.user_name = response.user_name
      this.current_user.email = response.email
      this.request_successfull = true
    } catch (error: any) {
      console.error;
      if (error.error.detail) this.error_text = error.error.detail
      else this.error_text = 'Error in the request'
      this.request_fail = true
    }
  }


 
  /**
   * Sets the values of 'token', 'user_name', 'id', and 'email' in the local storage.
   *
   * @param {User} response - The user object containing the values to be set.
   */
  setLocalStorage(response: User) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_name', response.user_name);
    localStorage.setItem('id', response.id);
    localStorage.setItem('email', response.email);
  }


  
  /**
   * Handles the request to reset the password.
   *
   * @param {any} body - The request body containing the necessary information.
   * @return {Promise<void>} - A Promise that resolves with no value when the request is successful.
   */
  async requestResetPassword(body: { email: string; }): Promise<void> {
    const url = environment.baseUrl + '/request_reset_password/';
    try {
      await lastValueFrom(this.http.post(url, body));
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
   * Asynchronously sets a new password for a user.
   *
   * @param {Object} body - An object containing the user ID and the new password.
   * @param {number} body.user_id - The ID of the user.
   * @param {string} body.password - The new password for the user.
   * @return {Promise<void>} - A promise that resolves with no value upon successful completion.
   */
  async setNewPassword(body: { user_id: number; password: string; }): Promise<void> {
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
   * Asynchronously deletes the user account.
   *
   * @return {boolean} true if the account is deleted successfully, false otherwise
   */
  async deleteUserAccount(): Promise<boolean> {
    let url = environment.baseUrl + '/delete_account/';
    try {
      await lastValueFrom(this.http.delete(url));
      localStorage.clear();
      return true
    } catch (error) {
      console.error;
      return false
    }
  }


  async updateUser(body: { user_name?: string; email?: string; }) {
    let url = environment.baseUrl + '/edit_user/' 
    try {
      let response = await lastValueFrom(this.http.patch<User>(url, body))
      this.editUser(response)
      return true
    }
    catch (error: any) {
      console.error;
      console.log(error.error.detail); 
      if (error.error.detail) this.error_text = 'emailInUse'
      return false
    }
  }


  editUser(updated_user: User) {
    this.current_user.user_name = updated_user.user_name
    this.current_user.email = updated_user.email
  }


}


