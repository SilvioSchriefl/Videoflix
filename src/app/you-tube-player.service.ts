import { Injectable, OnInit } from '@angular/core';

declare var YT: any;

@Injectable({
  providedIn: 'root'
})
export class YouTubePlayerService {

  apiLoaded: boolean = false;
  private player: any;
  play: boolean = false


  /**
   * Loads the YouTube API if it has not been loaded already.
   *
   * @return {Promise<void>} A promise that resolves once the YouTube API has been loaded.
   */
  async loadYouTubeAPI(): Promise<void> {
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


  /**
   * Checks if the API has been loaded.
   *
   * @return {boolean} Returns a boolean value indicating whether the API has been loaded.
   */
  isAPILoaded(): boolean {
    return this.apiLoaded;
  }


  /**
   * Creates a player with the specified element ID and video ID.
   *
   * @param {string} elementId - The ID of the HTML element where the player will be created.
   * @param {string} videoId - The ID of the YouTube video to be played.
   */
  createPlayer(elementId: string, videoId: string) {
    if (this.apiLoaded) {
      this.player = new YT.Player(elementId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'playlist': videoId,
          'frameborder': 0,
          'modestbranding': 1,
          'allowfullscreen': 1,
          'controls': 1,
          'rel': 0,
          'fs': 1,
          'loop': 1,
        },
        events: {
          'onReady': this.onPlayerReady.bind(this),
        },
        'onStateChange': (event: any) => {
          if (event.data === YT.PlayerState.ENDED) {
            this.player.playVideo();
            console.log('end');
          }
        },
      });
    } else {
      console.error('YouTube API not loaded yet.');
    }
  }


  /**
   * Start the video when the player is ready.
   *
   * @param {any} event - the event object for the 'onPlayerReady' event
   */
  private onPlayerReady(event: any) {
    this.player.playVideo();
    this.play = true
  }


  /**
   * Destroys the player if it exists, otherwise logs an error message.
   */
  destroyPlayer() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    } else {
      console.error('YouTube Player not created yet.');
    }
  }


  /**
   * Stops the video if it is currently playing.
   */
  stopVideo() {
    if (this.player) {
      this.player.stopVideo();
    } else {
      console.error('YouTube Player not created yet.');
    }
  }


  /**
   * Mutes the video tone.
   */
  muteVideoTone() {
    if (this.player) {
      this.player.mute();
    } else {
      console.error('YouTube Player not created yet.');
    }
  }


  /**
   * Unmutes the video tone.
   */
  unMuteVideoTone() {
    if (this.player) {
      this.player.unMute();
    } else {
      console.error('YouTube Player not created yet.');
    }
  }


  /**
   * Pauses the video if the player exists, otherwise logs an error message.
   */
  pauseVideo() {
    if (this.player) {
      this.player.pauseVideo();
    } else {
      console.error('YouTube Player not created yet.');
    }
  }


  /**
   * Unpauses the video.
   */
  unPauseVideo() {
    if (this.player) {
      this.player.playVideo();
    } else {
      console.error('YouTube Player not created yet.');
    }
  }
}
