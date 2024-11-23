import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { User } from '../../types/User';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user; 
    });
  }

  handleLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.updateUser(null);
        this.router.navigate(['/']);
      },
      error: (err) => console.error(err)
    });
  }
}