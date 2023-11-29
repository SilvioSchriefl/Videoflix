import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  token: string = ''
  signup_successfull:boolean = false;

  constructor(
    private http: HttpClient,
  ) { }


  async signUp(body: { password: string; user_name: string; email: string; }) {
    const url = environment.baseUrl + 'register/';
    try {
      let response = await lastValueFrom(this.http.post(url, body));
      console.log(response);  
      this.signup_successfull =true 
    } catch (error: any) {
      console.log(error);    
    }
  }
}
