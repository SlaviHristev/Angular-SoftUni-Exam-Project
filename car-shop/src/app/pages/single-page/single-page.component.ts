import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { AuthService } from '../../services/auth-service.service';
import { SliderComponent } from "../../shared/slider/slider.component";
import { SocketService } from '../../services/websocket.service';
import { ErrorService } from '../../services/error.service';
import { ErrorPopUpComponent } from "../../shared/error-popup/error-popup.component";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.scss'],
  imports: [SpinnerComponent, RouterLink, SliderComponent, ErrorPopUpComponent],
  animations: [
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class SinglePageComponent implements OnInit {
  
  post: any = null;
  loading = true;
  currentUser: any = null; 
  @Input() isSaved: boolean = false; 
  @Output() savedStatusChange = new EventEmitter<boolean>();

  constructor(
    private apiRequestService: ApiRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private socketService: SocketService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    
    this.currentUser = this.authService.getCurrentUser(); 

    this.fetchPost();
  }

  fetchSavedStatus(): void {
    this.apiRequestService.get(`users/${this.currentUser._id}/saved`).subscribe({
      next: (response: any) => {
        const savedPosts = response || [];
        console.log(response);
        
        this.isSaved = savedPosts.some(
          (savedPost: any) => savedPost._id === this.post?._id
        );
      },
      error: (err) => {
        console.error('Failed to fetch saved posts:', err);
      },
    });
  }

  toggleSavePost(): void {
    if (!this.currentUser) {
      console.error('User not logged in');
      return;
    }

    if (this.isSaved) {
      this.apiRequestService
        .unSavePost(`users/save/${this.post._id}`, {userId: this.currentUser._id})
        .subscribe({
          next: () => {
            this.isSaved = false;
            this.savedStatusChange.emit(this.isSaved);
            console.log('Post unsaved successfully');
          },
          error: (err) => {
            console.error('Failed to unsave post:', err);
          },
        });
    } else {
      this.apiRequestService
        .post(`users/save/${this.post._id}`, {userId: this.currentUser._id})
        .subscribe({
          next: () => {
            this.isSaved = true;
            this.savedStatusChange.emit(this.isSaved);
            console.log('Post saved successfully');

            this.sendSaveNotification();
          },
          error: (err) => {
            console.error('Failed to save post:', err);
          },
        });
    }
  }

  sendSaveNotification(): void {
    const notification = {
      senderId: this.currentUser._id,
      receiverId: this.post.ownerId._id || this.post.ownerId,
      message: `${this.currentUser.username} saved your post.`,
    };


    this.apiRequestService
      .post(`notifications/${notification.receiverId}`, {
        userId: notification.receiverId,
        type: 'save',
        message: notification.message,
      })
      .subscribe({
        next: () => {
          console.log('Notification sent successfully');
        },
        error: (err) => {
          console.error('Failed to send notification:', err);
        },
      });
  }

  fetchPost(): void {
    this.loading = true;
    const postId = this.route.snapshot.paramMap.get('id');
    if (!postId) {
      console.error('No post ID found in route');
      this.loading = false;
      return;
    }

    this.apiRequestService.get(`posts/${postId}`).subscribe({
      next: (response: any) => {
        this.post = response || null;
        console.log(this.post);
      },
      error: (err) => {
        const errorMessages = err.error?.errors || ['Failed to fetch post:'];
        errorMessages.forEach((message: string) => this.errorService.setError(message));
        console.error('Failed to fetch post:', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  deletePost(): void {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    this.apiRequestService.delete(`posts/${this.post._id}`).subscribe({
      next: () => {
        alert('Post deleted successfully');
        this.router.navigate(['/catalog']);
      },
      error: (err) => {
        console.error('Failed to delete post:', err);
        const errorMessages = err.error?.errors || ['Failed to delete post:'];
        errorMessages.forEach((message: string) => this.errorService.setError(message));
      },
    });
  }

  sanitizeHtml(description: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }


  isOwner(): boolean {
    return this.currentUser?._id === this.post?.ownerId?._id;
  
  }
}
