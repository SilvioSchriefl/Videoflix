import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../content.service';
import { YouTubePlayerService } from '../you-tube-player.service';
import { AuthenticationService } from '../authentication.service';
import { MovieDetail } from '../Interfaces/movie-detail.interface';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.sass']
})
export class ImageSliderComponent implements OnInit {

  hover: boolean = false;
  @Input() input_data: any = []
  @Input() headline!: string
  @ViewChild('scroll_div') scrollDiv!: ElementRef;
  hover_index: number = 0;
  genres: any = []
  hover_info: boolean = false
  movie_detail: any = []
  add_watchlist_img_src: string = ''

  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService,
    public auth: AuthenticationService
  ) { }


  ngOnInit() {
    setTimeout(() => {
      this.content.checkIfMovieIsInWatchList(this.input_data);
    console.log(this.input_data);
    }, 1000);
    
  }

  


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


  async handleMouseOver(index: number, movie_id: string, movie_array: any) {
    this.hover = true;
    this.hover_info = true
    this.hover_index = index
    this.movie_detail = await this.content.getMovieDetails(movie_id)
    this.genres = this.movie_detail.genres
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


  async updateWatchList(movie_id: string, index: number, movie_array: any) {
    if (movie_array[index].in_watchlist) this.removeFromWatchlist(index, movie_array, movie_id)
    else this.addToWatchlist(index, movie_array)
  }


  async addToWatchlist(index: number, movie_array: any) {
    movie_array[index].in_watchlist = true
    this.content.watchlist.push(movie_array[index])
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    await this.content.updateWatchList(body, this.auth.current_user.id);
  }


  async removeFromWatchlist(index: number, movie_array: any, movie_id: string) {
    movie_array[index].in_watchlist = false
    let watchlist_movie_ids = this.content.watchlist.map(item => item.id)
    let i = watchlist_movie_ids.indexOf(movie_id)
    this.content.watchlist.splice(index, 1)
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    await this.content.updateWatchList(body, this.auth.current_user.id);
  }
}

