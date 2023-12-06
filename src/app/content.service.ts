import { Injectable } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  thumbnails:any = []

  constructor(
    private http: HttpClient,
  ) { }


  async getThumbnails(){
    let url = environment.baseUrl + 'thumbnail/'
    try {
      let response:any = await lastValueFrom(this.http.get(url));
      this.thumbnails = response
    }
    catch(error) {
      console.log(error);
    }
  }
}
