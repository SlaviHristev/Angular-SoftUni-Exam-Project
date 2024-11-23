import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";

@Component({
  selector: 'app-home',
  imports: [SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  recentCars: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchRecentCars();
  }

  fetchRecentCars(): void {
    this.http.get<any[]>('http://localhost:8800/api/posts/recent').subscribe({
      next: (data) => {
        this.recentCars = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to fetch recent cars:', error);
        this.loading = false;
        alert('Failed to fetch recent cars');
      },
    });
  }
}