import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { ApiRequestService } from '../../services/api-request.service';
import { CardComponent } from "../../shared/card/card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CardComponent, RouterLink]
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
    private apiService: ApiRequestService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();

    if (this.currentUser) {
      this.fetchUserPosts();
      this.fetchSavedPosts();
      this.fetchUserChats();
    } else {
      console.error('Current user is not available.');
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
        this.savedPosts = response?.data || []; 
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
