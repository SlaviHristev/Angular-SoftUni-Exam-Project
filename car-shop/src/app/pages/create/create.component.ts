import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { UploadWidgetComponent } from '../../shared/upload-widget/upload-widget.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  imports: [UploadWidgetComponent, ReactiveFormsModule]
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;
  images: string[] = [];
  description: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiRequestService,
    private router: Router
  ) {
  
    this.createForm = this.fb.group({
      title: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      yearOfMake: ['', [Validators.required, Validators.min(1)]],
      horsePower: ['', [Validators.required, Validators.min(1)]],
      color: ['', [Validators.required]],
      city: ['', [Validators.required]],
      category: ['', [Validators.required]],
      fuelType: ['', [Validators.required]],
      transmission: ['', [Validators.required]],
      description: ['', [Validators.required]]
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
        console.error('Creation Failed!', err);
      }
    });
  }

  handleImageUpload(uploadedImages: string[]) {
    this.images = uploadedImages;  
  }
}
