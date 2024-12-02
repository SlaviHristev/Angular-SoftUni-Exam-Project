import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../../services/websocket.service';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [ReactiveFormsModule],
})
export class ChatComponent implements OnInit, OnDestroy {
  isChatOpen = false;
  chatReceiver: any;
  chatId: string | null = null;
  onlineUsers: any[] = [];
  messages: any[] = [];
  chatForm!: FormGroup;
  currentUser: any;

  private subscriptions: Subscription = new Subscription();

  @ViewChild('messageEndRef') messageEndRef!: ElementRef;

  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user._id) {
      console.error('Current user is not defined or invalid');
      return;
    }

    this.currentUser = { _id: user._id };

    this.chatForm = this.fb.group({
      text: ['', Validators.required],
    });

    const currentUserId = this.currentUser._id;

    this.socketService.connect(currentUserId);

    this.subscriptions.add(
      this.chatService.isChatOpen$.subscribe((isOpen) => {
        this.isChatOpen = isOpen;
      })
    );

    this.subscriptions.add(
      this.chatService.chatReceiver$.subscribe((receiver) => {
        this.chatReceiver = receiver;
      })
    );

    this.subscriptions.add(
      this.chatService.chatId$.subscribe((id) => {
        this.chatId = id;
        if (id) {
          this.fetchChatHistory();
        }
      })
    );

    this.subscriptions.add(
      this.socketService.messages$.subscribe((newMessages) => {
        this.messages = [...this.messages, ...newMessages];
        this.scrollToBottom();
      })
    );
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.subscriptions.unsubscribe();
  }

  private fetchChatHistory(): void {
    if (!this.chatId) return;

    this.subscriptions.add(
      this.chatService.getChatHistory(this.chatId).subscribe({
        next: (res) => {
          this.messages = res.messages;
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Failed to fetch chat history:', error);
        },
      })
    );
  }

  openChat(ownerId: string): void {
    if (!this.currentUser || !this.currentUser._id) {
      console.error('Current user is not set');
      return;
    }

    this.chatService.openChat(this.currentUser._id, ownerId);
  }

  sendMessage(): void {
    if (
      this.chatForm.invalid ||
      !this.chatReceiver ||
      !this.chatId ||
      !this.currentUser ||
      !this.currentUser._id
    ) {
      console.error('Invalid form submission or missing chat details');
      return;
    }
  
    const { text } = this.chatForm.value;
  
    this.subscriptions.add(
      this.chatService
        .sendMessage({
          chatId: this.chatId,
          senderId: this.currentUser._id,
          text,
        })
        .subscribe({
          next: (res) => {

            const isAlreadyAdded = this.messages.some(
              (msg) => msg._id === res._id
            );
  
            if (!isAlreadyAdded) {
              this.messages = [...this.messages, res];
              this.scrollToBottom();
            }
  
            this.chatForm.reset();
          },
          error: (error) => {
            console.error('Failed to send message:', error);
          },
        })
    );
    console.log(this.currentUser._id);
    console.log(this.chatReceiver._id);
    
    this.socketService.sendMessage(this.currentUser._id, this.chatReceiver._id, text);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }

  trackById(index: number, item: any): string {
    return item._id;
  }
}
