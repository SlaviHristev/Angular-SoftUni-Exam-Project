import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { CloudinaryScriptService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-upload-widget',
  templateUrl: './upload-widget.component.html',
  styleUrls: ['./upload-widget.component.css']
})
export class UploadWidgetComponent implements OnInit {
  @ViewChild('uploadButton', { static: true })
  uploadButton!: ElementRef<HTMLButtonElement>;

  loaded = false;
  publicState: string[] = []; 
  @Output() imagesUploaded = new EventEmitter<string[]>(); 

  constructor(private cloudinaryService: CloudinaryScriptService) {}

  ngOnInit() {

    this.loaded = document.getElementById('uw')?.isConnected ?? false; 
    if (!this.loaded) {
      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('id', 'uw');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.onload = () => this.loaded = true;
      document.body.appendChild(script);
    }
  }

  initializeCloudinaryWidget() {
    if (this.loaded && this.cloudinaryService.uwConfig && window.cloudinary) {
      const myWidget = window.cloudinary.createUploadWidget(
        this.cloudinaryService.uwConfig,
        (error: any, result: { event: string; info: { secure_url: string; }; }) => {
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info);
            this.publicState = [...this.publicState, result.info.secure_url];
            this.imagesUploaded.emit(this.publicState);
          }
        }
      );

      this.uploadButton.nativeElement.addEventListener('click', () => myWidget.open());
    }
  }

  
  uploadImages(): void {
    if (this.loaded && window.cloudinary) {
      const myWidget = window.cloudinary.createUploadWidget(
        this.cloudinaryService.uwConfig,
        (error: any, result: { event: string; info: { secure_url: string; }; }) => {
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info: ', result.info);
            this.publicState = [...this.publicState, result.info.secure_url];
            this.imagesUploaded.emit(this.publicState); 
          }
        }
      );
      myWidget.open();
    }
  }
}
