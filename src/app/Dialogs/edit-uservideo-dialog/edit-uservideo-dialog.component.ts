import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContentService } from '../../Services/content.service';

@Component({
  selector: 'app-edit-uservideo-dialog',
  templateUrl: './edit-uservideo-dialog.component.html',
  styleUrls: ['./edit-uservideo-dialog.component.sass']
})
export class EditUservideoDialogComponent implements OnInit {

  success: boolean = false
  title: string = '';
  description: string = '';
  error: boolean = false
  loading: boolean = false

  constructor(
    public dialogRef: MatDialogRef<EditUservideoDialogComponent>,
    public content: ContentService
  ) { }


  /**
   * Initializes the component with the title and description from the user video detail.
   *
   */
  ngOnInit(): void {
    this.title = this.content.user_video_detail.title;
    this.description = this.content.user_video_detail.description;
  }


  /**
   * A method to handle the action when the user clicks on the 'no' option.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Edit a video asynchronously.
   * @return {type} description of return value
   */
  async editVideo() {
    this.loading = true
    let body = {
      id: this.content.user_video_detail.id,
      title: this.title,
      description: this.description
    }
    if(await this.content.editVideo(body)) this.success = true
    else this.error = true
    this.loading = false
  }

}
