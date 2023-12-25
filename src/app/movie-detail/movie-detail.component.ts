import { Component, OnInit } from '@angular/core';
import { ContentService } from '../content.service';
import { YouTubePlayerService } from '../you-tube-player.service';


declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.sass']
})
export class MovieDetailComponent  {


  logo_url: string = ''

  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService
  ) {}


  closeMovieDetail() {
    this.content.open_movie_detail = false
    this.youtube.destroyPlayer()
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  };


  async playYouTubeVideo() {
    let movie_id = this.content.movie_detail.id
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player2',await this.content.getTrailer(movie_id));
    });
    this.content.loading = false
  }


  getLogoUrl() {
    let logos = this.content.movie_detail.images.logos
    let en_logos: any[] = []
    logos.forEach((logo: any) => {
      if(logo.iso_639_1 == 'en') en_logos.push(logo)
    });
    this.logo_url = this.content.imageBase_url + en_logos[0].file_path
  }
}
