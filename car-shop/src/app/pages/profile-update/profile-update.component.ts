import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { ApiRequestService } from '../../services/api-request.service';
import { UploadWidgetComponent } from "../../shared/upload-widget/upload-widget.component";
import { User } from '../../types/User';  
import { ErrorService } from '../../services/error.service';
import { ErrorPopUpComponent } from "../../shared/error-popup/error-popup.component";

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  imports: [UploadWidgetComponent, ReactiveFormsModule, ErrorPopUpComponent]
})
export class ProfileUpdateComponent implements OnInit {
  profileForm!: FormGroup;
  avatar: string[] = [];
  currentUser: User | null = null; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiRequestService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      username: [this.currentUser?.username, [Validators.required, Validators.minLength(4)]],
      email: [this.currentUser?.email, [Validators.required, Validators.minLength(10), Validators.email]],
      password: ['', [Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
        this.errorService.setError("Form is invalid"); 
      return;
    }

    const { username, email, password } = this.profileForm.value;

    this.apiService
      .put<User>(`users/${this.currentUser?._id}`, {
        username,
        email,
        password,
        avatar: this.avatar[0],
      })
      .subscribe({
        next: (response: User) => {
          this.authService.updateUser(response); 
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Profile update failed';
        this.errorService.setError(errorMessage); 
        },
      });
  }

  handleImageUpload(uploadedImages: string[]) {
    this.avatar = uploadedImages;  
  }
}
