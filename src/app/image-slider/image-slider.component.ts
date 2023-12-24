import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../content.service';
import { YouTubePlayerService } from '../you-tube-player.service';
import { AuthenticationService } from '../authentication.service';


@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.sass'],
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
  scrollable: boolean = false


  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService,
    public auth: AuthenticationService
  ) { }


  async ngOnInit() {
    await this.content.getTrendingMovies()
    await this.content.getMovieByGenres()
    this.content.checkIfMovieIsInWatchList(this.input_data)
    this.checkScrollbar();
  }


  checkScrollbar() {
    let scrollDiv = this.scrollDiv.nativeElement
    if (scrollDiv.scrollWidth > scrollDiv.clientWidth) this.scrollable = true
    else this.scrollable = false
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
    this.setWatchlistStatus()
  }


  async removeFromWatchlist(index: number, movie_array: any, movie_id: string) {
    movie_array[index].in_watchlist = false
    let watchlist_movie_ids = this.content.watchlist.map(item => item.id)
    let i = watchlist_movie_ids.indexOf(movie_id)
    this.content.watchlist.splice(i, 1)
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    await this.content.updateWatchList(body, this.auth.current_user.id);
    this.setWatchlistStatus()
  }


  setWatchlistStatus() {
    this.content.checkIfMovieIsInWatchList(this.content.trending_movies)
    this.content.checkIfMovieIsInWatchList(this.content.popular_movies)
    this.content.checkIfMovieIsInWatchList(this.content.action_movies)
    this.content.checkIfMovieIsInWatchList(this.content.animation_movies)
    this.content.checkIfMovieIsInWatchList(this.content.adventure_movies)
  }
}



