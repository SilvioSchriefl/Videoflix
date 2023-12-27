
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { ContentService } from '../content.service';
import { AuthenticationService } from '../authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YouTubePlayerService } from '../you-tube-player.service';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';



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
    private sanitizer: DomSanitizer,
    public youtube: YouTubePlayerService,
    private elementRef: ElementRef,
  ) { }



  async ngOnInit(): Promise<void> {


    this.content.loading = true;
    await this.content.getWatchList(this.auth.current_user.id)
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


  onScroll(scrollDiv: HTMLElement) {
    // Überprüfe, ob der Inhalt ganz oben ist
    if (scrollDiv.scrollTop === 0) this.content.scroll_top = true
    else this.content.scroll_top = false
  }


  async playYouTubeVideo(slider_index: number) {
    let movie_id = this.content.popular_movies_details[slider_index].id
    this.youtube.loadYouTubeAPI().then(async () => {
      this.youtube.createPlayer('youtube-player', await this.content.getTrailer(movie_id));
      this.content.play = true
    });
  }


  closeVideo() {
    this.content.play = false
    this.youtube.destroyPlayer()
  }


  async loadFullsizeVideo(video_id: number) {
    this.content.loading = true;
    await this.content.getVideo(video_id)
    this.content.loading = false;
    this.playVideo()
  }


  async getPreviewVideoUrl(video_id: number, index: number) {
    this.randomQueryString = Math.random().toString(36).substring(7);
    this.loading_index = index
    this.content.loading = true;
    await this.content.getVideo480p(video_id)
  }


  onVideoLoaded(video: HTMLVideoElement) {
    this.content.video_loaded = true;
    console.log(this.loading_index);
    video.play();
    this.content.loading = false;

  }


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


  closePreviewVideo() {
    this.content.video_loaded = false;
    this.content.loading = false
  }


  async openMovieDetails(data: any) {
    if (this.content.open_movie_detail) return
    this.content.open_movie_detail = true
    this.content.loading = true
    let movie_id
    if (typeof data === 'number') movie_id = this.content.popular_movies_details[data].id
    else movie_id = data.id
    this.content.movie_detail = await this.content.getMovieDetails(movie_id)
    if (data.in_watchlist) this.content.movie_detail.in_watchlist = true
    await this.movieDetail.getLogoUrl()
    await this.movieDetail.getSimilarMoviesDetails()
    await this.movieDetail.playBackgroundYouTubeVideo()
    this.content.loading = false
  }


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
