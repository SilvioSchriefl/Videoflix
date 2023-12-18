import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../content.service';
import { YouTubePlayerService } from '../you-tube-player.service';




@Component({
  selector: 'app-youtube-video',
  templateUrl: './youtube-video.component.html',
  styleUrls: ['./youtube-video.component.sass']
})
export class YoutubeVideoComponent  {

  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService,
  ) {}

  player: any;
  @Input() play: any;


  }
