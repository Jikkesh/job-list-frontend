import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-form',
    imports: [CommonModule],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css'
})
export class FormComponent {

  formData = {
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
    resume: null
  };

  // Handle file upload (optional)
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.formData.resume = file;
    }
  }

  onSubmit(): void {
    console.log('Form Submitted:', this.formData);
    // Handle form submission logic here
  }



}
