import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { ContentService } from '../content.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  @ViewChild('scrollDiv') scrollDiv!: ElementRef;
  @ViewChild('full_video') fullVideo!: ElementRef<HTMLVideoElement>
  hover: boolean = false
  url: string = environment.baseUrl
  loading_index: number = 0
  open_video: boolean = false
  randomQueryString: string = ''




  constructor(
    public auth: AuthenticationService,
    public content: ContentService,
  ) { }


  async ngOnInit(): Promise<void> {
    let token = localStorage.getItem('token')
    if (token) await this.content.getThumbnails()
    if (this.auth.token) await this.content.getThumbnails()
  }


  easeInOut(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  smoothScrollBy(amount: number) {
    const startTime = performance.now();
    const startScrollLeft = this.scrollDiv.nativeElement.scrollLeft;
    const scroll = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const nextScrollLeft = this.easeInOut(elapsed, startScrollLeft, amount, 100);
      if (elapsed < 100) {
        this.scrollDiv.nativeElement.scrollLeft = nextScrollLeft;
        requestAnimationFrame(scroll);
      }
    };
    requestAnimationFrame(scroll);
  }


  scrollToLeft() {
    this.scrollDiv.nativeElement.scrollLeft += 360;
  }


  scrollToRight() {
    this.scrollDiv.nativeElement.scrollLeft -= 360;
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
