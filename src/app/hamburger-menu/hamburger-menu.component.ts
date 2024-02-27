import { Component } from '@angular/core';
import { ContentService } from '../Services/content.service';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.sass']
})
export class HamburgerMenuComponent {


  constructor(
    public content: ContentService
  ) { }
  

 

toggleHamburgerMenu() {
  this.content.menu_active = !this.content.menu_active;
  
  

}
}
