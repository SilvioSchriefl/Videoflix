import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../authentication.service';
import { ContentService } from '../content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.sass']
})
export class DeleteAccountDialogComponent {

  


  constructor(
    public dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    public auth: AuthenticationService,
    public content: ContentService,
    public router: Router
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async deleteAccount() {
    this.auth.loading = true;
    await this.auth.deleteUserAccount();
    this.auth.loading = false;
    if (this.auth.request_successfull) {
      setTimeout(() =>  {
        this.router.navigateByUrl('')
        this.onNoClick();
      }, 2000) 
      this.auth.token = '';
    } 
  }
}
