import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navItems = [
    { name: 'Home', link: '/', icon: 'home' },
    { name: 'Freshers Jobs', link: '/jobs/fresher', icon: 'school' },
    { name: 'Internships', link: '/jobs/internship', icon: 'work' },
    { name: 'Remote Jobs', link: '/jobs/remote', icon: 'laptop' },
    { name: 'Part-Time Jobs', link: '/jobs/part-time', icon: 'timer' },
    { name: 'Contact', link: '/contact', icon: 'message' }
  ];
}
