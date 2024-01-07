import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WindowResizeService } from '../window-resize.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent {


  constructor(
    public router: Router,
  ) { }


  /**
   * Navigates to the legal notice page.
   *
   */
  goToLegalNotice() {
    this.router.navigateByUrl('legal_notice');
  }


  /**
   * Navigates to the imprint page.
   *
   */
  goToImprint() {
    this.router.navigateByUrl('imprint');
  }
}
