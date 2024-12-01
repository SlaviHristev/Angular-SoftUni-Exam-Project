import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { UploadWidgetComponent } from '../../shared/upload-widget/upload-widget.component';
import { ErrorPopUpComponent } from "../../shared/error-popup/error-popup.component";
import { ErrorService } from '../../services/error.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  imports: [UploadWidgetComponent, ReactiveFormsModule, ErrorPopUpComponent],
  animations: [
    trigger('slideInFromBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;
  images: string[] = [];
  description: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiRequestService,
    private router: Router,
    private errorService: ErrorService,
  ) {
  
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.min(4)]],
      price: ['', [Validators.required, Validators.min(1)]],
      yearOfMake: ['', [Validators.required, Validators.min(1)]],
      horsePower: ['', [Validators.required, Validators.min(1)]],
      color: ['', [Validators.required, Validators.min(3)]],
      city: ['', [Validators.required,Validators.min(3)]],
      category: ['', [Validators.required]],
      fuelType: ['', [Validators.required]],
      transmission: ['', [Validators.required]],
      description: ['', [Validators.required,Validators.min(10)]]
    });
  }

  ngOnInit(): void {}

  
  onSubmit() {
    if (this.createForm.invalid) {
      return;
    }

    const formData = this.createForm.value;
    const postData = {
      title: formData.title,
      price: formData.price,
      yearOfMake: formData.yearOfMake,
      horsePower: formData.horsePower,
      color: formData.color,
      city: formData.city,
      category: formData.category,
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      description: formData.description,
      images: this?.images
    };

  
    this.apiService.createPost(postData).subscribe({
      next: () => {
        this.router.navigate(['/catalog']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Creation failed!';
        this.errorService.setError(errorMessage); 
      }
    });
  }

  handleImageUpload(uploadedImages: string[]) {
    this.images = uploadedImages;  
  }
}
