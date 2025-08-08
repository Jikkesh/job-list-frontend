import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterModule, Routes, Router } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';

declare const ezstandalone: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LayoutComponent, NavbarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'BaseApp';
  constructor(private router: Router) { }

  ngAfterViewInit() {
    // Initialize Ezoic ads
    ezstandalone.cmd.push(() => {
      ezstandalone.showAds();
    });
  }
}
