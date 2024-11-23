import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-login',
  imports:[RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    this.authService.login(username, password).subscribe({
      next: (user) => {
        this.authService.updateUser(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Login failed';
        this.errorService.showError(errorMessage);
      }
    });
  }
}