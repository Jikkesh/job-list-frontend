import { Component } from '@angular/core';
import { RouterOutlet,RouterModule, Routes,Router  } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,LayoutComponent,NavbarComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BaseApp';

  constructor(private router: Router) {
    // Scroll to top on route change
    this.router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
}
