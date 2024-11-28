import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { CloudinaryScriptService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-upload-widget',
  templateUrl: './upload-widget.component.html',
})
export class UploadWidgetComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadButton', { static: false }) 
  uploadButton!: ElementRef<HTMLButtonElement>;

  loaded = false; 
  publicState: string[] = [];

  @Output() imagesUploaded = new EventEmitter<string[]>();

  constructor(private cloudinaryService: CloudinaryScriptService) {}

  ngOnInit() {
    const scriptId = 'cloudinary-widget-script';


    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.onload = () => {
        this.loaded = true; 
        this.initializeCloudinaryWidget();
      };
      document.body.appendChild(script);
    } else {
      this.loaded = true;
    }
  }

  ngAfterViewInit() {
    if (this.loaded) {
      this.initializeCloudinaryWidget();
    }
  }

  initializeCloudinaryWidget() {
 
    if (this.loaded && this.cloudinaryService.uwConfig && window.cloudinary) {
      const myWidget = window.cloudinary.createUploadWidget(
        this.cloudinaryService.uwConfig,
        (error: any, result: { event: string; info: { secure_url: string } }) => {
          if (!error && result.event === 'success') {
            console.log('Uploaded image info:', result.info);
            this.publicState.push(result.info.secure_url);
            this.imagesUploaded.emit(this.publicState);
          }
        }
      );

      
      if (this.uploadButton) {
        this.uploadButton.nativeElement.addEventListener('click', () => myWidget.open());
      } else {
        console.error('Upload button not initialized.');
      }
    }
  }
}