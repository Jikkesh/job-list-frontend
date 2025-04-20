import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetailItemComponent } from '../../components/detail-item/detail-item.component';
import { MarkdownModule } from 'ngx-markdown';
import { JobListService } from '../../services/job-list.service';

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

  // The job ID from the route (URL param)
  jobId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private joblistService: JobListService,
  ) { }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.getJobById(parseInt(this.jobId, 10));
    }

  }

  /* Fetch the job details from your API*/
  getJobById(jobId: number): void {
    this.joblistService.getJobById(jobId).subscribe((data) => {
      this.job = data;
      if (this.job?.created_at) {
        this.job.date_posted = this.formatJobDate(this.job.created_at);
      }
      if (this.job?.image_url) {
        this.jobImages = this.job.image_url;
      }
    });
  }


  /**Convert the ISO date to something like "Feb 24, 2025"*/
  private formatJobDate(createdAt: string): string {
    const date = new Date(createdAt);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

}
