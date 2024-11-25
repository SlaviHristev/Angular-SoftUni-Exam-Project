import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() item: any; 
  @Input() currentUser: any; 

  isOwner(): boolean {
    return this.currentUser?._id === this.item?.ownerId;
  }

  constructor(private router: Router) {}

  openChat(ownerId: string) {
    
    console.log(`Open chat with ownerId: ${ownerId}`);
  }
}