import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent {


  constructor(
    public router: Router
  ) { }


  goToLegalNotice() {
    this.router.navigateByUrl('legal_notice');
  }


  goToImprint() {
    this.router.navigateByUrl('imprint');
  }

}
