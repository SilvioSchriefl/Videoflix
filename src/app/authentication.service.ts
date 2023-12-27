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
  current_user:any = {
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


  async signUp(body: { password: string; user_name: string; email: string; }) {
    const url = environment.baseUrl + '/register/';
    try {
      let response = await lastValueFrom(this.http.post(url, body));
      console.log(response);
      this.request_successfull = true
    } catch (error: any) {
      console.log(error);
    }
  }


  async signIn(body: { password: string; email: string }) {
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


  setLocalStorage(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_name', response.user_name);
    localStorage.setItem('id', response.id);
    localStorage.setItem('email', response.email);
  }


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


  async userLogOut() {
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
      const response = await lastValueFrom(this.http.post(url, body));
      this.request_successfull = true;
    } catch (error: any) {
      this.request_fail = true;
      this.error_text = 'Error in the request';
    }
  }
}


