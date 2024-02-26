import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentService } from '../Services/content.service';
import { environment } from '../enviroments/enviroments';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUservideoDialogComponent } from '../delete-uservideo-dialog/delete-uservideo-dialog.component';
import { EditUservideoDialogComponent } from '../edit-uservideo-dialog/edit-uservideo-dialog.component';

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
    public content: ContentService,
    public dialog: MatDialog,
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


  openDialog(action: string) {
   if (action == 'delete') this.dialog.open(DeleteUservideoDialogComponent)
   if (action == 'edit') this.dialog.open(EditUservideoDialogComponent)
  }
}
