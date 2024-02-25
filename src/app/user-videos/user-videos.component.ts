import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../Services/content.service';
import { environment } from '../enviroments/enviroments';
import { Observable, Subscription, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { WindowResizeService } from '../Services/window-resize.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoUploadDialogComponent } from '../video-upload-dialog/video-upload-dialog.component';
import { UserVideo } from '../Interfaces/user_video.interface';

@Component({
  selector: 'app-user-videos',
  templateUrl: './user-videos.component.html',
  styleUrls: ['./user-videos.component.sass']
})
export class UserVideosComponent implements OnInit {


  url = environment.baseUrl
  @ViewChild('scroll_element') scrollDiv!: ElementRef;
  scrollLeftObservable!: Observable<number>;
  scrollable: boolean = false
  scrollable_left: number = 0
  scrollable_right: boolean = true
  hover: boolean = false
  hover_index: number = 0;
  hover_info: boolean = false
  private resizeSubscription!: Subscription;
  window_width!: number;
  play: boolean = false
  video_path: string = ''


  constructor(
    public content: ContentService,
    public window: WindowResizeService,
    public dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    this.resizeSubscription = this.window.resize$.subscribe((width: number) => {
      this.window_width = width;
    });
    this.checkScrollbar();
    setTimeout(() => {
      this.initializeScrollObserver()
    }, 200);
   
  }


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
      console.log(this.scrollable_right, this.scrollable_left);
    
  }


  /**
   * Checks if there is a scrollbar in the scrollable div element.
   */
  checkScrollbar() {
    if (this.scrollDiv) {      
      let scrollDiv = this.scrollDiv.nativeElement
      if (scrollDiv.scrollWidth > scrollDiv.clientWidth) this.scrollable = true
      else this.scrollable = false      
    }
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


  async handleMouseOver(index: number) {
    this.hover = true;
    this.hover_info = true
    this.hover_index = index
  }


  /**
   * Handles the mouse out event.
   */
  handleMouseOut() {
    this.hover_info = false
    this.hover = false
  }


  openDialog() {
     this.dialog.open(VideoUploadDialogComponent);
  }


  playVideo(video_index: number) {
    this.play = true
    this.video_path = this.content.user_videos[video_index].file
  }


  closeVideo() {
    this.play = false
  }


  openVideoDetail(video:UserVideo) {
    this.content.user_video_detail = video
    this.content.open_user_video = true
  }
}
