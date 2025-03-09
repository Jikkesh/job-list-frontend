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

  // Dictionary to hold each job's image URL (object URL or fallback)
  public jobImages: { [jobId: string]: SafeUrl | string } = {};

  public noList: boolean = true;
  public jobs: any[] = [];

  constructor(
    private jobListService: JobListService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  private loadJobs(): void {
    // Example: fetch 6 jobs of a certain category
    this.jobListService.getJobsByCategory(this.category, 1, 6).subscribe(
      (data) => {
        this.jobs = data.jobs || [];
        this.noList = this.jobs.length === 0;
        this.fetchJobImages();
      },
      (error) => {
        console.error(error);
        this.noList = true;
      }
    );
  }

  /**
   * For each job, fetch the job image as a Blob.
   * Convert the Blob to a local URL and store it in `jobImages`.
   * If any error occurs, use a fallback image.
   */
  private fetchJobImages(): void {
    this.jobs.forEach((job) => {
      this.jobListService.getJobImage(job.id).subscribe({
        next: (blob: Blob) => {
          // Convert Blob to an object URL
          const objectURL = URL.createObjectURL(blob);
          // If you want to bypass Angular’s security checks, you can sanitize:
          this.jobImages[job.id] =
            this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: (err) => {
          console.error('Error fetching job image:', err);
          // Use fallback image
          this.jobImages[job.id] = 'assets/hiring.png';
        }
      });
    });
  }
}
