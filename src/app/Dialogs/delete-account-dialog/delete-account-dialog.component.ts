import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../Services/authentication.service';
import { ContentService } from '../../Services/content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.sass']
})
export class DeleteAccountDialogComponent {

  loading: boolean = false;
  success: boolean = false;
  error: boolean = false;
  

  constructor(
    public dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    public auth: AuthenticationService,
    public content: ContentService,
    public router: Router
  ) { }


  /**
   * Closes the dialog when the "No" button is clicked.
   *
   */
  onNoClick() {
    this.dialogRef.close();
  }


  /**
   * Deletes the user account asynchronously.
   *
   * @return {Promise<void>} Promise that resolves when the account is deleted.
   */
  async deleteAccount(): Promise<void> {
    this.loading = true;
    if ( await this.auth.deleteUserAccount()) {
      this.success = true;
      setTimeout(() =>  {
        this.router.navigateByUrl('')
        this.onNoClick();
      }, 2000) 
      this.auth.token = '';
    } 
    else this.error = true;
    this.loading = false; 
  }
}
