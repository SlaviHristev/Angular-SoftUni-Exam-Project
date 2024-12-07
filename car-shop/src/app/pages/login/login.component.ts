import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { ErrorService } from '../../services/error.service';
import { ErrorPopUpComponent } from "../../shared/error-popup/error-popup.component";
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ErrorPopUpComponent, RouterLink],
  animations: [
    trigger('slideInFromLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  handleSubmit(event: Event): void {
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
        this.errorService.setError(errorMessage); 
      }
    });
  }
}
