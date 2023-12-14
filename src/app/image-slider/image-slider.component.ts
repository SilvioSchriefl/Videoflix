import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ContentService } from '../content.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.sass']
})
export class ImageSliderComponent {

  hover: boolean = false;
  @Input() input_data: any = []
  @ViewChild('scroll_div') scrollDiv!: ElementRef;

  constructor(
    public content: ContentService
  ) {}


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

}
