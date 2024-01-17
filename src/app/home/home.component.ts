
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { ContentService } from '../content.service';
import { AuthenticationService } from '../authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YouTubePlayerService } from '../you-tube-player.service';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { Watchlist } from '../Interfaces/watchlist.interface';



declare const YT: any;
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  animations: [
    trigger('fadeInOut', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', animate('1000ms ease-out')),
      transition('hidden => visible', animate('1000ms ease-in')),
    ]),
  ],
})
export class HomeComponent implements OnInit {



  @ViewChild('full_video') fullVideo!: ElementRef<HTMLVideoElement>
  @ViewChild(MovieDetailComponent) movieDetail!: MovieDetailComponent
  url: string = environment.baseUrl
  loading_index: number = 0
  open_video: boolean = false
  randomQueryString: string = ''
  current_slide_index: number = 0
  slider_logo_url: string = ''
  overview: string = ''
  video_url!: SafeResourceUrl;
  height = window.innerHeight
  width = window.innerWidth
  logo_urls: string[] = []


  constructor(
    public auth: AuthenticationService,
    public content: ContentService,
    public youtube: YouTubePlayerService,
  ) { }



  /**
   * Initializes the component and loads initial data.
   *
   * @return {Promise<void>} A Promise that resolves when the initialization is complete.
   */
  async ngOnInit(): Promise<void> {
    this.content.loading = true;
    await this.content.getWatchList(this.auth.current_user.id!)
    await this.content.getPopularMovies()
    await this.content.getSlideMovieDetails()
    this.getLogoUrl()
    this.content.loading = false
    this.slider_logo_url = this.logo_urls[0]
    this.overview = this.content.popular_movies_details[this.current_slide_index].overview
    setInterval(() => {
      this.current_slide_index = (this.current_slide_index + 1) % this.content.popular_movies_details.length;
      this.slider_logo_url = this.logo_urls[this.current_slide_index]
      this.overview = this.content.popular_movies_details[this.current_slide_index].overview
    }, 3000);
  }


  /**
   * Checks if the content is scrolled to the top.
   *
   * @param {HTMLElement} scrollDiv - The scrollable element.
   */
  onScroll(scrollDiv: HTMLElement) {
    if (scrollDiv.scrollTop === 0) this.content.scroll_top = true
    else this.content.scroll_top = false
  }


  /**
   * Plays a YouTube video based on the given slider index.
   *
   * @param {number} slider_index - The index of the slider.
   * @return {Promise<void>} A promise that resolves when the video starts playing.
   */
  async playYouTubeVideo(slider_index: number): Promise<void> {
    let movie_id = this.content.popular_movies_details[slider_index].id
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie_id));
      this.content.play = true
    });
  }



  /**
   * Closes the video by stopping playback, destroying the YouTube player, and potentially playing a background video.
   *
   * @return {Promise<void>} A promise that resolves when the video is closed.
   */
  async closeVideo(): Promise<void> {
    this.content.play = false
    this.youtube.destroyPlayer()
    if (this.movieDetail.play_video_from_detail) {
      this.movieDetail.play_video_from_detail = false
      await this.movieDetail.playBackgroundYouTubeVideo()
    }
  }


  /**
   * Handles the event when a video is loaded.
   *
   * @param {HTMLVideoElement} video - The loaded video element.
   */
  onVideoLoaded(video: HTMLVideoElement) {
    this.content.video_loaded = true;
    console.log(this.loading_index);
    video.play();
    this.content.loading = false;

  }


  /**
   * Plays the video in fullscreen mode.
   */
  playVideo() {
    const videoElement = this.fullVideo.nativeElement;
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else {
        console.error('Fullscreen is not supported in this browser.');
      }
    }
  }


  /**
   * Closes the preview video.
   */
  closePreviewVideo() {
    this.content.video_loaded = false;
    this.content.loading = false
  }


  /**
   * Opens the movie details for a given movie ID or data object.
   *
   * @param {object|number} data - The movie ID or data object containing the movie ID and in_watchlist flag.
   * @return {Promise<void>} - A promise that resolves when the movie details are opened.
   */
  async openMovieDetails(data: { movie_id: string, in_watchlist: boolean } | number): Promise<void> {
    if (this.content.open_movie_detail) return
    this.content.open_movie_detail = true
    let movie_id
    if (typeof data === 'number') movie_id = this.content.popular_movies_details[data].id
    else {
      movie_id = data.movie_id
      if (data.in_watchlist) this.content.movie_detail.in_watchlist = true
    }
    this.content.movie_detail = await this.content.getMovieDetails(movie_id)
    this.movieDetail.getLogoUrl()
    await this.movieDetail.getRecommendationMoviesDetails()
    await this.movieDetail.playBackgroundYouTubeVideo()
  }


  /**
   * Retrieves the URL of the logo for each popular movie.
   */
  getLogoUrl() {
    this.content.popular_movies_details.forEach(element => {
      let logos = element.images.logos
      let en_logos: any[] = []
      logos.forEach((logo: any) => {
        if (logo.iso_639_1 == 'en') en_logos.push(logo.file_path)
      });
      this.logo_urls.push(this.content.imageBase_url + en_logos[0])
    });
  }
}
