import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isOpen = false;
  isDesktop = false;
  navItems = [
    { name: 'Home', link: '/', icon: 'home' },
    { name: 'Freshers', link: '/jobs/fresher', icon: 'school' },
    { name: 'Experienced', link: '/jobs/experienced', icon: 'timer' },
    { name: 'Internships', link: '/jobs/internship', icon: 'work' },
    { name: 'Remote', link: '/jobs/remote', icon: 'laptop' },
    { name: 'Contact', link: '/contact', icon: 'message' }
  ];

  ngOnInit() {
    this.checkWindowSize(); // Check initial window size
  }

  // Listen to window resize
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowSize();
  }

  // Update isDesktop based on current window width
  private checkWindowSize(): void {
    this.isDesktop = window.innerWidth >= 768;
    // If we switch from mobile to desktop, ensure the mobile menu is closed
    if (this.isDesktop) {
      this.isOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMobileMenu() {
    this.isOpen = false;
  }
}
