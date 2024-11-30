import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
  categories = ['sedan', 'coupe', 'combi', 'suv', 'hatchback'];

  query: any = {
    fuelType: 'petrol',
    category: 'sedan',
    city: '',
    minPrice: 0,
    maxPrice: 0,
  };

  constructor(private router: Router) {}

  handleChange(event: Event, key: string): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    this.query[key] = target.value;
  }

  search(): void {
    const { fuelType, category, city, minPrice, maxPrice } = this.query;
    this.router.navigate(['/catalog'], {
      queryParams: {
        fuelType,
        category,
        city,
        minPrice: minPrice || 0,
        maxPrice: maxPrice || 0,
      },
    });
  }
}
