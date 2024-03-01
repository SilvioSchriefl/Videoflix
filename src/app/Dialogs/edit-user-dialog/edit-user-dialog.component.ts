import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/Services/authentication.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.sass']
})
export class EditUserDialogComponent implements OnInit {

  loading: boolean = false
  success: boolean = false
  error: boolean = false
  name: string = ''
  email: string = ''
  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');
  email_valid: boolean = true
  email_in_use: boolean = false


  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    public auth: AuthenticationService
  ) { }



  /**
   * Initialize the component with the current user's name and email.
   *
   */
  ngOnInit(): void {
    this.name = this.auth.current_user.user_name
    this.email = this.auth.current_user.email
  }


  /**
   * A description of the entire function.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Edit user asynchronously.
   *
   */
  async editUser() {
    this.loading = true
    if (await this.auth.updateUser(this.checkIfDataChanged())) {
      this.success = true
    }
    else this.error = true
    if (this.auth.error_text == 'emailInUse') this.email_in_use = true
    this.loading = false
  }


  /**
   * A function to check if the data has changed and update the email_valid property accordingly.
   */
  dataChanged() {
    this.email_valid = this.regexEmail.test(this.email)
  }


  /**
   * Check if the data has changed and return an object with the updated user_name and email.
   *
   * @return {Object} An object with the updated user_name and email
   */
  checkIfDataChanged(): object {
    if (this.name != this.auth.current_user.user_name && this.email != this.auth.current_user.email) return { user_name: this.name, email: this.email, }
    else if (this.name == this.auth.current_user.user_name && this.email != this.auth.current_user.email) return { email: this.email, }
    else if (this.name != this.auth.current_user.user_name && this.email == this.auth.current_user.email) return { user_name: this.name, }
    else return { user_name: this.name, email: this.email, }
  }
}
