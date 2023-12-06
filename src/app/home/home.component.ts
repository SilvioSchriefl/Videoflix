import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { lastValueFrom } from 'rxjs';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  @ViewChild('scrollDiv') scrollDiv!: ElementRef;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  hover: boolean = false
  url: string = environment.baseUrl


  constructor(
    public content: ContentService
  ) { }


  async ngOnInit(): Promise<void> {
  await this.content.getThumbnails()
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



  toggleFullScreen(): void {
    const videoElement = this.video.nativeElement;
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else {
        console.error('Fullscreen is not supported in this browser.');
      }
    }
  }

}
