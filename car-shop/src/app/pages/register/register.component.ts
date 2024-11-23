import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { ErrorService } from '../../services/error.service'; 

@Component({
  selector: 'app-register',
  imports:[RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
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
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    this.authService.register(username, email, password).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        const errorMessages = err.error?.errors || ['Registration failed'];
        errorMessages.forEach((message: string) => this.errorService.showError(message));
      }
    });
  }
}