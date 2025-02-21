import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { JobListService } from '../../services/job-list.service';
import { SafeUrl } from '@angular/platform-browser';
import { JobImageCacheService } from '../../services/job-image-cache.service';

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

  constructor(private jobListService : JobListService,private jobImageCache : JobImageCacheService) {}


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
      this.jobImageCache.getImage(job.id).then(
        (base64) => {
          this.jobImages[job.id] = base64;
        },
        (error) => {
          console.error('Error fetching company logo:', error);
          this.jobImages[job.id] = 'assets/hiring.png';
        }
      );
    });
  }



}
