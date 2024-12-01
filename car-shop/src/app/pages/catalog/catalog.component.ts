import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../services/api-request.service';
import { CardComponent } from "../../shared/card/card.component";
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { SearchBarComponent } from "../../shared/search-bar/search-bar.component";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  imports: [CardComponent, SpinnerComponent, SearchBarComponent],
  animations: [
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CatalogComponent implements OnInit {
  posts: any[] = [];
  loading = true;

  constructor(
    private apiRequestService: ApiRequestService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.loading = true;

  
    this.route.queryParams.subscribe((params) => {
      const { fuelType, category, city, minPrice, maxPrice } = params;

      
      if (fuelType || category || city || minPrice || maxPrice) {
        this.apiRequestService.get('posts/search', {
          params: {
            fuelType,
            category,
            city,
            minPrice,
            maxPrice,
          },
        }).subscribe({
          next: (response: any) => {
            this.posts = response || [];
            console.log(this.posts);
          },
          error: (err) => {
            console.error('Failed to fetch posts:', err);
            alert('Failed to fetch posts');
          },
          complete: () => {
            this.loading = false;
          },
        });
      } else {
        
        this.apiRequestService.get('posts').subscribe({
          next: (response: any) => {
            this.posts = response || [];
            console.log(response);
            
          },
          error: (err) => {
            console.error('Failed to fetch posts:', err);
            alert('Failed to fetch posts');
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    });
  }
}
