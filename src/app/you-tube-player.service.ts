import { Injectable } from '@angular/core';

declare var YT: any;

@Injectable({
  providedIn: 'root'
})
export class YouTubePlayerService {

  apiLoaded: boolean = false;
  private player: any; 

  constructor() { }

  async loadYouTubeAPI() {
    if (!this.apiLoaded) {
      await new Promise<void>((resolve) => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onload = () => resolve();
        document.head.appendChild(tag);
      });

      this.apiLoaded = true;
    }
  }

  isAPILoaded(): boolean {
    return this.apiLoaded;
  }

  createPlayer(elementId: string, videoId: string) {
    if (this.apiLoaded) {
      this.player = new YT.Player(elementId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        
        playerVars: {
          frameborder: '0',
          modestbranding: '1', 
          allowfullscreen: '1',
          controls: 1,
          rel: '0',
          fs: '1',
        
        },
        events: {
          'onReady': this.onPlayerReady.bind(this),
        },
      });
    } else {
      console.error('YouTube API not loaded yet.');
    }
  }

  private onPlayerReady(event: any) {
    this.player.playVideo();
  }


  destroyPlayer() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    } else {
      console.error('YouTube Player not created yet.');
    }
  }


  stopVideo() {
    if (this.player) {
      this.player.stopVideo();
    } else {
      console.error('YouTube Player not created yet.');
    }
  }


  private toggleFullScreen() {
    const iframe = this.player.getIframe();

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  }


}
