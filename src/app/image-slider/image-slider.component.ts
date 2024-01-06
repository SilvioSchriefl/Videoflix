import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ContentService } from '../content.service';
import { YouTubePlayerService } from '../you-tube-player.service';
import { AuthenticationService } from '../authentication.service';
import { HomeComponent } from '../home/home.component';
import { Observable, Subscription, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { WindowResizeService } from '../window-resize.service';


@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.sass'],
})
export class ImageSliderComponent implements OnInit, OnDestroy  {


  @Output('openMovie') openMovie: EventEmitter<any> = new EventEmitter();
  hover: boolean = false;
  @Input() input_data: any = []
  @Input() headline!: string
  @ViewChild('scroll_div') scrollDiv!: ElementRef;
  private resizeSubscription!: Subscription;
  hover_index: number = 0;
  genres: any = []
  hover_info: boolean = false
  scrollable: boolean = false
  scrollable_left: number = 0
  scrollable_right: boolean = true
  scrollLeftObservable!: Observable<number>;
  video_error: boolean = false
  window_width!: number;



  constructor(
    public content: ContentService,
    public youtube: YouTubePlayerService,
    public auth: AuthenticationService,
    public window: WindowResizeService,
  ) { }


  async ngOnInit() {
    this.resizeSubscription = this.window.resize$.subscribe((width: number) => {
      this.window_width = width;
    });
    this.window_width = window.innerWidth
    await this.content.getTrendingMovies()
    await this.content.getMovieByGenres()
    this.content.getGenreNames(this.input_data)
    this.content.checkIfMovieIsInWatchList(this.input_data)
    this.checkScrollbar();
    this.initializeScrollObserver()
    console.log(this.input_data);
  }


  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }


  initializeScrollObserver() {
    let scrollEvent$ = fromEvent(this.scrollDiv.nativeElement, 'scroll');
    this.scrollLeftObservable = scrollEvent$.pipe(
      map(() => Math.floor(this.scrollDiv.nativeElement.scrollLeft)),
      distinctUntilChanged()
    );


    this.scrollLeftObservable.subscribe((scrollLeftValue) => {
      if (this.scrollDiv.nativeElement.scrollWidth - this.scrollDiv.nativeElement.clientWidth == scrollLeftValue) this.scrollable_right = false
      else this.scrollable_right = true
      this.scrollable_left = scrollLeftValue
    });
  }


  checkScrollbar() {
    let scrollDiv = this.scrollDiv.nativeElement
    if (scrollDiv.scrollWidth > scrollDiv.clientWidth) this.scrollable = true
    else this.scrollable = false
  }



  scrollRight() {
    this.scrollDiv.nativeElement.scroll({
      left: this.scrollDiv.nativeElement.scrollLeft + 1000,
      behavior: 'smooth'
    });
  }

  scrollLeft() {
    this.scrollDiv.nativeElement.scroll({
      left: this.scrollDiv.nativeElement.scrollLeft - 1000,
      behavior: 'smooth'
    });
  }


  async handleMouseOver(index: number, movie_id: string, movie_array: any) {
    this.hover = true;
    this.hover_info = true
    this.hover_index = index
    this.content.movie_detail = await this.content.getMovieDetails(movie_id)
    this.genres = this.content.movie_detail.genres
  }


  handleMouseOut() {
    this.hover_info = false
    this.hover = false
    this.video_error = false
  }


  async playYoutubeVideo(index: number, movie_id: string) {
    let movie_detail: any = await this.content.getMovieDetails(movie_id)
    if (movie_detail.videos.results.length > 0) {
      await this.content.setVideoId(movie_detail.videos.results)
      this.youtube.loadYouTubeAPI().then(async () => {
        this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie_id));
        this.content.play = true
      });
    }
    else this.video_error = true
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
    let watchlist_movie_ids = this.content.watchlist.map((item: { id: number; }) => item.id)
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


  openMovieDetail(id: number, index: number, movie_array: any, in_watchlist: boolean) {
    let parameter = {
      in_watchlist: in_watchlist,
      index: index,
      movie_array: movie_array,
      id: id,
      data_type: 'movie_id'
    }
    this.openMovie.emit(parameter);
  }
}



