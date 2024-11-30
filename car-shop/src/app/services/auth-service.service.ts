import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../types/User';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient,private errorService: ErrorService,) {
    // Load user data from localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  updateUser(user: User | null): void {
    this.currentUserSubject.next(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user)); // Save to localStorage
    } else {
      localStorage.removeItem('currentUser'); // Clear localStorage
    }
  }

  login(username: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.http
        .post<User>(`http://localhost:8800/api/auth/login`, { username, password }, { withCredentials: true })
        .subscribe({
          next: (user) => {
            this.updateUser(user);
            observer.next(user);
            observer.complete();
          },
          error: (err) =>{
            console.log(err);
            
            const errorMessage = err.error?.message || 'Login failed';
            this.errorService.setError(errorMessage);
          }
        });
    });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`http://localhost:8800/api/auth/register`, { username, email, password });
  }

  logout(): Observable<void> {
    return new Observable((observer) => {
      this.http.post<void>('http://localhost:8800/api/auth/logout', {}, { withCredentials: true }).subscribe({
        next: () => {
          this.updateUser(null);
          observer.next();
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
