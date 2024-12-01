import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { ApiRequestService } from '../../services/api-request.service';
import { CardComponent } from "../../shared/card/card.component";
import { RouterLink } from '@angular/router';
import { ErrorPopUpComponent } from "../../shared/error-popup/error-popup.component";
import { ErrorService } from '../../services/error.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CardComponent, RouterLink, ErrorPopUpComponent],
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
        
        this.chats = response?.data?.filter((chat: any) => chat?.messages?.length > 0) || [];
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

  openChat(chatId: string, receiver: any) {
    this.chatReceiver = receiver;
    this.chatId = chatId;
    this.isChatOpen = true;
  }

  closeChat() {
    this.isChatOpen = false;
    this.chatReceiver = null;
    this.chatId = null;
  }
}
