import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-contact',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  loading = false;
  success = false;
  error = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    // Initialize the form with controls and validators
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = false;

    const formData = this.contactForm.value;

    this.userService.sendMessage(formData).subscribe(
      () => {
        this.success = true;
        this.loading = false;
        this.contactForm.reset();
        setTimeout(() => this.success = false, 5000);
      },
      (error) => {
        this.error = 'Failed to send message. Please try again later.';
        this.loading = false;
        console.error('Contact form error:', error);
      }
    );
  }
}
