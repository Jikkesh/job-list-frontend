import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactItems = [
    {
      icon: 'mail',
      title: 'Email',
      content: 'support@offcampusjobs.com',
    },
    {
      icon: 'phone',
      title: 'Phone',
      content: '+1 (555) 123-4567',
    },
    {
      icon: 'map-pin',
      title: 'Address',
      content: '123 Job Street, Career City, 12345',
    }
  ];

  officeHours = [
    'Monday - Friday: 9:00 AM - 6:00 PM',
    'Saturday: 10:00 AM - 2:00 PM',
    'Sunday: Closed'
  ];
}
