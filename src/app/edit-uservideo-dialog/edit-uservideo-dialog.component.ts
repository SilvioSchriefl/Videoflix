import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContentService } from '../Services/content.service';

@Component({
  selector: 'app-edit-uservideo-dialog',
  templateUrl: './edit-uservideo-dialog.component.html',
  styleUrls: ['./edit-uservideo-dialog.component.sass']
})
export class EditUservideoDialogComponent implements OnInit {


  title: string = '';
  description: string = '';

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
    let body = {
      id: this.content.user_video_detail.id,
      title: this.title,
      description: this.description
    }
    await this.content.editVideo(body)
  }

}
