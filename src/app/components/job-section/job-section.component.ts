import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { JobListService } from '../../services/job-list.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-job-section',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonCardComponent],
  templateUrl: './job-section.component.html',
  styleUrl: './job-section.component.css'
})
export class JobSectionComponent implements  OnInit {
  @Input() title!: string;
  @Input() to!: string;
  @Input() category!: string;
  public jobImages: { [key: string]: SafeUrl } = {}; 

  public noList: boolean = true;
  public jobs : any[] = []

  constructor(private jobListService : JobListService) {}


  ngOnInit(): void {
    this.loadJobs()
  }

  private updateJobListState(): void {
    this.noList = this.jobs.length === 0;
  }

  private loadJobs(): void {
    this.jobListService.getJobsByCategory(this.category, 1, 5).subscribe(
      (data) => {
        this.jobs = data.jobs; 
        this.updateJobListState();
        this.fetchJobImages();
      },
      (error) => {
        console.error(error); 
      }
    );
  }

  private fetchJobImages(): void {
    this.jobs.forEach((job) => {
      this.jobListService.getJobImage(job.id).subscribe(blob => {
        const objectURL = URL.createObjectURL(blob);
        this.jobImages[job.id] = objectURL;
      });
    });
  }


}
