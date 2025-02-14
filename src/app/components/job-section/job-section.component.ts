import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-job-section',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonCardComponent],
  templateUrl: './job-section.component.html',
  styleUrl: './job-section.component.css'
})
export class JobSectionComponent implements OnChanges {

  @Input() title!: string;
  @Input() to!: string;
  @Input() jobs: any[] = [];
  public noList: boolean = true

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobs'] && this.jobs !== undefined) {
      this.noList = this.jobs.length === 0; // Show skeleton if empty
    }
  }



}
