import { Injectable } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  thumbnails:any = []
  preview_video_url:string =  ''
  loading:boolean = false
  video_loaded:boolean = false
  fullsize_video_url:string = ''

  constructor(
    private http: HttpClient,
  ) { }


  async getThumbnails(){
    let url = environment.baseUrl + '/thumbnail/'
    try {
      let response:any = await lastValueFrom(this.http.get(url));
      this.thumbnails = response    
    }
    catch(error) {
      console.log(error);
    }
  }


  async getVideo480p(id:number) {
    let url = environment.baseUrl + '/video_preview/' + id + '/'
    try {
      let response:any = await lastValueFrom(this.http.get(url))
      this.preview_video_url = response.video_url
      console.log(response);
      
    }
    catch(error) {
      console.log(error);     
  }
}


async getVideo(id:number) {
  let url = environment.baseUrl + '/video/' + id + '/'
  try {
    let response:any = await lastValueFrom(this.http.get(url))
    this.fullsize_video_url = response.video_url
  }
  catch(error) {
    console.log(error);     
}
}
}
