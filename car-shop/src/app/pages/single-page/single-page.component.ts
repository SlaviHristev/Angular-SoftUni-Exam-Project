import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { AuthService } from '../../services/auth-service.service';
import { CardSliderComponent } from "../../shared/card-slider/card-slider.component";

@Component({
  selector: 'app-single-page',
  templateUrl: './single-page.component.html',
  styleUrls: ['./single-page.component.scss'],
  imports: [SpinnerComponent, RouterLink, CardSliderComponent],
})
export class SinglePageComponent implements OnInit {
  post: any = null;
  loading = true;
  currentUser: any = null; 

  constructor(
    private apiRequestService: ApiRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    
    this.currentUser = this.authService.getCurrentUser(); 

    this.fetchPost();
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
        console.log(this.currentUser);
        console.log(this.post);
      },
      error: (err) => {
        console.error('Failed to fetch post:', err);
        alert('Failed to fetch post');
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
        alert('Failed to delete post');
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
