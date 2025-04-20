import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { JobListService } from '../../services/job-list.service';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-job-section',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonCardComponent],
  templateUrl: './job-section.component.html',
  styleUrls: ['./job-section.component.css']
})
export class JobSectionComponent implements OnInit {
  @Input() title!: string;
  @Input() to!: string;
  @Input() category!: string;

  public noList: boolean = true;
  public jobs: any[] = [];

  constructor(private jobListService: JobListService,) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  private loadJobs(): void {
    // Example: fetch 6 jobs of a certain category
    this.jobListService.getJobsByCategory(this.category, 1, 8).subscribe(
      (data) => {
        this.jobs = data.jobs || [];
        this.noList = this.jobs.length === 0;
      },
      (error) => {
        console.error(error);
        this.noList = true;
      }
    );
  }

}
