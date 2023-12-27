import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ContentService } from '../content.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

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

  constructor(
    private router: Router,
    public auth: AuthenticationService,
    public content: ContentService
  ) { }
  

  /**
   * Navigates to the watchlist page.
   *
   */
  goToWatchlist() {
    this.router.navigateByUrl('watchlist')
  }


  /**
   * Navigates to the home page.
   *
   */
  goToHome() {
    this.router.navigateByUrl('home')
  }

}
