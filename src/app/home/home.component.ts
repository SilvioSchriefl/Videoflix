import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { ContentService } from '../content.service';
import { AuthenticationService } from '../authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  url: string = environment.baseUrl
  loading_index: number = 0
  open_video: boolean = false
  randomQueryString: string = ''
  current_slide_index: number = 0
  slider_logo_url: string = ''
  overview: string = ''




  constructor(
    public auth: AuthenticationService,
    public content: ContentService,
  ) { }


  async ngOnInit(): Promise<void> {
    await this.content.getMovieByGenres()
    await this.content.getTrendingMovies()
    await this.content.getSlideMovieDetails()
    this.slider_logo_url = this.content.imageBase_url + this.content.trending_movies_details[this.current_slide_index].images.logos[0].file_path
    this.overview = this.content.trending_movies[this.current_slide_index].overview
    let token = localStorage.getItem('token')
    setInterval(() => {
      this.current_slide_index = (this.current_slide_index + 1) % this.content.trending_movies.length;
      this.slider_logo_url = this.content.imageBase_url + this.content.trending_movies_details[this.current_slide_index].images.logos[0].file_path
      this.overview = this.content.trending_movies[this.current_slide_index].overview
    }, 8000);
   
  }




  stopPropagation(event: Event) {
    event.stopPropagation();
  };


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


  closePreviewVideo() {
    this.content.video_loaded = false;
    this.content.loading = false
  }
}
