import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  @Input() images: string[] = [];
  imageIndex: number | null = null;

  changeSlide(direction: string): void {
    if (this.imageIndex === null) return;

    if (direction === 'left') {
      this.imageIndex = this.imageIndex === 0 ? this.images.length - 1 : this.imageIndex - 1;
    } else {
      this.imageIndex = this.imageIndex === this.images.length - 1 ? 0 : this.imageIndex + 1;
    }
  }

  openImage(index: number): void {
    this.imageIndex = index;
  }

  closeSlider(): void {
    this.imageIndex = null;
  }
}
