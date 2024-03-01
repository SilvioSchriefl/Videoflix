import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../Services/authentication.service';
import { ContentService } from '../../Services/content.service';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';

import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-video-upload-dialog',
  templateUrl: './video-upload-dialog.component.html',
  styleUrls: ['./video-upload-dialog.component.sass']
})
export class VideoUploadDialogComponent implements OnInit {


  description: string = ''
  title: string = ''
  selcted_file: any = null
  file_name: string = ''
  file_size: number = 0


  constructor(
    public dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    public auth: AuthenticationService,
    public content: ContentService,
    public router: Router,
  ) { }

  /**
   * Initializes the component with default values for content reset, upload completion, and upload error.
   *
   * @return {void} 
   */
  ngOnInit(): void {
    this.content.reset()
    this.content.upload_complete = false
    this.content.upload_error = false
    this.content.uploading = false
  }


  /**
   * A method to handle the action when the user clicks on the "no" option.
   */
  onNoClick() {
    this.dialogRef.close()
  }


  /**
   * Selects a file from the event input and updates the file size and name accordingly.
   *
   * @param {any} event - the event input containing the selected file
   */
  selectFile(event: any) {
    if (event.target.files[0]) {
      this.file_size = 0
      this.file_name = ''
      this.selcted_file = null
      this.file_size = event.target.files[0].size / (1024 * 1024)
      this.selcted_file = event.target.files[0] 
      this.file_name = this.selcted_file.name + '  ' + this.file_size.toFixed(0) + 'mb'    
    }
  }


  /**
   * Uploads a file using the provided form data, including the file, title, description, user ID, and file size.
   *
   * @return {Promise<void>} 
   */
  async uploadFile(): Promise<void> {
    let formData = new FormData();
    formData.append("file", this.selcted_file);
    formData.append("title", this.title);
    formData.append("description", this.description);
    formData.append("user", this.auth.current_user.id);
    formData.append("file_size", this.file_size.toFixed(2) + 'mb');
    this.content.uploadVideo(formData)
  }
}
