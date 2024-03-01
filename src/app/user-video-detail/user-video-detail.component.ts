import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentService } from '../Services/content.service';
import { environment } from '../enviroments/enviroments';
import { MatDialog } from '@angular/material/dialog';
import { DeleteUservideoDialogComponent } from '../Dialogs/delete-uservideo-dialog/delete-uservideo-dialog.component';
import { EditUservideoDialogComponent } from '../Dialogs/edit-uservideo-dialog/edit-uservideo-dialog.component';

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



  /**
   * Closes the video detail.
   */
  closeVideoDetail() {
    this.content.open_user_video = false
  }


  /**
   * toggleMuteTone - Toggles the mute state of the tone.
   */
  toggleMuteTone() {
    this.tone_muted = !this.tone_muted
  }


  /**
   * playFullScreenVideo - A description of the entire function.
   *
   */
  playFullScreenVideo() {
    let i = this.content.user_videos.findIndex((video) => video == this.content.user_video_detail)
    this.openVideo.emit(i);
  }


  /**
   * Opens a dialog based on the provided action.
   *
   * @param {string} action - the action to determine which dialog to open
   */
  openDialog(action: string) {
    if (action == 'delete') this.dialog.open(DeleteUservideoDialogComponent)
    if (action == 'edit') this.dialog.open(EditUservideoDialogComponent)
  }


  videoLoaded(event: Event) {
    const videoElement = event.target as HTMLVideoElement;
    this.content.video_loading = false
  }
}
