import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';


@Component({
  selector: 'app-error-pop-up',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
})
export class ErrorPopUpComponent implements OnInit {
  error: string | null = null;

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
 
    this.errorService.error$.subscribe((error) => {
      this.error = error;
    });
  }

  closeError(): void {
    this.errorService.clearError();
  }
}
