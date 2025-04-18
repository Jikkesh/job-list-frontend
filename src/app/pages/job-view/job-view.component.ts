import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetailItemComponent } from '../../components/detail-item/detail-item.component';
import { MarkdownModule } from 'ngx-markdown';
import { JobListService } from '../../services/job-list.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-job-view',
  standalone: true,
  imports: [CommonModule, DetailItemComponent, MarkdownModule],
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.css']
})
export class JobViewComponent implements OnInit {
  job: any = null;
  jobImages: string | null = null;
  total_applied: number = 500;
  date_posted: string = '2021-07-01';
  public sanitizedHtmlVersion: any;

  // The job ID from the route (URL param)
  jobId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private joblistService: JobListService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.getJobById(parseInt(this.jobId, 10));
      this.fetchJobImage(this.jobId);
    }

  }

  /**
   * Fetch the job details from your API
   */
  getJobById(jobId: number): void {
    this.joblistService.getJobById(jobId).subscribe((data) => {
      this.job = data;
      if (this.job?.created_at) {
        this.job.date_posted = this.formatJobDate(this.job.created_at);
      }
    
      console.log(this.job);
      // this.processAllHtmlFields();
    });
  }

  processAllHtmlFields(): void {
    // List of all fields to process
    const fieldsToProcess = [
      'job_description',
      'key_responsibilty',
      'about_company',
      'selection_process',
      'qualification'
    ];

    // Process each field if it exists
    fieldsToProcess.forEach(field => {
      console.log(this.job[field]);
      if (this.job[field]) {
        this.sanitizedHtmlVersion[field] = this.sanitizer.bypassSecurityTrustHtml(this.job[field])
      }
    });
    console.log(this.sanitizedHtmlVersion);
  }

  formatMarkdown(text: string): string {
    // Convert bullet points with proper line breaks
    return text
      .replace(/\*\*/g, '\n\n**') // Add line breaks before headers
      .replace(/• /g, '\n* ')    // Convert bullets to markdown list items
      .replace(/\n{3,}/g, '\n\n'); // Clean up excess line breaks
  }

  /**
   * Convert the ISO date to something like "Feb 24, 2025"
   */
  private formatJobDate(createdAt: string): string {
    const date = new Date(createdAt);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Fetch the job image as a Blob, convert to a local URL.
   * If it fails, use a fallback image.
   */
  private fetchJobImage(jobId: string): void {
    this.joblistService.getJobImage(jobId).subscribe({
      next: (blob: Blob) => {
        // Convert Blob to an object URL
        const objectURL = URL.createObjectURL(blob);
        this.jobImages = objectURL;
      },
      error: (err) => {
        console.error('Error fetching job image:', err);
        this.jobImages = 'assets/hiring.png';
      }
    });
  }
}
