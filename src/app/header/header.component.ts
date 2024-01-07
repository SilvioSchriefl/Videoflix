import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ContentService } from '../content.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';

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
  handleGlobalClick(event: Event): void {
    if (this.content.search_text == '') {
      this.content.searching = false
      this.content.search_text = ''
    }
  }


  /**
   * Navigates to the watchlist page.
   *
   */
  goToWatchlist() {
    this.content.searching = false
    this.content.open_search_results = false
    this.router.navigateByUrl('watchlist')
  }


  /**
   * Navigates to the home page.
   *
   */
  goToHome() {
    this.content.searching = false
    this.content.open_search_results = false
    this.router.navigateByUrl('home')
  }


  showLogout() {
    this.show_logout = true;
  }


  hideLogout() {
    this.show_logout = false;
  }


  dataChanged() {
    if (this.content.search_text == '') this.content.open_search_results = false
    else {
      this.content.open_search_results = true
      this.content.search_results = []
      this.content.getSearchResults()
    }
  }


  openSearchInput() {
    if (this.content.open_sidebar) this.content.open_sidebar = false
    this.content.search_text = ''
    this.content.searching = true
  }


  closeSearchInput() {
    this.content.searching = false
    this.content.open_search_results = false
  }


  toggleSidebar() {

    this.content.open_sidebar = !this.content.open_sidebar
  }


  openDialog() {
    this.show_logout = false
    this.dialog.open(DeleteAccountDialogComponent);
  }
}
