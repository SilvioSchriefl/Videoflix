import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ContentService } from '../Services/content.service';
import { environment } from '../enviroments/enviroments';
import { Observable, Subscription, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { WindowResizeService } from '../Services/window-resize.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoUploadDialogComponent } from '../Dialogs/video-upload-dialog/video-upload-dialog.component';
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


  /**
   * Initialize component on page load.
   *
   * @return {void} 
   */
  ngOnInit(): void {
    this.resizeSubscription = this.window.resize$.subscribe((width: number) => {
      this.window_width = width;
    });
    this.checkScrollbar();
    setTimeout(() => {
      this.initializeScrollObserver()
    }, 200);
   
  }


  @HostListener('document:click', ['$event'])
  /**
   * Handle global click event.
   *
   * @param {Event} event - The event object.
   */
  handleGlobalClick(event: Event) {
    if (this.content.search_text == '') {
      this.content.searching = false
      this.content.search_text = ''
    }
  }


  /**
   * Description of the entire function.
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


  /**
   * Handle mouse over event.
   *
   * @param {number} index - The index of the item being hovered over
   * @return {Promise<void>} A promise that resolves with no value
   */
  async handleMouseOver(index: number): Promise<void> {
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


  /**
   * Opens the dialog for uploading a video.
   */
  openDialog() {
     this.dialog.open(VideoUploadDialogComponent);
  }


  /**
   * play a video based on the provided index.
   *
   * @param {number} video_index - the index of the video to be played
   */
  playVideo(video_index: number) {
    this.content.open_user_video = false
    this.play = true
    this.video_path = this.content.user_videos[video_index].file
  }


  /**
   * Close the video.
   */
  closeVideo() {
    this.play = false
  }


  /**
   * Opens the video detail for the given user video.
   *
   * @param {UserVideo} video - the user video for which the detail will be opened
   */
  openVideoDetail(video:UserVideo) {
    this.content.user_video_detail = video
    this.content.open_user_video = true
  }
}
