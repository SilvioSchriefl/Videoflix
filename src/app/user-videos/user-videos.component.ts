import { Component } from '@angular/core';
import { ContentService } from '../Services/content.service';

@Component({
  selector: 'app-user-videos',
  templateUrl: './user-videos.component.html',
  styleUrls: ['./user-videos.component.sass']
})
export class UserVideosComponent {

  constructor(
    public content: ContentService
  ) { }

}
