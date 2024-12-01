import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../../services/websocket.service';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';

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
  currentUser: any;

  @ViewChild('messageEndRef') messageEndRef!: ElementRef;

  constructor(
    private socketService: SocketService,
    private chatService: ChatService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.currentUser = { _id: this.authService.getCurrentUser()?._id };

    this.chatForm = this.fb.group({
      text: ['', Validators.required],
    });

    const currentUserId = this.currentUser._id;


    this.socketService.connect(currentUserId);


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


  openChat(ownerId: string): void {
    console.log(ownerId);
    
    this.chatService.openChat(this.currentUser._id, ownerId);
  }


  sendMessage(): void {
    console.log(this.chatForm.invalid);
    console.log(this.chatReceiver);
    console.log(this.chatId);
    
    if (this.chatForm.invalid || !this.chatReceiver || !this.chatId) return;
    
    
    const { text } = this.chatForm.value;
 
    this.socketService.sendMessage(this.currentUser._id, this.chatReceiver._id, text);
    this.chatForm.reset();
  }


  scrollToBottom(): void {
    setTimeout(() => {
      this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }


  trackById(index: number, item: any): string {
    return item._id; 
  }
}