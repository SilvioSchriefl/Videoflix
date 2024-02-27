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


  ngOnInit(): void {
    this.title = this.content.user_video_detail.title;
    this.description = this.content.user_video_detail.description;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


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
