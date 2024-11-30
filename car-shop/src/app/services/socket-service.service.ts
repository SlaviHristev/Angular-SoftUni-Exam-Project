import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket!: Socket;

  constructor() {}

  initializeSocket(userId: string): void {
    this.socket = io('http://localhost:8800', {
      query: { userId },
    });
  }
}