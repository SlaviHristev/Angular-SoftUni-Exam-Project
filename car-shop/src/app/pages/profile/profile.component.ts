import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { ApiRequestService } from '../../services/api-request.service';
import { CardComponent } from "../../shared/card/card.component";
import { RouterLink } from '@angular/router';
import { ErrorPopUpComponent } from "../../shared/error-popup/error-popup.component";
import { ErrorService } from '../../services/error.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalComponent } from "../../shared/modal/modal.component";
import { ChatComponent } from "../../shared/chat/chat.component";
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CardComponent, RouterLink, ErrorPopUpComponent, ModalComponent, ChatComponent],
  animations: [
    trigger('slideInFromBottom', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  userPosts: any[] = [];
  savedPosts: any[] = [];
  chats: any[] = [];
  loading: boolean = true;

  isChatOpen: boolean = false;
  chatReceiver: any = null;
  chatId: string | null = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiRequestService,
    private errorService: ErrorService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.fetchUserPosts();
      this.fetchSavedPosts();
      this.fetchUserChats();
    } else {
        this.errorService.setError("Failed to fetch User Information!"); 
      this.loading = false;
    }
  }

  fetchUserPosts() {
    this.apiService.get(`posts/user/${this.currentUser._id}`).subscribe({
      next: (response: any) => {
        this.userPosts = response || []; 
      },
      error: (error) => {
        console.error('Failed to fetch user posts:', error);
        this.userPosts = []; 
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  
  fetchSavedPosts() {
    this.apiService.get(`users/${this.currentUser._id}/saved`).subscribe({
      next: (response: any) => {
        this.savedPosts = response || []; 
      },
      error: (error) => {
        console.error('Failed to fetch saved posts:', error);
        this.savedPosts = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  
  fetchUserChats() {
    this.apiService.get(`chats/user/${this.currentUser._id}`).subscribe({
      next: (response: any) => {
        console.log('Chats API Response:', response);
  
        this.chats = response
          ?.filter((chat: any) => chat?.messages?.length > 0) 
          .map((chat: any) => {
         
            const otherUserId = chat.userIds.find(
              (id: string) => id !== this.currentUser._id
            );
            return {
              ...chat,
              otherUser: otherUserId, 
            };
          })
          .filter((chat: any) => chat.otherUser); 
  
        console.log('Filtered Chats:', this.chats);
      },
      error: (error) => {
        console.error('Failed to fetch user chats:', error);
        this.chats = [];
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  

  openChat(ownerId: string): void {
    
    this.chatService.openChat(this.currentUser._id, ownerId);
    this.isChatOpen = true;
  }

  closeChat() {
    this.isChatOpen = false;
    this.chatReceiver = null;
    this.chatId = null;
  }
}
