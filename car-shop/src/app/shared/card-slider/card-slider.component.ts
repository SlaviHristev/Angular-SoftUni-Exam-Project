import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CardComponent } from "../card/card.component";

@Component({
  selector: 'app-card-slider',
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.scss'],
  imports: [CardComponent]
})
export class CardSliderComponent {
  @Input() items: any[] = []; 
  @ViewChild('slider', { static: false }) slider!: ElementRef;

  slideIndex = 0;

  nextSlide() {
    const sliderElement = this.slider.nativeElement;
    const slideWidth = sliderElement.children[0].offsetWidth;

    this.slideIndex++;
    if (this.slideIndex >= this.items.length) {
      this.slideIndex = 0;
    }
    sliderElement.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
  }

  prevSlide() {
    const sliderElement = this.slider.nativeElement;
    const slideWidth = sliderElement.children[0].offsetWidth;

    this.slideIndex--;
    if (this.slideIndex < 0) {
      this.slideIndex = this.items.length - 1;
    }
    sliderElement.style.transform = `translateX(-${this.slideIndex * slideWidth}px)`;
  }
}
