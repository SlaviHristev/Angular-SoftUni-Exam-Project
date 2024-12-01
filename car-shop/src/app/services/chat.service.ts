import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private isChatOpenSubject = new BehaviorSubject<boolean>(false);
  private chatReceiverSubject = new BehaviorSubject<any | null>(null);
  private chatIdSubject = new BehaviorSubject<string | null>(null);

  isChatOpen$ = this.isChatOpenSubject.asObservable();
  chatReceiver$ = this.chatReceiverSubject.asObservable();
  chatId$ = this.chatIdSubject.asObservable();

  private readonly API_BASE_URL = 'http://localhost:8800/api';

  constructor(private http: HttpClient) {}

  openChat(currentUserId: string, ownerId: string): void {
    this.http.get(`${this.API_BASE_URL}/users/profiles/${ownerId}`, {withCredentials: true}).subscribe({
      next: (receiver: any) => {
        this.chatReceiverSubject.next(receiver);
  
        this.http
          .post(`${this.API_BASE_URL}/chats/startChat`, {
            userId1: currentUserId,
            userId2: ownerId,
          })
          .subscribe({
            next: (chat: any) => {
              this.chatIdSubject.next(chat._id);
              this.isChatOpenSubject.next(true);
            },
            error: (error) => {
              console.error('Failed to start chat:', error);
            },
          });
      },
      error: (error) => {
        if (error.status === 0) {
          console.error('Failed to connect to the backend server. Please ensure the server is running.', error);
        } else {
          console.error('Failed to fetch chat receiver:', error);
        }
      },
    });
  }

  closeChat(): void {
    this.isChatOpenSubject.next(false);
    this.chatReceiverSubject.next(null);
    this.chatIdSubject.next(null);
  }
}
