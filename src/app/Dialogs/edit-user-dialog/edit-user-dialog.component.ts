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



  ngOnInit(): void {
    this.name = this.auth.current_user.user_name
    this.email = this.auth.current_user.email
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async editUser() {
    this.loading = true
    if (await this.auth.updateUser(this.checkIfDataChanged())) {
      this.success = true
    }
    else this.error = true
    if (this.auth.error_text == 'emailInUse') this.email_in_use = true
    console.log(this.email_in_use);
    
    this.loading = false
  }


  dataChanged() {
    this.email_valid = this.regexEmail.test(this.email)
  }



  checkIfDataChanged() {
    if (this.name != this.auth.current_user.user_name && this.email != this.auth.current_user.email) return { user_name: this.name, email: this.email, }
    else if (this.name == this.auth.current_user.user_name && this.email != this.auth.current_user.email) return { email: this.email, }
    else if (this.name != this.auth.current_user.user_name && this.email == this.auth.current_user.email) return { user_name: this.name, }
    else return { user_name: this.name, email: this.email, }




  }

}
