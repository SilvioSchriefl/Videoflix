import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ContentService } from '../Services/content.service';
import { YouTubePlayerService } from '../Services/you-tube-player.service';
import { AuthenticationService } from '../Services/authentication.service';
import { Observable, Subscription, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { WindowResizeService } from '../Services/window-resize.service';


@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.sass'],
})
export class ImageSliderComponent implements OnInit, OnDestroy {


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


  /**
   * Initializes the component and subscribes to the window resize event.
   */
  async ngOnInit() {
    this.resizeSubscription = this.window.resize$.subscribe((width: number) => {
      this.window_width = width;
    });
    this.window_width = window.innerWidth
    await this.content.getTrendingMovies()
    await this.content.getMovieByGenres()  
    this.content.checkIfMovieIsInWatchList(this.input_data)
    this.checkScrollbar();
    this.initializeScrollObserver()    
  }


  /**
   * Destroys the component and unsubscribes from the resize subscription.
   */
  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }


  /**
   * Initializes the scroll observer for the given scroll div element.
   */
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


  /**
   * Checks if there is a scrollbar in the scrollable div element.
   */
  checkScrollbar() {
    let scrollDiv = this.scrollDiv.nativeElement
    if (scrollDiv.scrollWidth > scrollDiv.clientWidth) this.scrollable = true
    else this.scrollable = false
  }


  /**
   * Scrolls the content to the right.
   */
  scrollRight() {
    this.scrollDiv.nativeElement.scroll({
      left: this.scrollDiv.nativeElement.scrollLeft + 1000,
      behavior: 'smooth'
    });
  }


  /**
   * Scrolls the content of the scrollDiv to the left by 1000 pixels.
   */
  scrollLeft() {
    this.scrollDiv.nativeElement.scroll({
      left: this.scrollDiv.nativeElement.scrollLeft - 1000,
      behavior: 'smooth'
    });
  }


  /**
   * Handles the mouse over event for a movie item.
   * @param {number} index - The index of the movie in the array.
   * @param {string} movie_id - The ID of the movie.
   */
  async handleMouseOver(index: number, movie_id: string) {
    this.hover = true;
    this.hover_info = true
    this.hover_index = index
    this.content.movie_detail = await this.content.getMovieDetails(movie_id)
    this.genres = this.content.movie_detail.genres
  }


  /**
   * Handles the mouse out event.
   */
  handleMouseOut() {
    this.hover_info = false
    this.hover = false
    this.video_error = false
  }


  /**
   * Asynchronously plays a YouTube video.
   *
   * @param {number} index - The index of the video.
   * @param {string} movie_id - The ID of the movie.
   */
  async playYoutubeVideo(index: number, movie_id: string) {
    let movie_detail: any = await this.content.getMovieDetails(movie_id)
    if (movie_detail.videos.results.length > 0) {
      this.content.setVideoId(movie_detail.videos.results)
      this.youtube.loadYouTubeAPI().then(async () => {
        this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie_id));
        this.content.play = true
      });
    }
    else this.video_error = true
  }


  /**
   * Updates the watchlist by toggling the "in_watchlist" property of a movie at the specified index.
   *
   * @param {string} movie_id - The ID of the movie.
   * @param {number} index - The index of the movie in the movie array.
   * @param {any[]} movie_array - The array of movies.
   */
  async updateWatchList(movie_id: string, index: number, movie_array: any[]) {
    if (movie_array[index].in_watchlist) this.removeFromWatchlist(index, movie_array, movie_id)
    else this.addToWatchlist(index, movie_array)
  }


  /**
   * Adds a movie to the watchlist at the specified index.
   *
   * @param {number} index - The index at which to add the movie.
   * @param {any[]} movie_array - The array of movies.
   */
  async addToWatchlist(index: number, movie_array: any[]) {
    movie_array[index].in_watchlist = true
    this.content.watchlist.push(movie_array[index])
    let body = {
      id: this.auth.current_user.id,
      watchlist: this.content.watchlist
    }
    await this.content.updateWatchList(body, this.auth.current_user.id);
    this.setWatchlistStatus()
  }


  /**
   * Removes a movie from the watchlist at the specified index.
   *
   * @param {number} index - The index of the movie in the watchlist array.
   * @param {Array<{ in_watchlist: boolean; }>} movie_array - The array of movies in the watchlist.
   * @param {string} movie_id - The ID of the movie to be removed.
   */
  async removeFromWatchlist(index: number, movie_array: { in_watchlist: boolean; }[], movie_id: string) {
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


  /**
   * Sets the watchlist status for all movies in the content.
   */
  setWatchlistStatus() {
    this.content.checkIfMovieIsInWatchList(this.content.trending_movies)
    this.content.checkIfMovieIsInWatchList(this.content.popular_movies)
    this.content.checkIfMovieIsInWatchList(this.content.action_movies)
    this.content.checkIfMovieIsInWatchList(this.content.animation_movies)
    this.content.checkIfMovieIsInWatchList(this.content.adventure_movies)
    this.content.checkIfMovieIsInWatchList(this.content.war_movies)
    this.content.checkIfMovieIsInWatchList(this.content.thriller_movies)
  }


 
  /**
   * Opens the movie detail and emits an event.
   *
   * @param {string} movie_id - The ID of the movie.
   * @param {number} index - The index of the movie.
   * @param {boolean} in_watchlist - Indicates whether the movie is in the watchlist.
   */
  openMovieDetail(movie_id: string, index: number,  in_watchlist: boolean) {
    let parameter = {
      in_watchlist: in_watchlist,
      index: index,
      movie_id: movie_id,
    }
    this.openMovie.emit(parameter);
  }
}



