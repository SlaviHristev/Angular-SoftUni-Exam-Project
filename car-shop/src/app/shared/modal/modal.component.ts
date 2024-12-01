import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modalOverlay" (click)="handleClose()">
      <div class="modalContent" (click)="stopPropagation($event)">
        <span class="close" (click)="handleClose()">X</span>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Output() onClose = new EventEmitter<void>();

  handleClose(): void {
    this.onClose.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
