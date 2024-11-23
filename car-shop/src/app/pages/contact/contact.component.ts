import { Component, ElementRef, ViewChild, } from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  @ViewChild('formRef') formRef!: ElementRef;
  error: boolean | null = null;
  success: boolean | null = null;

  sendEmail(event: Event) {
    event.preventDefault();
    const form = this.formRef.nativeElement;

    emailjs
      .sendForm('service_9bhicrs', 'template_rwejh1w', form, 'nt4mxQ5ZpzzCtJ9XP')
      .then(
        () => {
          this.success = true;
          this.error = null;
          form.reset();
        },
        () => {
          this.error = true;
          this.success = null;
        }
      );
  }
}