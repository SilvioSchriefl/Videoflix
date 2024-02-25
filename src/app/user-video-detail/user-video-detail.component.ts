import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentService } from '../Services/content.service';
import { environment } from '../enviroments/enviroments';

@Component({
  selector: 'app-user-video-detail',
  templateUrl: './user-video-detail.component.html',
  styleUrls: ['./user-video-detail.component.sass']
})
export class UserVideoDetailComponent {

  @Output('openVideo') openVideo: EventEmitter<any> = new EventEmitter();
  url = environment.baseUrl 
  tone_muted = false


  constructor(
    public content: ContentService
  ) { }



  closeVideoDetail() {
    this.content.open_user_video = false
  }


  toggleMuteTone() {
    this.tone_muted = !this.tone_muted
  }


  playVideo() {

  }


  playFullScreenVideo() {
    let i = this.content.user_videos.findIndex((video) => video == this.content.user_video_detail)
    this.openVideo.emit(i);
  }
}
