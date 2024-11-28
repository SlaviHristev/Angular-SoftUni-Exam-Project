import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { AuthService } from '../../services/auth-service.service';
import { UploadWidgetComponent } from "../../shared/upload-widget/upload-widget.component";
// import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
  imports: [ReactiveFormsModule, UploadWidgetComponent]
})
export class EditComponent implements OnInit {
  editForm!: FormGroup;
  images: string[] = [];
  description: string = '';
  uploadWidgetConfig = {
    multiple: true,
    cloudName: 'dknpnmf1m',
    uploadPreset: 'carShop',
    folder: 'carShop'
  };
  loading: boolean = true;
  currentPost: any;
  postId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiRequestService,
    private authService: AuthService,
    // private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.postId);
    
    this.loadPost();
    console.log();
    

    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      price: [0, [Validators.required, Validators.min(1)]],
      yearOfMake: [0, [Validators.required, Validators.min(1)]],
      horsePower: [0, [Validators.required, Validators.min(1)]],
      color: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      category: ['sedan', Validators.required],
      fuelType: ['petrol', Validators.required],
      transmission: ['manual', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadPost(): void {
    this.apiService.get(`/posts/${this.postId}`).subscribe({
      next: (response: any) => {
        this.currentPost = response; 
        this.editForm.patchValue(this.currentPost);
        this.images = this.currentPost.images || [];
        this.description = this.currentPost.description || '';
        this.loading = false;
      },
      error: (err) => {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      // this.notifyService.showError('Invalid form input.');
      return;
    }

    const updatedPost = {
      ...this.editForm.value,
      description: this.description,
      images: this.images
    };

    this.apiService.put(`/posts/edit/${this.postId}`, updatedPost).subscribe({
      next: () => {
        // this.notifyService.showSuccess('Post updated successfully.');
        this.router.navigate([`/catalog/${this.postId}`]);
      },
      error: (err) => {
        // this.notifyService.showError('Failed to update post.');
      }
    });
  }

  handleImageUpload(newImages: string[]): void {
    this.images = [...this.images, ...newImages];
  }

  deleteImage(index: number): void {
    this.images.splice(index, 1);
  }
}
