import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent {

  constructor(
    private router: Router
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
