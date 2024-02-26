import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContentService } from '../Services/content.service';

@Component({
  selector: 'app-delete-uservideo-dialog',
  templateUrl: './delete-uservideo-dialog.component.html',
  styleUrls: ['./delete-uservideo-dialog.component.sass']
})
export class DeleteUservideoDialogComponent {

  error: boolean = false
  success: boolean = false
  loading: boolean = false

  constructor(
    public dialogRef: MatDialogRef<DeleteUservideoDialogComponent>,
    public content: ContentService
  ) { }

  async deleteVideo() {
    this.loading = true
    this.content.open_user_video = false
    if(await this.content.deleteVideo()) this.success = true
    else this.error = true
    this.loading = false
  }


  onNoClick() {
    this.dialogRef.close();
  }

}
