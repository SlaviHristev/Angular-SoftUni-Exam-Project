import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  private messagesSubject = new BehaviorSubject<any[]>([]);
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  private onlineUsersSubject = new BehaviorSubject<any[]>([]);

  messages$ = this.messagesSubject.asObservable();
  notifications$ = this.notificationsSubject.asObservable();
  onlineUsers$ = this.onlineUsersSubject.asObservable();

  private readonly SOCKET_SERVER_URL = 'http://localhost:8900';

  connect(userId: string): void {
    this.socket = io(this.SOCKET_SERVER_URL);

    this.socket.emit('addUser', userId);

    this.socket.on('getUsers', (users: any[]) => {
      this.onlineUsersSubject.next(users);
    });

    this.socket.on('getMessage', (message: any) => {
      const currentMessages = this.messagesSubject.getValue();
      const isDuplicate = currentMessages.some(
        (msg) => msg.createdAt === message.createdAt && msg.senderId === message.senderId
      );
      if (!isDuplicate) {
        this.messagesSubject.next([...currentMessages, message]);
      }
    });

    this.socket.on('receiveNotification', (notification: any) => {
      const currentNotifications = this.notificationsSubject.getValue();
      this.notificationsSubject.next([...currentNotifications, notification]);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.off('getUsers');
      this.socket.off('getMessage');
      this.socket.off('receiveNotification');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(senderId: string, receiverId: string, text: string): void {
    if (this.socket) {
      this.socket.emit('sendMessage', { senderId, receiverId, text });
    }
  }

  sendNotification(senderId: string, receiverId: string, message: string): void {
    if (this.socket) {
      this.socket.emit('sendNotification', { senderId, receiverId, message });
    }
  }
}
