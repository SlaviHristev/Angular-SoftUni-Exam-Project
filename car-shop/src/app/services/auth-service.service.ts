import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../types/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:8800/api/auth/login`, { username, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:8800/api/auth/register`, { username, email, password });
  }

  logout(): Observable<void> {
    return this.http.post<void>('http://localhost:8800/api/auth/logout', {}, { withCredentials: true });
  }
}