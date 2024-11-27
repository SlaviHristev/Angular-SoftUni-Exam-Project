import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { CloudinaryScriptService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-upload-widget',
  templateUrl: './upload-widget.component.html',
})
export class UploadWidgetComponent implements AfterViewInit {
  @ViewChild('uploadButton', { static: false }) 
  uploadButton!: ElementRef<HTMLButtonElement>;

  @Output() avatarUpdated = new EventEmitter<string>(); // Emits the uploaded avatar URL

  private widget: any; // Cloudinary widget instance
  private loaded = false; // Tracks if the script has loaded

  constructor(private cloudinaryService: CloudinaryScriptService) {}

  ngAfterViewInit(): void {
    this.loadCloudinaryScript().then(() => {
      this.initializeCloudinaryWidget();
    }).catch(error => {
      console.error('Failed to load Cloudinary widget script:', error);
    });
  }

  private loadCloudinaryScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptId = 'cloudinary-widget-script';

      if (document.getElementById(scriptId)) {
        resolve(); // Script is already loaded
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Failed to load Cloudinary widget script.');
      document.body.appendChild(script);
    });
  }

  private initializeCloudinaryWidget(): void {
    if (!window.cloudinary || !this.cloudinaryService.uwConfig) {
      console.error('Cloudinary library or configuration is missing.');
      return;
    }

    // Initialize the widget
    this.widget = window.cloudinary.createUploadWidget(
      this.cloudinaryService.uwConfig,
      (error: any, result: { event: string; info: { secure_url: string } }) => {
        if (!error && result.event === 'success') {
          console.log('Uploaded avatar info:', result.info);
          const avatarUrl = result.info.secure_url;
          this.updateAvatar(avatarUrl); // Update the avatar
        } else if (error) {
          console.error('Cloudinary upload error:', error);
        }
      }
    );

    // Attach the widget to the button
    if (this.uploadButton) {
      this.uploadButton.nativeElement.addEventListener('click', () => this.widget.open());
    } else {
      console.error('Upload button not initialized.');
    }
  }

  // Handle avatar update logic
  private updateAvatar(avatarUrl: string): void {
    console.log('Avatar updated:', avatarUrl);
    this.avatarUpdated.emit(avatarUrl); // Emit the avatar URL to the parent component
  }
}
