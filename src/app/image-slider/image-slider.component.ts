import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContentService } from '../content.service';
import { YouTubePlayerService } from '../you-tube-player.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.sass']
})
export class ImageSliderComponent {

  hover: boolean = false;
  @Input() input_data: any = []
  @Input() headline!: string
  @ViewChild('scroll_div') scrollDiv!: ElementRef;
  hover_index: number = 0;
  genres: any = []
  hover_info: boolean = false
  movie_detail:any = []

  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService,
    public auth: AuthenticationService
  ) { }


  scrollRight() {
    this.scrollDiv.nativeElement.scroll({
      left: this.scrollDiv.nativeElement.scrollLeft + 500,
      behavior: 'smooth'
    });
  }

  scrollLeft() {
    this.scrollDiv.nativeElement.scroll({
      left: this.scrollDiv.nativeElement.scrollLeft - 500,
      behavior: 'smooth'
    });
  }


  async handleMouseOver(index: number, movie_id: string) {
    this.hover = true;
    this.hover_info = true
    this.hover_index = index
    this.movie_detail = await this.content.getMovieDetails(movie_id)
    this.genres = this.movie_detail.genres
    console.log(this.movie_detail);
  }


  handleMouseOut() {
    this.hover_info = false
    this.hover = false
  }


  async playYoutubeVideo(index: number, movie_id: string) {
    let movie_detail: any = await this.content.getMovieDetails(movie_id)
    let video_id = await this.content.setVideoId(movie_detail.videos.results)
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie_id));
      this.content.play = true
    });
  }


  openMovieDetail(movie_id: string) {

  }


  updateWatchList() {
    this.content.watchlist.push(this.movie_detail.id)
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    this.content.updateWatchList(body);
  }

}
