import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../../services/websocket.service';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [ReactiveFormsModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  isChatOpen = false;
  chatReceiver: any;
  chatId: string | null = null;
  onlineUsers: any[] = [];
  messages: any[] = [];
  chatForm!: FormGroup;
  currentUser: any = { _id: 'USER_ID_HERE' }; // Replace with the actual current user data

  @ViewChild('messageEndRef') messageEndRef!: ElementRef;

  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.chatForm = this.fb.group({
      text: ['', Validators.required],
    });

    const currentUserId = this.currentUser._id;

    // Connect to the socket with the current user
    this.socketService.connect(currentUserId);

    // Subscribe to chat and messages updates
    this.chatService.isChatOpen$.subscribe((isOpen) => {
      this.isChatOpen = isOpen;
    });

    this.chatService.chatReceiver$.subscribe((receiver) => {
      this.chatReceiver = receiver;
    });

    this.chatService.chatId$.subscribe((id) => {
      this.chatId = id;
    });

    this.socketService.messages$.subscribe((messages) => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  // Function to handle opening a chat
  openChat(ownerId: string): void {
    this.chatService.openChat(this.currentUser._id, ownerId);
  }

  // Function to handle sending a message
  sendMessage(): void {
    if (this.chatForm.invalid || !this.chatReceiver || !this.chatId) return;

    const { text } = this.chatForm.value;
    this.socketService.sendMessage(this.currentUser._id, this.chatReceiver._id, text);
    this.chatForm.reset();
  }

  // Function to automatically scroll to the latest message
  scrollToBottom(): void {
    setTimeout(() => {
      this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  // Track function for ngFor optimization
  trackById(index: number, item: any): string {
    return item._id; // Assuming each message has a unique _id
  }
}
