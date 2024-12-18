import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';
import { ErrorService } from '../../services/error.service';
import { ErrorPopUpComponent } from "../../shared/error-popup/error-popup.component"; 
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ErrorPopUpComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('slideInFromRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class RegisterComponent {
  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {}


  handleSubmit(event: Event) {
    event.preventDefault();
    const form  = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    this.authService.register(username, email, password).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        const errorMessages = err.error?.errors || ['Registration failed'];
        errorMessages.forEach((message: string) => this.errorService.setError(message));
      }
    });
  }
}