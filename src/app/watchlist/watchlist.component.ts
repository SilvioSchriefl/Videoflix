import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../content.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.sass']
})
export class WatchlistComponent  {



constructor(
  public content: ContentService,
  public auth: AuthenticationService
) {}


  

}
