import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isOpen = false;
  isDesktop = false;
  navItems = [
    { name: 'Home', link: '/', icon: 'home' },
    { name: 'Freshers', link: '/jobs/fresher', icon: 'school' },
    { name: 'Internships', link: '/jobs/internship', icon: 'work' },
    { name: 'Remote', link: '/jobs/remote', icon: 'laptop' },
    { name: 'Experienced', link: '/jobs/experienced', icon: 'timer' },
    { name: 'Contact', link: '/contact', icon: 'message' }
  ];

  constructor(private breakpoint: BreakpointObserver) { }

  ngOnInit() {
    // Observe when viewport ⩾ 768px
    this.breakpoint
      .observe(['(min-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        this.isDesktop = state.matches;
        if (this.isDesktop) {
          this.isOpen = false;
        }
      });
  }

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMobileMenu() {
    this.isOpen = false;
  }
}
