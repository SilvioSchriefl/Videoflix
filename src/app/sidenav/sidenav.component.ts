import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ContentService } from '../content.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.sass']
})
export class SidenavComponent {

  constructor(
    public router: Router,
    public auth: AuthenticationService,
    public content: ContentService,
    public dialog: MatDialog
  ) { }


  /**
   * Navigates to the home page.
   */
  goToHome() {
    this.content.searching = false
    this.content.open_search_results = false
    this.content.open_sidebar = false
    this.router.navigateByUrl('home');

  }


  /**
   * Navigates to the watchlist page.
   */
  goToWatchlist() {
    this.content.searching = false
    this.content.open_search_results = false
    this.content.open_sidebar = false
    this.router.navigateByUrl('watchlist');
  }


  /**
   * Navigates to the imprint page.
   */
  goToImprint() {
    this.content.searching = false
    this.content.open_search_results = false
    this.content.open_sidebar = false
    this.router.navigateByUrl('imprint');
  }


  /**
   * Navigates to the legal notice page.
   */
  goToLegalNotice() {
    this.content.searching = false
    this.content.open_search_results = false
    this.content.open_sidebar = false
    this.router.navigateByUrl('legal_notice');
  }


  /**
   * Logs out the user and closes the sidebar.
   */
  userLogOut() {
    this.content.open_sidebar = false
    this.auth.userLogOut();
  }


  /**
   * Opens the delete account dialog.
   */
  openDialog() {
    this.content.open_sidebar = false
    this.dialog.open(DeleteAccountDialogComponent);
  }
}
