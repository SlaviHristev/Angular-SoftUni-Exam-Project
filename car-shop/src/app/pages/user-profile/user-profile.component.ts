import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { AuthService } from '../../services/auth-service.service';
import { ErrorService } from '../../services/error.service';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { CardComponent } from "../../shared/card/card.component";
// import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [SpinnerComponent, CardComponent]
})
export class UserProfileComponent implements OnInit {
  userId: string = '';
  currentUser: any = null;
  profile: any = null;
  posts: any[] = [];
  loading: boolean = true;
  isChatOpen: boolean = false;
  chatReceiver: any = null;
  chatId: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiRequestService: ApiRequestService,
    private authService: AuthService,
    private errorService: ErrorService,
    // private chatService: ChatService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.fetchProfileInfo();
    });
  }

  fetchProfileInfo(): void {
    this.loading = true;
    this.apiRequestService.get(`users/profiles/${this.userId}`).subscribe({
      next: (profileRes: any) => {
        this.profile = profileRes;
        this.apiRequestService.get(`posts/user/${this.userId}`).subscribe({
          next: (postRes: any) => {
            this.posts = postRes;
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to fetch user posts:', err);
            this.errorService.showError('Failed to fetch user posts.');
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch user info:', err);
        this.errorService.showError('Failed to fetch user info.');
        this.loading = false;
      }
    });
  }

  openChat(receiverId: string): void {
    this.chatReceiver = receiverId;
    this.chatId = ''; 
    this.isChatOpen = true;
  }

  closeChat(): void {
    this.isChatOpen = false;
  }
}
