import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  private baseURL = 'http://localhost:8800/api';

  constructor(private http: HttpClient) {}

  createPost(postData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/posts`, postData);
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseURL}/${endpoint}`, { withCredentials: true });
  }


  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseURL}/${endpoint}`, data, { withCredentials: true });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseURL}/${endpoint}`, data, { withCredentials: true });
  }


  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseURL}/${endpoint}`, { withCredentials: true });
  }
}