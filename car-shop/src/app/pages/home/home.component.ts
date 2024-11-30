import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { CardSliderComponent } from "../../shared/card-slider/card-slider.component";
import { ErrorPopUpComponent } from "../../shared/error-popup/error-popup.component";
import { ErrorService } from '../../services/error.service';
import { SearchBarComponent } from "../../shared/search-bar/search-bar.component";

@Component({
  selector: 'app-home',
  imports: [SpinnerComponent, CardSliderComponent, ErrorPopUpComponent, SearchBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  recentCars: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private router: Router, private errorService: ErrorService) {}

  ngOnInit(): void {
    this.fetchRecentCars();
  }

  fetchRecentCars(): void {
    this.http.get<any[]>('http://localhost:8800/api/posts/recent').subscribe({
      next: (data) => {
        this.recentCars = data;
        this.loading = false;
        console.log(this.recentCars);
        
      },
      error: (error) => {
        console.error('Failed to fetch recent cars:', error);
        this.loading = false;
        const errorMessage = error.error?.message || 'Failed to fetch recent cars:';
        this.errorService.setError(errorMessage); 
      },
    });
  }
}