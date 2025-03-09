import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { JobListService } from '../../services/job-list.service';

@Component({
    selector: 'app-card',
    imports: [CommonModule],
    templateUrl: './card.component.html',
    styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  @Input() id!: string;
  @Input() title!: string;
  @Input() company!: string;
  @Input() companyLogo!: string;
  @Input() location!: string;
  @Input() salary!: string;
  @Input() type!: string;
  @Input() postedDate!: string;
  @Input() description!: string;


  public logoUrl: string = 'assets/hiring.png';  // Default logo
  jobImages: string | null = null;

  constructor(private jobService: JobListService, private joblistService: JobListService) { }

  ngOnInit(): void {
    if (this.id) {
      this.fetchJobImage(this.id)
    }
  }


  /**
     * Fetch the job image as a Blob, convert to a local URL.
     * If it fails, use a fallback image.
     */
  private fetchJobImage(jobId: string): void {
    this.joblistService.getJobImage(jobId).subscribe({
      next: (blob: Blob) => {
        // Convert Blob to an object URL
        console.log('Blob:', blob);
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
