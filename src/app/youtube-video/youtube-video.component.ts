import { Component, Input, OnInit } from '@angular/core';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-youtube-video',
  templateUrl: './youtube-video.component.html',
  styleUrls: ['./youtube-video.component.sass']
})
export class YoutubeVideoComponent implements OnInit {

  constructor(
    public content: ContentService
  ) {}

  player: any;
  @Input() play: any;


  ngOnInit(): void {
    (window as any).onYouTubeIframeAPIReady = () => {
      this.player = new (window as any).YT.Player('player', {
        height: window.innerHeight ,
        width: '100%',
        videoId: this.content.video_id,
        playerVars: {
          'autoplay': 1,
          'rel': 0
        },
        events: {
          'onReady': this.onPlayerReady,
        },
      });
    };
  }

  onPlayerReady(event: any) {
    event.target.playVideo();
  }
}
