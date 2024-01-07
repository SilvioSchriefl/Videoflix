import { Component } from '@angular/core';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.sass']
})
export class ImprintComponent {


  /**
   * redirects to the last page
   */
  back() {
    window.history.back();
  }
}
