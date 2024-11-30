import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { AuthService } from '../../services/auth-service.service';
import { SocketService } from '../../services/socket-service.service';


@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() item: any; 
  @Input() currentUser: any; 
  @Input() isSaved: boolean = false; 
  @Output() savedStatusChange = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private apiService: ApiRequestService,
    private authService: AuthService,
    private socketService: SocketService
  ) {}


  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();  
    if (this.currentUser) {
      this.fetchSavedStatus();
    }
    
  }
  isOwner(): boolean {    
    return this.currentUser?._id === this.item?.ownerId;
  }

  

  fetchSavedStatus(): void {
    this.apiService.get(`users/${this.currentUser._id}/saved`).subscribe({
      next: (response: any) => {
        const savedPosts = response || [];
        console.log(response);
        
        this.isSaved = savedPosts.some(
          (savedPost: any) => savedPost._id === this.item?._id
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
      this.apiService
        .unSavePost(`users/save/${this.item._id}`, {userId: this.currentUser._id})
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
      this.apiService
        .post(`users/save/${this.item._id}`, {userId: this.currentUser._id})
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
      receiverId: this.item.ownerId._id || this.item.ownerId,
      message: `${this.currentUser.username} saved your post.`,
    };


    if (this.socketService.socket) {
      this.socketService.socket.emit('sendNotification', notification);
    }

    this.apiService
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

  openChat(ownerId: string): void {
    console.log(`Open chat with ownerId: ${ownerId}`);

  }
}
