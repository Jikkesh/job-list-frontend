import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-section.component.html',
  styleUrl: './job-section.component.css'
})
export class JobSectionComponent {
  @Input() title!: string;
  @Input() to!: string;
  @Input() jobs: any[] = [];

  constructor(){}

}
