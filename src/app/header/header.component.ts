import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { ContentService } from '../Services/content.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from '../Dialogs/delete-account-dialog/delete-account-dialog.component';
import { VideoUploadDialogComponent } from '../Dialogs/video-upload-dialog/video-upload-dialog.component';
import { EditUserDialogComponent } from '../Dialogs/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  animations: [
    trigger('backgroundAnimation', [
      state('scroll', style({
        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(24, 24, 24, 1) 0%)',
      })),
      state('noScroll', style({
        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(24, 24, 24, 1) 100%)',
      })),
      transition('scroll <=> noScroll', animate('1s ease')),
    ]),
  ],
})

export class HeaderComponent {

  show_logout: boolean = false;



  constructor(
    public router: Router,
    public auth: AuthenticationService,
    public content: ContentService,
    public dialog: MatDialog
  ) { }


  @HostListener('document:click', ['$event'])
  /**
   * Handle global click event.
   *
   * @param {Event} event - The event object.
   */
  handleGlobalClick(event: Event) {
    if (this.content.search_text == '') {
      this.content.searching = false
      this.content.search_text = ''
    }
  }


  /**
   * Navigates to the watchlist page.
   */
  goToWatchlist() {
    this.content.searching = false
    this.content.open_search_results = false
    this.router.navigateByUrl('watchlist')
  }


  /**
   * Navigates to the home page.
   */
  goToHome() {
    this.content.searching = false
    this.content.open_search_results = false
    this.router.navigateByUrl('home')
  }


  goToMyVideos() {
    this.content.searching = false
    this.content.open_search_results = false
    this.router.navigateByUrl('my_videos')
  }


  /**
   * Show the logout.
   */
  showLogout() {
    this.show_logout = true;
  }


  /**
   * Hides the logout button.
   */
  hideLogout() {
    this.show_logout = false;
  }


  /**
   * Check if the data has changed and update the search results accordingly.
   */
  dataChanged() {  
      if (this.content.search_text == '') {
        this.content.open_search_results = false
        this.content.user_videos = this.content.user_videos_copy
      } 
      else {
        this.content.open_search_results = true
        this.content.search_results = []
        if (this.router.url == '/my_videos') this.content.getUserVideosSearchResults()
        else this.content.getSearchResults()
      }
  }


  /**
   * Opens the search input.
   */
  openSearchInput() {
    if (this.content.open_sidebar) this.content.open_sidebar = false
    this.content.search_text = ''
    this.content.searching = true
  }


  /**
   * Closes the search input and resets the search results.
   */
  closeSearchInput() {
    this.content.searching = false
    this.content.open_search_results = false
    this.content.search_text = ''
    this.content.search_results = []
    this.content.user_videos = this.content.user_videos_copy
  }


  /**
   * Toggles the sidebar by changing the value of the `open_sidebar` property in the `content` object.
   */
  toggleSidebar() {
    this.content.open_sidebar = !this.content.open_sidebar
    if (this.content.open_sidebar) this.content.menu_active = true
    else this.content.menu_active = false
  }


  /**
   * Opens the delete account dialog.
   */
  openDialog(dialog: string) {
    this.show_logout = false
    if (dialog == 'delete') this.dialog.open(DeleteAccountDialogComponent);
    if (dialog == 'upload') this.dialog.open(VideoUploadDialogComponent);
    if (dialog == 'edit') this.dialog.open(EditUserDialogComponent);


  }


  /**
   * Logs out the user.
   */
  logOut() {
    this.auth.userLogOut()
    this.show_logout = false;
    this.content.scroll_top = true
  }
}
